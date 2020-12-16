<template>
<div>
    <!-- header -->
    <div class="bg-white">
        <kuc-page-header :title="$t('group.manage')" @back="handleRoute" disabled class="border-bottom" style="border-bottom-color: #f7f7f7 !important"></kuc-page-header>
    </div>

    <div class="bg-white px-2 mt-2">
        <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" class="bg-white px-2 mt-2">

            <el-form-item prop="name">
                <el-input v-model="info.name" class="text-right" :placeholder="$t('group.input')">
                    <template slot="prepend">{{$t('group.add_new')}}</template>
                </el-input>
            </el-form-item>

        </el-form>

        <div class="text-center pt-2 py-2">
            <el-button type="primary" @click="handleSubmit" class="w-50" round="">{{$t(btn_title)}}</el-button>
        </div>

    </div>
    <!-- content -->
    <ku-title-line class="px-2">{{$t('group.list')}}</ku-title-line>
    <div class="bg-white px-2">
        <div class="" v-for="item in group_for_seller" :key="item.id">
            <div class="d-flex justify-content-between align-items-center">
                <h3 class="flex-1">{{item.name}}</h3>

                <el-button type="text" @click="handleEdit(item)" class="p-1 font-11 text-dark9">
                    <svg-icon name="edit-1"></svg-icon>
                </el-button>
                <el-button type="text" @click="handleDelete(item.id)" icon="el-icon-delete p-1 font-11 text-dark9"></el-button>
            </div>
            <ku-line />
        </div>
        <no-data v-if="!group_for_seller.length"></no-data>
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { delGroup } from "@/api/opposite"
import { upsertGroup } from "@/api/opposite"
export default {
    middleware: ['authenticated', 'member_2'],
    name: "BuyerGroupManage",
    head(){
        return {
            title: this.$t('group.manage')
        }
    },
    data() {
        return {
            btn_title: "group.add",
            info: {
                id: '',
                name: '',
                isbuyer: 1,
            },
            rules: {
                name: [{ required: true, message: this.$t('valid.required', [this.$t('name')]), trigger: ['blur'] }, ],
            },
        }
    },
    computed: {
        ...mapState('opposite', ['group_for_seller']),
    },
    methods: {
        ...mapActions('opposite', ['getSellerGroup']),

        handleEdit(item) {
            this.btn_title = "group.update"
            this.info.id = item.id
            this.info.name = item.name
        },
        handleDelete(id) {
            this.$confirm(this.$t('confirm.msg_del'), this.$t('warning'), {
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
                delGroup([id]).then(() => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'

                    });
                    this.getSellerGroup()
                })
            }).catch(() => {})
        },
        handleSubmit() {
            this.$store.dispatch("common/setLoading")
            let da = Object.assign({}, this.info)
            if (!da.id) delete da.id
            upsertGroup(da).then(res => {
                this.$notify({
                    title: this.$t('success'),
                    message: this.$t('success.msg'),
                    type: 'success'
                });
            }).finally(() => {
                this.getSellerGroup()
                this.btn_title = "group.add"
                this.$store.dispatch("common/setLoading", false)
                this.info.id = ''
                this.info.name = ''
                this.$refs["dataForm"].resetFields();
            })
        },
        handleRoute() {
            const redirect_name = this.$route.query.name
            if (redirect_name) {
                if (!this.group_for_seller.length) {
                    this.$router.replace({ path: "/my/sell/buyer" })
                } else {
                    this.$router.replace({ name: redirect_name, params:{id: this.$route.query.id}, query: {to: this.$route.query.to} })
                }
            }else{
                this.goBack()
            }
        }

    },
    mounted() {
        this.getSellerGroup()
    }
}
</script>

<style lang="scss">
.btn-sm {
    width: 5rem;
}
</style>
