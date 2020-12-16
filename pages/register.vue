<template>
<div>
    <kuc-page-header :title="$t('signup.i')"></kuc-page-header>
    <div class="border-bottom px-2 mb-2 bg-white">
        <ku-tab-line :list='tab_items' :activeTab.sync="activeTabName" :tabPadding=20 bigFont @change="form_key=+new Date()"></ku-tab-line>
    </div>

    <div class="">

        <el-form :model="info" ref="form" label-width="0" :rules="rules" :key="form_key">
            <div class="bg-white mb-2 px-2 py-1">

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
                    <client-only>
                        <PuzzleVerification v-model="isVerificationShow2" :puzzleImgList="puzzleImgList" blockType="puzzle" :width='300' :onSuccess="handleCaptchaSuccess" :key="attemp_try_cnt"/>
                    </client-only>
                </div>
            </div>

            <!-- Password-->
            <div class="bg-white mb-2 px-2 py-1">
                <!-- Pssword  -->
                <el-form-item class="" prop="password">
                    <el-input v-model="info.password" :placeholder="$t('form.input')" class="" type="password" show-password>
                        <span slot="prepend">{{$t('form.pass')}}</span>
                    </el-input>
                </el-form-item>

                <el-form-item class="ku-no-after" prop="password_confirmation" :error="error.password">
                    <el-input v-model="info.password_confirmation" :placeholder="$t('form.input')" class="" type="password">
                        <span slot="prepend">{{$t('form.pass_c')}}</span>
                    </el-input>
                </el-form-item>

            </div>

        </el-form>

        <div class="mt-4">
            <p class="text-center my-2" v-if="$i18n.locale=='zh'">
                <el-checkbox v-model="agree_check">
                    <span class="text-dark9">我已阅读并同意</span>
                </el-checkbox>
                <span class="text-danger">"用户使用协议"</span>
            </p>
            <p class="text-center my-2" v-else>
                <el-checkbox v-model="agree_check">
                    <span class="text-dark9">I agree to the </span>
                </el-checkbox>
                <span class="text-danger">"Terms & Conditions of the site."</span>
            </p>
            <div class="text-center">
                <el-button type="danger" round class="w-75 my-3" @click="handleSubmit" :disabled="!agree_check">{{$t('confirm.ok')}}</el-button>
            </div>
        </div>

    </div>

</div>
</template>

<script>
import TimerLeft from '~/components/TimerLeft.vue'
import PuzzleVerification from 'vue-puzzle-verification'
import { SMS } from "~/api/user";
import puzzleImgList from "@/static/json/puzzleImgList.json";

export default {
    name: 'Register',
    components: { PuzzleVerification, TimerLeft },
    data() {
        var validatePass2 = (rule, value, callback) => {
            if (value !== this.info.password) {
                callback(new Error(this.$t('valid.same', [this.$t('form.pass'), this.$t('form.pass_c')])));
            } else {
                callback();
            }
        };
        return {
            form_key: 'form_key',
            tab_items: [
                { id: "mobile", name: this.$t('signup.mobile') },
                { id: "email", name: this.$t('signup.email') }
            ],
            activeTabName: "mobile",
            name: 'asdfasdfadsf ',
            country_code: '86',
            info: {
                phone: '',
                email: '',
                password: '',
                password_confirmation: '',
                verification_code: '',
            },
            // captcha_url: 'http://106.53.75.202/api/getVerify',
            agree_check: false,
            isVerificationShow2: false,
            puzzleImgList,
            attemp_try_cnt: 1,
            sc_w: 0,
            rules: {
                phone: [
                    { required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur', 'change'] },
                    { min: 11, message: this.$t('valid.min.string', [this.$t('mobile'), 11]), trigger: ['blur', 'change'] },
                ],
                email: [
                    { required: true, message: this.$t('valid.required', [this.$t('email')]), trigger: ['blur', 'change'] },
                    { type: 'email', message: this.$t('valid.email', [this.$t('email')]), trigger: ['blur', 'change'] },
                ],
                password: [
                    { required: true, message: this.$t('valid.required', [this.$t('form.pass_new')]), trigger: ['blur', 'change'] },
                    { min: 6, message: this.$t('valid.min.string', [this.$t('form.pass'), 6]), trigger: ['blur', 'change'] },
                ],
                password_confirmation: [
                    { required: true, message: this.$t('valid.required', [this.$t('form.pass_new_c')]), trigger: ['blur', 'change'] },
                    { validator: validatePass2, trigger: 'blur' },
                ],
                verification_code: [
                    { required: true, message: this.$t('valid.required', [this.$t('verify_code')]), trigger: ['blur', 'change'] }
                ]
            },
            show_send_btn: true,
            counter_end_time: 0,
            alert_title: '',
            error: {
                phone: '',
                email: '',
                verification_code: ''
            },
        }

    },
    computed: {
        getDisable: function () {
            if (this.activeTabName == "mobile" && (this.info.phone == '' || this.info.phone.length < 11)) return true
            else if (this.activeTabName == "email" && (this.info.email == '' || !this.validEmail(this.info.email))) return true
            return false
        }
    },
    head() {
        return{
            title: this.$t('signup.i')      
        }
    },
    methods: {
        handleCaptchaSuccess() {
            this.error['verification_code'] = ''
            this.isVerificationShow2 = false            
            this.attemp_try_cnt++
            this.alert_title = ''

            let data = { "mode": 0 }
            if (this.activeTabName == "mobile") {
                data.phone = this.country_code + this.info.phone
            } else {
                data.email = this.info.email
            }
            SMS(data).then(res => {
                // console.log(res.result)
                if (res.result.Code == "OK") {
                    this.counter_end_time = +new Date() + 60000
                    this.show_send_btn = false
                }
            }).catch(error => {
                console.log(error, "error--")
                this.error.phone = error.result.Message
                if (error.result) {
                    if (error.result.Code == 'isv.BUSINESS_LIMIT_CONTROL') {
                        this.alert_title = this.$t('msg.max_try_exceed')
                    } else this.alert_title = error.result.Message
                }
            })

        },
        handleSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let data = Object.assign({}, this.info)
                    if (this.activeTabName == "mobile") {
                        delete data.email
                        data.phone_prefix = this.country_code
                        // console.log(data)
                    } else {
                        delete data.phone
                    }
                    this.$store.dispatch('register', data)
                        .then(() => {
                            this.$router.push({ path: '/' })
                        })
                        .catch(error => {
                            // this.error = error
                            this.show_send_btn = true
                            this.counter_end_time = 0
                            if (Array.isArray(error))
                                this.alert_title = error.join('\n')
                            else {
                                const is_registered = error.phone || error.email
                                this.alert_title = is_registered
                                if (is_registered) {
                                    this.$confirm(this.$t('msg.go_to_login'), this.$t('warning'), {
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
                                        this.$router.push({ path: '/login' })
                                    }).catch(() => {})
                                }
                            }
                        })
                }
            });
        },
    }
}
</script>

<style lang="scss" scoped>
.input-label {
    min-width: 4rem;
    color: #282828;
}
</style>
<style lang="scss">
.puzzle-container {
    // width: 100%;
    // &>div{
    //     width: 100% !important;
    // }
}

// .slider-btn{
//     background-image: url(/icons/right-circle.svg) !important;
//     background-position: unset !important;
//     background-size: cover;
// }
</style>
