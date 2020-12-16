<template>
<div>
    <kuc-page-header :title="$t('badge_apply1')"></kuc-page-header>
    <div class="px-2 bg-white border-bottom">
        <ku-tab-line :list='tab_items' :activeTab.sync="activeTab" :activeTabBarWidth="30" @change="handleTabChange"></ku-tab-line>
    </div>
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" class="bg-white px-2 mt-2" :key="form_key">

        <el-alert v-if="alert_title" :title="alert_title" type="warning" show-icon @close="alert_title=''"></el-alert>

        <el-form-item v-if="activeTab=='mobile'" prop="mobile" :error="error.mobile">
            <el-input v-model="info.mobile" class="text-right" :placeholder="$t('account_friend')" type="number">
                <ku-mobile slot="prepend" :mobile_code.sync="phone_prefix" title="mobile.friend" />
            </el-input>
        </el-form-item>

        <el-form-item v-else prop="email" :error="error.email">
            <el-input v-model="info.email" class="text-right" :placeholder="$t('email')">
                <template slot="prepend">{{$t('email.friend')}}</template>
            </el-input>
        </el-form-item>

        <el-form-item prop="verification_code" :error="error.verification_code">
            <el-input v-model="info.verification_code" :placeholder="$t('form.input_v')" type="number">
                <span slot="prepend">{{$t('verify_code')}}</span>
                <el-button slot="append" type="text" round size="small" @click="isVerificationShow2=true" :disabled="getDisable" v-if="show_send_btn" class="text-danger">{{$t('verify_code_send')}}</el-button>
                <p slot="append" v-if="!show_send_btn" :key="12">
                    <TimerLeft :endTime="counter_end_time" :unit="['s']" @ended="show_send_btn = true" />
                </p>
            </el-input>
        </el-form-item>
        <div class="text-center">
            <PuzzleVerification v-model="isVerificationShow2" :puzzleImgList="puzzleImgList" blockType="puzzle" :width='300' :onSuccess="handleCaptchaSuccess" :key="attemp_try_cnt" />
        </div>

        <!--  position in company -->
        <el-form-item prop="name">
            <el-input v-model="info.name" class="text-right" :placeholder="$t('name.colleque')">
                <template slot="prepend">{{$t('name.colleque')}}</template>
            </el-input>
        </el-form-item>

        <!-- 性别 sex -->        
        <ku-sex v-model="info.gender"/>
        <ku-line />

        <!-- duty -->
        <el-form-item label="">
            <el-input v-model="info.position" class="text-right" placeholder="总经理">
                <template slot="prepend">{{$t('duty_position')}}</template>
            </el-input>
        </el-form-item>

        <!--  company -->
        <el-form-item>
            <el-input v-model="info.company" class="text-right" :placeholder="$t('company')">
                <template slot="prepend">{{$t('company')}}</template>
            </el-input>
        </el-form-item>

        <div class="text-center py-4">
            <el-button type="primary" @click="handleSubmit" class="w-50" round>{{$t('submit.apply')}}</el-button>
        </div>

    </el-form>

    <!-- modal dialog -->
    <el-dialog :visible.sync="dialogVisible" width="100%" class="full-modal-container" :show-close="false">
        <div slot="title" class="position-fixed w-100" style="z-index:999">
            <kuc-page-header :title="$t('expo.success')" disabled @back="dialogVisible = false"></kuc-page-header>
        </div>
        <div class="mt-5 text-center">
            <success-icon></success-icon>
        </div>
        <div class="text-dark9 text-center" v-if="$i18n.locale=='zh'">
            <h2 class="px-3 text-dark28 mb-3">您帮同事<span class="text-danger">张玉龙</span>申请参观证已经提交成功</h2>
            <p>请同事访问：http://www.antway.cn </p>
            <p class="px-2">按提示的帐户名和密码登录平台，点“ <span class="text-danger">我要买-我要参观</span>”获取参观证。</p>
        </div>
        <div class="text-dark9 text-center" v-else>
            <h2 class="px-3 text-dark28 mb-3">Your application for <span class="text-danger">张玉龙</span> had submited successfully</h2>
            <p>Your colleague may visit：http://www.antway.cn </p>
            <p class="px-2">Sign In and get Badge at "<span class="text-danger">For Buyer - For Visit</span>"</p>
        </div>
        <div class="px-3 mt-5">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-button type="primary" @click="handleFinish()" class="w-100" round>{{$t('confirm.ok')}}</el-button>
                </el-col>
                <el-col :span="12">
                    <el-button type="primary" class="w-100" round plain @click="handleAgain()">{{$t('btn.allot')}}</el-button>
                </el-col>
            </el-row>
        </div>

    </el-dialog>
