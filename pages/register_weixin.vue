<template>
<div>
    <kuc-page-header :title="$t('signin.wechat')"></kuc-page-header>
    <div class="border-bottom px-2 mb-2 bg-white">
        <ku-tab-line :list='tab_items' :activeTab.sync="activeTabName" :tabPadding=20 bigFont></ku-tab-line>
    </div>

    <div class="">

        <el-form :model="info" ref="form" label-width="0" :rules="rules">
            <div class="bg-white mb-2 px-2 py-1">
                <!-- avatar -->
                <div class="d-flex align-items-center justify-content-between py-input avatar-div">
                    <p>{{$t('image')}}</p>
                    <el-avatar :size="60" :src="info.headimgurl">
                        <img src="/files/avatar.png" />
                    </el-avatar>
                </div>
                <!-- name -->
                <el-form-item>
                    <el-input :value="info.nickname" class="text-right" readonly>
                        <template slot="prepend">{{$t('name')}}</template>
                    </el-input>
                </el-form-item>
                <!-- 性别 sex -->                
                <ku-sex v-model="info.sex" readonly/>
            </div>

            <div class="bg-white mb-2 px-2 py-1">
                <el-alert v-if="alert_title" :title="alert_title" type="warning" show-icon @close="alert_title=''"></el-alert>
                <!-- mobile number -->
                <el-form-item prop="phone" :error="error.phone">
                    <el-input v-model="info.phone" class="text-right" placeholder="156-867-660660" type="number">
                        <ku-mobile slot="prepend" :mobile_code.sync="info.phone_prefix" />
                    </el-input>
                </el-form-item>

                <el-form-item class="ku-no-after" prop="verification_code">
                    <el-input v-model="info.verification_code" :placeholder="$t('form.input_v')" type="number">
                        <span slot="prepend">{{$t('verify_code')}}</span>
                        <el-button slot="append" type="text" round size="small" @click="isVerificationShow2 = true" :disabled="getDisable" v-if="show_send_btn" class="text-danger">{{$t('verify_code_send')}}</el-button>
                        <p slot="append" v-if="!show_send_btn" :key="12">
                            <TimerLeft :endTime="counter_end_time" :unit="['s']" @ended="show_send_btn = true" />
                        </p>
                    </el-input>
                    <div class="el-form-item__error" v-if="error.verification_code">{{error.verification_code[0]}}</div>
                </el-form-item>
                <div class="text-center">
                    <PuzzleVerification v-model="isVerificationShow2" :puzzleImgList="puzzleImgList" blockType="puzzle" :width='300' :onSuccess="handleCaptchaSuccess" :key="attemp_try_cnt"/>
                </div>
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
import { register } from "~/api/weixin";
import puzzleImgList from "@/static/json/puzzleImgList.json";

export default {
    name: 'WeixinRegister',
    components: { PuzzleVerification, TimerLeft },
    data() {

        return {
            tab_items: [
                { id: "mobile", name: this.$t('signup.mobile') },
                // { id: "email", name: this.$t('signup.email') }
            ],
            activeTabName: "mobile",
            info: {
                phone: '',
                verification_code: '',
                openid: '',
                nickname: '',
                headimgurl: '',
                sex: 0,
                phone_prefix: '86'
            },
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
    head() {
        return{
            title: this.$t('signin.wechat')      
        }
    },
    computed: {
        getDisable: function () {
            if (this.activeTabName == "mobile" && (this.info.phone == '' || this.info.phone.length < 11)) return true
            return false
        }
    },
    methods: {

        handleCaptchaSuccess() {
            this.error['verification_code'] = ''
            this.isVerificationShow2 = false
            this.attemp_try_cnt++
            this.alert_title = ''

            let data = { "mode": 0 }
            data.phone = this.info.phone_prefix + this.info.phone
            SMS(data).then(res => {
                // console.log(res.result)
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
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$store.dispatch('register_weixin', this.info)
                        .then(() => {
                            localStorage.removeItem('mAntway_wx_temp')
                            if (this.$route.query.redirect) {
                                // window.open(`${process.env.M_URL}${this.$route.query.redirect}`, "_self")
                                this.$router.replace({ path: this.$route.query.redirect })
                            } else
                                this.$router.replace({ path: '/' })
                        })
                        .catch(error => {
                            this.show_send_btn = true
                            this.counter_end_time = 0
                            if (Array.isArray(error))
                                this.alert_title = error.join('\n')
                            else {
                                const is_registered = error.phone || error.email
                                this.alert_title = is_registered
                            }
                        })
                }
            });
        },
    },
    mounted() {
        const mAntway_wx_temp = localStorage.getItem('mAntway_wx_temp')
        if (mAntway_wx_temp) {
            const kk = JSON.parse(mAntway_wx_temp)
            this.info.openid = kk.openid
            this.info.nickname = kk.nickname
            this.info.headimgurl = kk.headimgurl
            this.info.sex = kk.sex
        }
    }
}
</script>

<style lang="scss" scoped>
.input-label {
    min-width: 4rem;
    color: #282828;
}
</style>
