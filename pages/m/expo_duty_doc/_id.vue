<template>
<div>
    <kuc-page-header :title="title" to="/expo_duty"></kuc-page-header>
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" class="bg-white px-2 mt-2">
        <!-- prop="name_zh" -->
        <el-form-item prop="name_zh">
            <el-input v-model="info.name_zh" class="text-right" placeholder="王希孟">
                <template slot="prepend">{{$t('name')}}（{{$t('lang.zh')}}）</template>
            </el-input>
        </el-form-item>

        <!-- 真实姓名（英文） prop="name_en" -->
        <el-form-item prop="name_en">
            <el-input v-model="info.name_en" class="text-right" placeholder="Real Name">
                <template slot="prepend">{{$t('name')}}（{{$t('lang.en')}}）</template>
            </el-input>
        </el-form-item>

        <!-- 手机  -->

        <el-form-item prop="mobile">
            <el-input v-model="info.mobile" class="text-right" placeholder="156-867-660660" type="number">
                <ku-mobile slot="prepend" :mobile_code.sync="phone_prefix" />
            </el-input>
        </el-form-item>

        <!--  position in company -->
        <el-form-item prop="position_zh">
            <el-input v-model="info.position_zh" class="text-right" placeholder="经理">
                <template slot="prepend">{{$t('duty_position')}}（{{$t('lang.zh')}}）</template>
            </el-input>
        </el-form-item>

        <el-form-item prop="position_en">
            <el-input v-model="info.position_en" class="text-right" placeholder="经理">
                <template slot="prepend">{{$t('duty_position')}}（{{$t('lang.en')}}）</template>
            </el-input>
        </el-form-item>

        <!--  company -->
        <el-form-item prop="company_zh">
            <el-input v-model="info.company_zh" class="text-right" placeholder="得力">
                <template slot="prepend">{{$t('company')}}（{{$t('lang.zh')}}）</template>
            </el-input>
        </el-form-item>

        <el-form-item prop="company_en">
            <el-input v-model="info.company_en" class="text-right" placeholder="得力">
                <template slot="prepend">{{$t('company')}}（{{$t('lang.en')}}）</template>
            </el-input>
        </el-form-item>
        <!-- 展位号 -->
        <div class="align-items-center py-1 d-flex">
            <p class="text-nowrap mr-2">{{$t('expo.no_')}}</p>
            <el-cascader v-model="info.hallname" :options="expo_halls" :props="hall_props" clearable class="flex-1" @change="validHall"></el-cascader>
        </div>
        <div class="el-form-item__error" v-if="error.hall">{{error.hall}}</div>
        <ku-line />
    </el-form>

    <el-row :gutter="20" class="px-4 my-4">
        <el-col :span="12" class="">
            <el-button type="primary" round class="w-100" @click="handleSubmit">{{$t('save')}}</el-button>
        </el-col>
        <el-col :span="12">
            <el-button type="primary" round class="w-100" plain @click="handleCancel">{{$t('confirm.cancle')}}</el-button>
        </el-col>
    </el-row>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { AddExpoBadge, DetailExpoBadge } from "~/api/expo"
export default {
    middleware: 'authenticated',
    name: "ExpoDuty1",
    components: {},
    data() {
        return {
            title_arr: [this.$t('expo.btn_new_badge'), this.$t('expo.btn_update_badge')],
            type: this.$route.params.id,
            info: {
                name_zh: this.gsv(['zh'], this.$store.state.auth.name),
                name_en: this.gsv(['en'], this.$store.state.auth.name),
                position_zh: '',
                position_en: '',
                company_zh: this.gsv(['zh'], this.$store.state.auth.company_name),
                company_en: this.gsv(['en'], this.$store.state.auth.company_name),
                mobile: this.$store.state.auth.phone,
                hallname: [],
                expo_id: ''
            },
            phone_prefix: this.$store.state.auth.phone_prefix,
            hall_props: {
                multiple: true,
            },
            rules: {
                name_zh: [{ required: true, message: this.$t('valid.required', ["name_zh"]), trigger: ['blur', 'change'] }, ],
                name_en: [{ required: true, message: this.$t('valid.required', ["name_en"]), trigger: ['blur', 'change'] }, ],
                position_en: [{ required: true, message: this.$t('valid.required', ["position_en"]), trigger: ['blur', 'change'] }, ],
                position_zh: [{ required: true, message: this.$t('valid.required', ["position_zh"]), trigger: ['blur', 'change'] }, ],
                mobile: [{ required: true, message: this.$t('valid.required', ["mobile"]), trigger: ['blur', 'change'] }, ],
            },
            error: {
                hall: false
            }
        }
    },
    computed: {
        ...mapState('expo', ["my_expo_list"]),
        expo_halls: function () {
            let expo_hall_selelced = []
            if (this.$store.state.expo.my_expo_list.length && this.info.expo_id) {
                const t_expo = this.$store.state.expo.my_expo_list.find(xx => xx.expo_id == this.info.expo_id)
                t_expo['halls'].forEach(el => {
                    expo_hall_selelced.push({ value: el, label: el })
                })
            }
            // console.log(expo_hall_selelced, "selelcted")
            return expo_hall_selelced
        },
        title: function () {
            return this.type == "new" ? this.title_arr[0] : this.title_arr[1]
        },
    },
    methods: {
        ...mapActions('expo', ['getMyExpoList']),
        validHall() {
            let hall_ids_arr = []
            this.info.hallname.forEach(ee => {
                hall_ids_arr.push(ee[0])
            });
            if (!hall_ids_arr.length) {
                this.error.hall = this.$t('valid.required', ['hallname'])
                return false
            } else {
                this.error.hall = false
                return hall_ids_arr.join(',')
            }
        },
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                let is_valid_hall = this.validHall()
                if (valid && is_valid_hall) {
                    let ob = Object.assign({}, this.info)
                    ob.hallname = is_valid_hall
                    AddExpoBadge(ob).then(() => {
                            this.$notify({
                                title: this.$t('success'),
                                message: this.$t('success.add'),
                                type: 'success'
                            });
                            this.$router.push({ path: '/expo_duty' })
                        })
                        .catch(error => {
                            this.error = error
                        })
                } else {
                    return false;
                }
            });
        },
        handleCancel() {
            this.$router.push({ path: '/expo_duty' })
        }
    },
    mounted() {
        if (this.type == 'new') {
            this.info.expo_id = this.$route.query.expo_id ? parseInt(this.$route.query.expo_id) : ''
            if (!this.info.expo_id) {
                this.$router.push({ path: '/expo_duty' })
                return false
            }
        } else {
            DetailExpoBadge(this.$route.params.id).then(({ expo_badge }) => {
                delete expo_badge.created_at
                delete expo_badge.deleted_at
                delete expo_badge.updated_at
                delete expo_badge.status
                delete expo_badge.user_id
                let uu = this.buildQuery(expo_badge)
                delete uu.name
                delete uu.position
                delete uu.company
                let temp = uu.hallname.split(",")
                uu.hallname = []
                temp.forEach(el => {
                    uu.hallname.push([el])
                });
                this.info = uu

            })
        }
        if (!this.my_expo_list.length) {
            this.getMyExpoList()
        }
    }
}
</script>

<style>

</style>
