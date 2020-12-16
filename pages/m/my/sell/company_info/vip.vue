<template>
<div>

    <div class="">

        <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" class="bg-white p-2">
            <h3 class="py-2">{{$t('member.privilege')}}</h3>

            <el-alert v-if="alert_title" :title="alert_title" type="warning" show-icon @close="alert_title=''"></el-alert>

            <ku-line />
            <!--  -->
            <el-form-item v-if="!info.email" :error="error.phone">
                <el-input v-model="info.phone" class="text-right" placeholder="156-867-660660" type="number" @keyup.native="hChangePhone" :readonly="company_status=='status.company_suspend'">
                    <ku-mobile slot="prepend" :mobile_code.sync="info.phone_prefix" :readonly="company_status=='status.company_suspend'"/>
                    <i slot="suffix" v-if="info.phone" @click="info.phone=''" class="el-input__icon el-icon-close"></i>
                </el-input>
            </el-form-item>

            <el-form-item v-if="!info.phone" prop="email" :error="error.email">
                <el-input v-model="info.email" class="text-right" :placeholder="$t('email')" @keyup.native="hChangeEmail">
                    <template slot="prepend">{{$t('email')}}</template>
                </el-input>
            </el-form-item>
            <div class="text-center">
                <PuzzleVerification v-model="isVerificationShow2" :puzzleImgList="puzzleImgList" blockType="puzzle" :width='300' :onSuccess="handleCaptchaSuccess" :key="attemp_try_cnt" />
            </div>

            <!-- verify code -->
            <el-form-item prop="verification_code">
                <el-input v-model="info.verification_code" :placeholder="$t('form.input_v')" type="number">
                    <template slot="prepend">{{$t('verify_code')}}</template>
                    <template slot="append" v-if="show_send_btn"> <span class="text-danger" @click="handleShowCaptcha">{{$t('verify_code_get')}}</span> </template>
                    <p slot="append" v-if="!show_send_btn" :key="12">
                        <TimerLeft :endTime="counter_end_time" :unit="['s']" @ended="show_send_btn = true" />
                    </p>
                </el-input>
            </el-form-item>
            <!-- 同事姓名 friend name -->
            <el-form-item prop="username">
                <el-input v-model="info.username" class="text-right" :placeholder="$t('form.input')">
                    <template slot="prepend">{{$t('name.colleque')}}</template>
                </el-input>
            </el-form-item>

            <!-- 性别 sex -->
            <ku-sex v-model="info.gender" />
            <ku-line />

            <!--  position in company -->
            <el-form-item label="">
                <el-input v-model="info.position" class="text-right" placeholder="经理">
                    <template slot="prepend">{{$t('duty_position')}}</template>
                </el-input>
            </el-form-item>
            <!--  company -->
            <el-form-item>
                <el-input disabled :value="gsv(['company_name', $i18n.locale], $store.state.auth)" class="text-right" placeholder="得力">
                    <template slot="prepend">{{$t('company')}}</template>
                </el-input>
            </el-form-item>

            <div class="text-center pt-2 my-2">
                <el-button type="primary" @click="handleSubmit" class="w-50" round="" :disabled="company_status=='status.company_suspend'">{{$t('submit.apply')}}</el-button>
            </div>
        </el-form>

        <!-- reviews block 2 -->
        <div class="mt-2">
            <ku-title-line class="px-2">{{$t('history.promotion')}}</ku-title-line>
            <div class="p-2 bg-white">
                <div v-for="his in list" :key='his.id'>
                    <div class="d-flex justify-content-between align-items-center py-2">
                        <div>
                            <p>{{his.email ? his.email : ('(+'+his.phone_prefix+')' + his.phone)}}</p>
                            <p class="text-dark9 font-08">{{his.created_time}}</p>
                        </div>
                        <p v-if="his.success" class="text-danger">{{$t('status.succeed')}}</p>
                        <p v-else>{{$t('status.on')}}</p>
                    </div>
                    <ku-line />
                </div>
                <ku-loading-no-data :active="isLoading" :total="list.length" push />
            </div>
        </div>

        <!-- modal dialog -->
        <el-dialog title="Country" :visible.sync="dialogVisibleVipAllocation" width="100%" class="full-modal-container" :show-close="false">

            <div slot="title" class="position-fixed w-100" style="z-index:999">
                <kuc-page-header :title="$t('apply.friend_vip')" disabled @back="dialogVisibleVipAllocation = false"></kuc-page-header>
            </div>
            <div class="mt-5">
                <success-icon></success-icon>
            </div>
            <h2 class="px-3 text-dark28" v-if="$i18n.locale == 'en'">You had apply VIP Account for<span class="text-danger">张玉龙</span>.</h2>
            <h2 class="px-3 text-dark28" v-else>您帮同事<span class="text-danger">张玉龙</span>申请VIP帐户已经创建成功</h2>

            <div class="text-dark9 mt-3 text-center">
                <p>{{$t('msg.Your_colleague_may_visit')}}：http://www.antway.cn</p>
                <p>{{$t('msg.Sign_in_and_enjoy_VIP_privileges')}}</p>
            </div>
            <div class="px-3 mt-5">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-button type="primary" @click="dialogVisibleVipAllocation = false" class="w-100" round>{{$t('confirm.ok')}}</el-button>
                    </el-col>
                    <el-col :span="12">
                        <el-button type="primary" @click="dialogVisibleVipAllocation = false" class="w-100" round plain>{{$t('btn.allot')}}</el-button>
                    </el-col>
                </el-row>
            </div>

        </el-dialog>

    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import SuccessIcon from "@/components/successIcon"
