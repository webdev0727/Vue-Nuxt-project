<template>
<div>
    <kuc-page-header :title="title"></kuc-page-header>
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" class="bg-white px-2 mt-2">
        <!-- 姓名（英文） prop="name_en" -->
        <el-form-item>
            <el-input v-model="user_name" placeholder="请输入对方手机号或邮箱">
                <template slot="prepend">账号</template>
                <template slot="append">
                    <!-- <span class="text-danger"></span> -->
                    <el-button type="text" class="text-danger mr-1" @click="handleSearch" :disabled="!user_name">查询匹配</el-button>

                </template>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-input :value="info_opposite.name" class="text-right" placeholder="王希孟" readonly>
                <template slot="prepend">{{$t('name.real')}}</template>
            </el-input>
        </el-form-item>
                
        <ku-sex v-model="info_opposite.gender" readonly/>
        <ku-line />

        <el-form-item label="">
            <el-input :value="info_opposite.position" class="text-right" placeholder="经理" readonly>
                <template slot="prepend">{{$t('duty_position')}}</template>
            </el-input>
        </el-form-item>

        <el-form-item label="">
            <el-input :value="info_opposite.company" class="text-right" placeholder="公司" readonly>
                <template slot="prepend">{{$t('company.name')}}</template>
            </el-input>
        </el-form-item>   
             
        <div class="align-items-center py-1 d-flex">
            <p class="text-nowrap mr-2">{{$t('group.sel')}}</p>
            <el-select v-model="info.opposite_group_id" :placeholder="$t('select')" class="w-100 text-right" >
                <el-option v-for="item in group_for_seller" :key="'setting_'+ item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
        <div class="el-form-item__error" v-if="error.group">{{error.group}}</div>

    </el-form>

    <el-row :gutter="20" class="px-4 my-4">
        <el-col :span="12" class="">
            <el-button type="primary" round class="w-100" :disabled="!info.opposite_id" @click="handleSave">{{$t('confirm.ok')}}</el-button>
        </el-col>
        <el-col :span="12">
            <el-button type="primary" round class="w-100" plain @click="goBack">{{$t('confirm.cancle')}}</el-button>
        </el-col>
    </el-row>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { userSearch } from "~/api/user"
import { add, getList } from "~/api/opposite"
import { getInfo } from "~/api/user"
export default {
    middleware: ['authenticated', 'member_2'],
    name: "BuyerGroupNewEdit",
    head(){
        return {
            title: this.$t('buyer.my')
        }
    },
    data() {
        return {
            title_arr: ['添加买家', '更新买家'],
            type: this.$route.params.id,
            info: {
                id: this.$route.params.id == 'new' ? '' : this.$route.params.id,
                isbuyer: 1,
                opposite_group_id: '',
                opposite_id: false
            },
            user_name: "",
            info_opposite: {
                name: "",
                gender: 0,
                position: "",
                company: "",
            },
            rules: {},
            error: {
                group: false
            }
        }
    },
    computed: {
        ...mapState('opposite', ['group_for_seller']),
        ...mapGetters('opposite', ['hasSellerGroup']),
        title: function () {
            return this.type == "new" ? this.title_arr[0] : this.title_arr[1]
        }
    },
    methods: {
        ...mapActions('opposite', ['getSellerGroup']),
        setUserInfo(user) {
            this.info_opposite.name = user.name[this.$i18n.locale]
            this.info_opposite.gender = user.gender
            this.info_opposite.position = user.position[this.$i18n.locale]
            this.info_opposite.company = this.gsv(['name', this.$i18n.locale], user.company)
            this.info.opposite_id = user.id
            this.user_name = user.phone || user.email
        },
        handleSearch() {
            console.log(this.user_name)
            userSearch(this.user_name).then(({ user }) => {
                if (user) {
                    this.setUserInfo(user)
                } else {
                    this.$notify({
                        title: this.$t('error'),
                        message: this.$t('msg.no_user'),
                        type: 'error',
                        duration: 1000
                    });
                }
            })
        },
        handleSave() {
            if (!this.info.opposite_group_id) {
                if (!this.hasSellerGroup) {
                    this.$confirm("You have to create at least one group. Do you want to create group?", this.$t('warning'), {
                        confirmButtonText: this.$t('confirm.ok'),
                        cancelButtonText: this.$t('confirm.cancle'),
                        type: 'warning',
                        showClose: false,                
                        showCancelButton: true,
                        confirmButtonClass: 'text-danger',
                        cancelButtonClass: 'border-right',
                        customClass: 'ku-confirm',
                        dangerouslyUseHTMLString: true,
                        center: true,
                    }).then(() => {
                        this.$router.push({ path: "/my/sell/buyer/group/new" })
                    }).catch(() => {})
                    return false
                } else {
                    this.error.group = this.$t('valid.required', ['group'])
                }
                return false
            } else {
                this.error.group = false
                this.$store.dispatch("common/setLoading")
                let da = Object.assign({}, this.info)
                if (!da.id) delete da.id
                add(da).then(res => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.msg'),
                        type: 'success'
                    });
                    this.$router.replace({path: '/my/sell/buyer'})
                }).finally(() => {
                    this.$store.dispatch("common/setLoading", false)
                })
            }
        },        
        handleNoGroup(e) {
            if (e.code == 400) {
                this.$router.push({ path: '/my/sell/buyer/group' })
            }
        }
    },
    mounted() {
        if (!this.hasSellerGroup) {
            this.getSellerGroup().then(()=>{
                if (!this.group_for_seller.length){
                    this.$router.push({ path: '/my/sell/buyer/group', query:{name: this.$route.name, id: this.$route.params.id, to: this.$route.query.to} })
                    return
                }
            })
        }
        // this.getList()
        if (this.$route.params.id != 'new') {
            getList('seller', {
                limit: 1000,
                page: 1,
                filter_group_id: ''
            }).then(res => {
                const user = res.items.find(xx => xx.id == this.$route.params.id)
                if (user) {
                    this.info.opposite_id = user.opposite_id
                    this.info.opposite_group_id = user.group.id
                    this.setUserInfo(user.opposite)
                } else {
                    this.$router.replace({ name: this.$route.name, params: { id: "new" } })
                }

            })
        } else {
            const to_user_id = this.$route.query.to
            if (to_user_id) {
                getInfo(to_user_id).then(res => {
                    this.info.opposite_id = to_user_id
                    this.user_name = res.user.phone || res.user.email
                    this.setUserInfo(res.user)
                })
            }
        }
    }
}
</script>