</div>
</template>

<script>
import SuccessIcon from "@/components/successIcon"
import TimerLeft from '~/components/TimerLeft.vue'
import PuzzleVerification from 'vue-puzzle-verification'
import { SMS } from "~/api/user";
import { makeBuyerFriend } from "~/api/expo";
import puzzleImgList from "@/static/json/puzzleImgList.json";

export default {
    name: "GiveCardToFriend",
    middleware: 'authenticated',
    components: { SuccessIcon, TimerLeft, PuzzleVerification },
    data() {
        return {
            form_key: 'form_key',
            tab_items: [
                { id: 'mobile', name: this.$t('mobile') },
                { id: 'email', name: this.$t('email') },
            ],
            activeTab: 'mobile',
            dialogVisible: false,
            isVerificationShow2: false,
            show_send_btn: true,
            attemp_try_cnt: 1,
            counter_end_time: 0,
            puzzleImgList,
            info: {
                expo_applicant_buyer_id: this.$route.params.id,
                name: '',
                email: '',
                mobile: '',
                verification_code: '',
                gender: 0,
                position: '',
                company: '',
            },
            phone_prefix: "86",
            alert_title: '',
            rules: {
                name: [{ required: true, message: this.$t('valid.required', [this.$t('name')]), trigger: ['blur'] }, ],
                verification_code: [{ required: true, message: this.$t('valid.required', [this.$t('verify_code')]), trigger: ['blur'] }, ],
                email: [
                    { required: true, message: this.$t('valid.required', [this.$t('email.friend')]), trigger: ['blur', 'change'] },
                    { type: 'email', message: this.$t('valid.email', [this.$t('email.friend')]), trigger: ['blur', 'change'] },
                ],
                mobile: [
                    { required: true, message: this.$t('valid.required', [this.$t('mobile.friend')]), trigger: ['blur', 'change'] },
                    { min: 11, message: this.$t('valid.min.string', [this.$t('mobile'), 11]), trigger: ['blur', 'change'] },
                ],
                company: [{ required: true, message: this.$t('valid.required', [this.$t('company')]), trigger: ['blur', 'change'] }, ]
            },
            error: {
                verification_code: '',
                mobile: '',
                email: ''
            },
        }
    },
    computed: {
        getDisable: function () {
            if (this.activeTab == "mobile" && (this.info.mobile == '' || this.info.mobile.length < 11)) return true
            if (this.activeTab == "email" && (this.info.email == '' || !this.validEmail(this.info.email))) return true
            return false
        }
    },
    methods: {
        handleTabChange(active_tab_name) {
            this.form_key = +new Date()
        },
        handleFinish() {
            this.$router.replace({ path: '/my/buy/participate' })
        },
        handleAgain() {
            this.info = {
                expo_applicant_buyer_id: this.$route.params.id,
                name: '',
                email: '',
                mobile: '',
                verification_code: '',
                gender: 0,
                position: '',
                company: '',
            }
            this.dialogVisible = false
        },
        handleCaptchaSuccess() {
            this.isVerificationShow2 = false
            this.attemp_try_cnt++
            let data = { "mode": 0 }
            if (this.activeTab == "mobile") {
                data.phone = "+" + this.phone_prefix + this.info.mobile
            } else {
                data.email = this.info.email
            }
            this.alert_title = ''
            SMS(data).then(res => {
                console.log(res.result)
                if (res.result.Code == "OK") {
                    this.counter_end_time = +new Date() + 60000
                    this.show_send_btn = false
                }
            }).catch(error => {
                if (error.result) {
                    if (error.result.Code == 'isv.BUSINESS_LIMIT_CONTROL') {
                        this.alert_title = this.$t('msg.max_try_exceed')
                    }else{
                        this.error.mobile = error.result.Message
                        this.alert_title = error.result.Message
                    }
                }
            })

        },
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    let data = Object.assign({}, this.info)
                    if (this.activeTab == "mobile") {
                        delete data.email
                        data.mobile = "+" + this.phone_prefix + this.info.mobile
                        // console.log(data)
                    } else {
                        delete data.mobile
                    }
                    makeBuyerFriend(data).then(res => {
                        this.dialogVisible = true
                    }).catch(error => {
                        if (Array.isArray(error))
                            this.alert_title = error.join('\n')
                        if (error.includes('Invalid Code')) this.error.verification_code = this.$t('valid.fail', [this.$t('verify_code')])
                        if (error.includes('Already added.')) {
                            this.error.mobile = this.$t('valid.unique', [this.$t('mobile')])
                            this.error.email = this.$t('valid.unique', [this.$t('email')])
                        }

                    })
                }
            });
        },
    },
}
</script>