import TimerLeft from '~/components/TimerLeft.vue'
import PuzzleVerification from 'vue-puzzle-verification'
import { getVip, addVip } from "@/api/my_company"
import { SMS } from "~/api/user";
import puzzleImgList from "@/static/json/puzzleImgList.json";

export default {
    name: "CompanyInfomation",
    components: { SuccessIcon, PuzzleVerification, TimerLeft },
    data() {
        return {
            activeTabName: 'vip_member_allocation',
            dialogVisibleVipAllocation: false,
            activeIndex: '1',
            isLoading: true,
            list: [],
            isVerificationShow2: false,
            puzzleImgList,
            show_send_btn: true,
            attemp_try_cnt: 0,
            counter_end_time: 0,
            info: {
                email: '',
                phone: '',
                phone_prefix: '86',
                verification_code: '',
                username: '',
                gender: 0,
                position: '',
            },
            rules: {
                email: [
                    { type: 'email', message: this.$t('valid.email', [this.$t('email')]), trigger: ['blur', 'change'] },
                ],
                verification_code: [
                    { required: true, message: this.$t('valid.required', [this.$t('verify_code')]), trigger: ['blur', 'change'] },
                ],
                username: [
                    { required: true, message: this.$t('valid.required', [this.$t('name')]), trigger: ['blur', 'change'] },
                ],
            },
            error: {
                phone: '',
                email: ''
            },
            alert_title: "",
        }
    },
    computed: {
        ...mapGetters(['company_status']) ,   
    },
    methods: {
        getVipList() {
            this.isLoading = true
            getVip().then(res => {
                this.list = res.vips
            }).finally(() => {
                this.isLoading = false
            })
        },
        handleShowCaptcha() {
            if (this.company_status == 'status.company_suspend') return
            if (this.info.phone || this.info.email) {
                if (this.info.phone) {
                    if (this.info.phone.length < 11) this.error.phone = this.$t('valid.min.string', [this.$t('mobile'), 11])
                    else{
                        this.isVerificationShow2 = true
                        this.error.phone = ''
                    } 
                } else if (this.info.email) {
                    if (!this.validEmail(this.info.email)) this.error.email = this.$t('valid.email', [this.$t("email")])
                    else {
                        this.isVerificationShow2 = true
                        this.error.email = ''
                    }
                }
            } else {
                this.error.email = this.$t('valid.required', [this.$t("email")])
                this.error.phone = this.$t('valid.required', [this.$t("mobile")])
            }
        },
        hChangePhone(){           
            this.isVerificationShow2 = false
            this.attemp_try_cnt++
            if(this.info.phone.length<11) this.error.phone = this.$t('valid.min.string', [this.$t('mobile'), 11])
            else this.error.phone = ''
        },
        hChangeEmail(){
            this.isVerificationShow2 = false
            this.attemp_try_cnt++
            if (this.info.email) this.error.email = ''
        },
        handleCaptchaSuccess() {
            this.isVerificationShow2 = false
            this.attemp_try_cnt++
            this.alert_title = ''

            let data = { "mode": 0 }
            if (this.info.phone) {
                data.phone = this.info.phone
                data.phone_prefix = this.info.phone_prefix
            } else {
                data.email = this.info.email
            }
            SMS(data).then(res => {
                console.log(res.result)
                if (res.result.Code == "OK") {
                    this.counter_end_time = +new Date() + 60000
                    this.show_send_btn = false
                }
            }).catch(error => {
                if (error) {
                    if (Array.isArray(error))
                        this.alert_title = error.join('\n')
                    else if (error.result) {
                        if (error.result.Code == 'isv.BUSINESS_LIMIT_CONTROL') {
                            this.alert_title = this.$t('msg.max_try_exceed')
                        } else {
                            this.error.phone = error.result.Message
                            this.alert_title = error.result.Message
                        }
                    }
                } else {
                    this.alert_title = "SMS Sevice is not working"
                }
            })

        },
        handleSubmit() {
            if (this.company_status == 'status.company_suspend') return
            this.$refs['dataForm'].validate((valid) => {
                if (!this.info.phone && !this.info.email) {
                    this.error.email = [this.$t('valid.required', [this.$t("email")])]
                    this.error.phone = [this.$t('valid.required', [this.$t("mobile")])]
                    return false
                } else {
                    this.error.email = this.error.phone = false
                }
                if (valid) {
                    let data = Object.assign({}, this.info)
                    if (this.info.email) {
                        delete data.phone
                        delete data.phone_prefix
                    } else {
                        delete data.email
                    }
                    this.$store.dispatch("common/setLoading")
                    addVip(data).then(re => {
                        this.$notify({
                            title: this.$t('success'),
                            message: this.$t('success.add'),
                            type: 'success'
                        });
                        this.getVipList()
                    }).finally(() => {
                        this.$store.dispatch("common/setLoading", false)
                    })
                }
            });
        },
        handleTabClick() {

        },
    },
    mounted() {
        this.getVipList()
    }
}
</script>
