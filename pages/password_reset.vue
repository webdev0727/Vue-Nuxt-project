<template>
<div class="container">
    <kuc-page-header :title="$t('recover.i')"></kuc-page-header>
    <div class="border-bottom px-2 mb-2 bg-white">
        <ku-tab-line :list='tab_items' :activeTab.sync="activeTabName" :tabPadding=20 bigFont @change="form_key=+new Date()"></ku-tab-line>
    </div>

    <div class="bg-white mb-2 px-2 pt-2">
        <el-form :model="info" ref="form" label-width="0" :rules="rules" :key="form_key">
            <el-alert v-if="alert_title" :title="alert_title" type="warning" show-icon @close="alert_title=''"></el-alert>

            <!-- mobile number -->
            <el-form-item v-if="activeTabName=='mobile'" prop="phone" :error="error.phone">
                <el-input v-model="info.phone" class="text-right" placeholder="156-867-660660" type="number">
                    <ku-mobile slot="prepend" :mobile_code.sync="country_code" />
                </el-input>
            </el-form-item>

            <!-- email number -->
            <el-form-item v-else prop="email" :error="error.email">
                <el-input :placeholder="$t('form.input')" v-model="info.email">
                    <template slot="prepend">{{$t('email.address')}}</template>
                </el-input>
            </el-form-item>

            <el-form-item class="ku-no-after" prop="verification_code" :error="error.verification_code">
                <el-input v-model="info.verification_code" :placeholder="$t('form.input_v')" type="number">
                    <span slot="prepend">{{$t('verify_code')}}</span>
                    <el-button slot="append" type="text" round size="small" @click="isVerificationShow2=true" :disabled="getDisable" v-if="show_send_btn" class="text-danger">{{$t('verify_code_send')}}</el-button>
                    <p slot="append" v-if="!show_send_btn" :key="12">
                        <TimerLeft :endTime="counter_end_time" :unit="['s']" @ended="show_send_btn = true" />
                    </p>
                </el-input>
            </el-form-item>

            <div class="text-center">
                <PuzzleVerification v-model="isVerificationShow2" :puzzleImgList="puzzleImgList" blockType="puzzle" :width='300' :onSuccess="handleCaptchaSuccess" :key="attemp_try_cnt"/>
            </div>
        </el-form>

    </div>
    <div class="text-center">
        <el-button type="danger" round class="w-75 my-3" @click="handleSubmit" :disabled="!valid_user">{{$t('confirm.ok')}}</el-button>
    </div>

</div>
</template>

<script>
import PuzzleVerification from 'vue-puzzle-verification'
import TimerLeft from '~/components/TimerLeft.vue'
import { SMS, forgotpassword } from "~/api/user";
const Cookie = process.client ? require('js-cookie') : undefined
import puzzleImgList from "@/static/json/puzzleImgList.json";
export default {
    name: 'PaswordReset',
    components: {
        PuzzleVerification,
        TimerLeft
    },
    head() {
        return{
            title: this.$t('recover.i')      
        }
    },
    data() {

        return {
            form_key: 'form_key',
            tab_items: [
                { id: "mobile", name: this.$t('recover.mobile') },
                { id: "email", name: this.$t('recover.email') }
            ],
            activeTabName: 'mobile',
            country_code: "86",
            info: {
                phone: '',
                email: '',
                verification_code: ''
            },
            isVerificationShow2: false,
            puzzleImgList,
            show_send_btn: true,
            counter_end_time: 0,
            error: {
                phone: '',
                email: '',
                verification_code: '',
            },
            alert_title: '',
            attemp_try_cnt:1,
            rules: {
                phone: [
                    { required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur', 'change'] },
                    { min: 11, message: this.$t('valid.min.string', [this.$t('mobile'), 11]), trigger: ['blur', 'change'] },
                ],
                email: [
                    { required: true, message: this.$t('valid.required', [this.$t('email')]), trigger: ['blur', 'change'] },
                    { type: 'email', message: this.$t('valid.email', [this.$t('email')]), trigger: ['blur', 'change'] },
                ],
                verification_code: [
                    { required: true, message: this.$t('valid.required', [this.$t('verify_code')]), trigger: ['blur', 'change'] }
                ]
            },
            valid_user: false
        }
    },
    computed: {
        getDisable: function () {
            if (this.activeTabName == "mobile" && (this.info.phone == '' || this.info.phone.length < 11)) return true
            else if (this.activeTabName == "email" && (this.info.email == '' || !this.validEmail(this.info.email))) return true
            return false
        }
    },
    methods: {
        handleSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let data = Object.assign({}, this.info)
                    if (this.activeTabName == "email") {
                        delete data.phone
                    } else {
                        delete data.email
                        data.phone = this.country_code + this.info.phone
                    }
                    console.log(data)
                    forgotpassword(data).then(res => {
                        Cookie.set('token', res.token, { domain: ".antway.cn" })
                        this.$router.push({ path: '/password_new' })
                    }).catch(error => {
                        if (Array.isArray(error))
                            this.alert_title = error.join('\n')
                    })
                }
            });
        },
        handleCaptchaSuccess() {
            this.isVerificationShow2 = false
            this.attemp_try_cnt ++
            this.alert_title = ''
            
            let data = { "mode": 1 }
            if (this.activeTabName == "mobile") {
                data.phone = this.country_code + this.info.phone
            } else {
                data.email = this.info.email

            }
            SMS(data).then(res => {
                console.log(res.result)
                if (res.result.Code == "OK") {
                    this.counter_end_time = +new Date() + 60000
                    this.show_send_btn = false
                    this.valid_user = true
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
    }
}
</script>

<style lang="scss" scoped>
.input-label {
    min-width: 4rem;
}
</style>
