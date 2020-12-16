<template>
<div class="container">
    <div class="home_bg">
        <nuxt-link to="/">        
            <img src="/logo/logo@2x.png" width="250" alt="">
        </nuxt-link>
        <span class="dot-effect dot-effect-left"></span>
        <span class="dot-effect dot-effect-right"></span>
    </div>
    <div class="card_body">
        <ku-tab-line :list='tab_items' :activeTab.sync="activeTabName" :tabPadding=20 bigFont @change="handleTabChange" class="mb-2"></ku-tab-line>

        <el-alert v-if="alert_title" :title="alert_title" type="warning" show-icon @close="alert_title=''"></el-alert>

        <el-form :model="form0" ref="formPass" label-width="0" :rules="rules0" v-if="mode==0" :key="mode">
            <el-form-item class="ku-no-after border-bottom mt-3" prop="user_name">
                <el-input v-model="form0.user_name" :placeholder="$t('mobile.number')+'/'+$t('email')" @change="alert_title=''">
                    <svg-icon slot="prefix" name='user-o' height='35' width="20"></svg-icon>
                    <i slot="suffix" v-if="form0.user_name!=''" @click="form0.user_name=''" class="el-input__icon el-icon-close"></i>
                </el-input>
            </el-form-item>
            <div>
                <el-form-item class="ku-no-after border-bottom mt-4" prop="password">
                    <el-input v-model="form0.password" :placeholder="$t('form.input_p')" type="password" @keyup.enter.native="handleLogin" show-password @change="alert_title=''">
                        <svg-icon slot="prefix" name='security' height='38' width="20"></svg-icon>
                    </el-input>
                </el-form-item>
                <p class="text-right mt-2" style="height:2rem">
                    <nuxt-link to='/password_reset' class="text-danger p-2 text-dark9">{{$t('signin.forgot')}}</nuxt-link>
                </p>
            </div>
        </el-form>

        <el-form :model="form1" ref="formSMS" label-width="0" :rules="rules1" v-else :key="'ss'+ mode">
            <el-form-item class="ku-no-after border-bottom mt-3 text-right" prop="phone" :error="error.phone">
                <el-input v-model="form1.phone" :placeholder="$t('mobile.number')" class="" type="number" @change="alert_title=''">
                    <div slot="prepend" class="d-flex align-items-center pl-1">
                        <svg-icon name='mobile' height='36' width="20" color="#C0C4CC"></svg-icon>
                        <el-select v-model="mobile_code" style="min-width: 6rem; width:6.8rem" class="text-center ml-1">
                            <el-option v-for="item in countries" :key="item.id" :label="`+ ${item.mobile_prefix}`" :value="item.mobile_prefix">{{item.name}} (+{{item.mobile_prefix}})
                            </el-option>
                        </el-select>
                    </div>
                    <i slot="suffix" v-if="form1.phone!=''" @click="form1.phone=''" class="el-input__icon el-icon-close"></i>
                </el-input>
            </el-form-item>

            <div>
                <el-form-item class="ku-no-after border-bottom mt-4" prop="verification_code" :error="error.verification_code">
                    <el-input v-model="form1.verification_code" :placeholder="$t('form.input_v')" @keyup.enter.native="handleLogin" type="number">
                        <svg-icon slot="prefix" name='security' height='38' width="20"></svg-icon>
                        <el-button slot="suffix" type="danger" round size="small" @click="isVerificationShow2=true" :disabled="form1.phone=='' || form1.phone.length<11" v-if="show_send_btn">{{$t('verify_code_get')}}</el-button>
                        <p slot="suffix" v-if="!show_send_btn" :key="12">
                            <TimerLeft :endTime="counter_end_time" :unit="['s']" @ended="show_send_btn = true" />
                        </p>
                    </el-input>
                </el-form-item>
                <p class="text-right mt-2" style="height:2rem"></p>

            </div>
            <div class="text-center">
                <PuzzleVerification v-model="isVerificationShow2" :puzzleImgList="puzzleImgList" blockType="puzzle" :width='300' :onSuccess="sendSMS" :key="attemp_try_cnt" />
            </div>

        </el-form>

        <div>
            <el-button type="danger" round class="w-100 my-4" @click="handleLogin()">{{$t('signin.i')}}</el-button>
            <p class="text-center mb-2">
                <span class="text-dark9">{{$t('signin.no')}}</span>
                <nuxt-link to='/register' class="text-danger px-2">{{$t('signin.go_up')}}</nuxt-link>
            </p>
        </div>

    </div>

    <div class="login-weixin mb-4">
        <el-button type="success" icon="el-icon-wechat" circle @click="WechatLogin">
            <svg-icon name="wechat" width='30' height='30'></svg-icon>
        </el-button>
        <p>{{$t('signin.wechat')}}</p>
    </div>

    <el-dialog title="" :visible.sync="dlg_wchat" width="90%" :show-close="false">

        <!-- <div slot="title" class="position-fixed w-100 border-bottom" style="z-index:999"></div>  -->
        <div class="text-center">
            <!-- <iframe :src="url_wechat" frameborder="0" height="400px"></iframe> -->
            <client-only>
                <vue-qr :text="url_wechat" />
            </client-only>
        </div>

    </el-dialog>

</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import PuzzleVerification from 'vue-puzzle-verification'
import TimerLeft from '~/components/TimerLeft.vue'
import { SMS } from "~/api/user";
import { getWeiXin } from "~/api/weixin";
import Echo from 'laravel-echo'
import puzzleImgList from "@/static/json/puzzleImgList.json";

export default {
    name: 'Login',
    middleware: 'notAuthenticated',
    components: {
        TimerLeft,
        PuzzleVerification
    },
    data() {
        return {
            tab_items: [
                { id: "acc", name: this.$t('signin.account') },
                { id: "sms", name: this.$t('signin.sms') }
            ],
            activeTabName: 'acc',
            mode: 0,
            form0: {
                user_name: '',
                password: '',
                mode: 0
            },
            form1: {
                phone: '',
                verification_code: '',
                mode: 1
            },
            mobile_code: "86",
            rules0: {
                user_name: [{ required: true, message: this.$t('valid.required', [this.$t('mobile.number') + ', ' + this.$t('email')]), trigger: ['blur', 'change'] }, ],
                password: [{ required: true, message: this.$t('valid.required', [this.$t('form.pass')]), trigger: ['blur', 'change'] }, ]
            },
            rules1: {
                phone: [
                    { required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur', 'change'] },
                    { min: 11, message: this.$t('valid.min.string', [this.$t('mobile'), 11]), trigger: ['blur', 'change'] },
                ],
                verification_code: [
                    { required: true, message: this.$t('valid.required', [this.$t('verify_code')]), trigger: ['blur', 'change'] }
                ]
            },
            error: {
                phone: '',
                verification_code: '',
            },
            alert_title: "",
            show_send_btn: true,
            counter_end_time: 0,
            isVerificationShow2: false,
            puzzleImgList,
            captcha_success: false,
            attemp_try_cnt: +new Date(),

            dlg_wchat: false,
            // snsapi_userinfo, snsapi_base
            url_wechat: ``,
            wechat_channel: '',
            wechat_url: ``,
            users: [],
            activeUser: '',
            // on_wechat_browser: !!this.$route.query.on_wechat,
            redirect: this.$route.query.redirect
        }
    },
    computed: {
        ...mapState('world', ['countries']),
        is_weixin: function () {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        }
    },
    head() {
        return{
            title: this.$t('signin.i')      
        }
    },
    methods: {
        ...mapActions('world', ['getCountry']),
        handleLogin() {
            if (this.mode == 0) {
                this.$refs['formPass'].validate((valid) => {
                    if (valid) {
                        this.$store.dispatch('login', this.form0)
                            .then(() => {
                                if (this.$route.query.redirect) {
                                    // window.open(`${process.env.M_URL}${this.$route.query.redirect}`, "_self")
                                    this.$router.replace({ path: this.$route.query.redirect })
                                } else
                                    this.$router.replace({ path: '/' })
                            })
                            .catch(error => {
                                if (Array.isArray(error))
                                    this.alert_title = error.join('\n')
                                this.$notify({
                                    title: this.$t('error'),
                                    message: this.$t('msg.login_error'),
                                    type: 'error'
                                });

                            })
                    }
                });
            } else {
                this.$refs['formSMS'].validate((valid) => {
                    if (valid) {
                        this.$store.dispatch('login', this.form1)
                            .then(() => {
                                if (this.$route.query.redirect) {
                                    // window.open(`${process.env.M_URL}${this.$route.query.redirect}`, "_self")
                                    this.$router.replace({ path: this.$route.query.redirect })
                                } else
                                    this.$router.replace({ path: '/' })
                            })
                            .catch(error => {
                                if (Array.isArray(error))
                                    this.alert_title = error.join('\n')
                                this.$notify({
                                    title: this.$t('error'),
                                    message: this.$t('msg.login_error'),
                                    type: 'error'
                                });
                            })
                        // this.$auth.loginWith('local', {data: this.form1})
                    }
                });
            }
        },
        handleTabChange(active_tab) {
            this.alert_title = ''
            if (this.activeTabName == 'acc') {
                this.$refs['formSMS'].resetFields();
                this.mode = 0
            } else {
                this.$refs['formPass'].resetFields();
                this.mode = 1
            }
        },
        sendSMS() {
            this.isVerificationShow2 = false
            this.attemp_try_cnt++
            this.alert_title = ''

            const phone = this.mobile_code + this.form1.phone
            const da = {
                "mode": 1,
                "phone": this.form1.phone,
                "phone_prefix": this.mobile_code
            }
            SMS(da).then(res => {
                console.log(res.result)
                if (res.result.Code == "OK") {
                    this.counter_end_time = +new Date() + 60000
                    this.show_send_btn = false
                } else {
                    this.error.phone = res.result.Code
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
        establishWS(channel_id) {

            window.Pusher = require('pusher-js');

            window.Echo = new Echo({
                broadcaster: 'pusher',
                key: process.env.PUSHER_APP_KEY,
                wsHost: process.env.WS_HOST,
                wsPort: process.env.WS_PORT,
                disableStats: true,
                encrypted: false,
                enabledTransports: ['ws'],
                forceTLS: false,
                // cluster: 'ap1',
                // disabledTransports: ['xhr_streaming']
            });

            // window.Echo.connector.pusher.connection.bind('connected', ()=>{
            //     console.log('connected')
            // })

            window.Echo.channel(`antway.weixin.callback.${channel_id}`)
                .listen("WeixinCallback", event => {
                    console.log('event.message', event);
                    window.Echo.leaveChannel(`antway.weixin.callback.${channel_id}`);
                    window.Echo = null
                    this.dlg_wchat = false
                    if (event.token) {
                        this.$store.dispatch('setToken', event.token)
                        this.$store.dispatch('setUserAuth', event.user)
                        if (this.$route.query.redirect) {
                            // window.open(`${process.env.M_URL}${this.$route.query.redirect}`, "_self")
                            this.$router.replace({ path: this.$route.query.redirect })
                        } else
                            this.$router.replace({ path: '/' })
                    } else {
                        localStorage.setItem('mAntway_wx_temp', JSON.stringify(event))
                        this.$router.push({ path: "/register_weixin", query: { redirect: this.redirect } })
                    }
                })
        },

        WechatLogin() {
            // alert("weixin="+ this.is_weixin)
            // for invite
            // if (this.on_wechat_browser) {
            if (this.is_weixin) {
                getWeiXin().then(res => {
                    const r_uri = encodeURIComponent(this.redirect)
                    const back_uri = encodeURIComponent(`${process.env.M_URL}/callback1?redirect=${r_uri}`)
                    this.url_wechat = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${process.env.WX_APP_ID}&redirect_uri=${back_uri}&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect`
                    window.open(this.url_wechat, '_self')
                })
            }
            // general
            else {
                if (this.wechat_channel) {
                    this.dlg_wchat = true
                } else {
                    getWeiXin().then(res => {
                        this.wechat_url = res.url
                        this.wechat_channel = res.channel_id
                        this.url_wechat = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${process.env.WX_APP_ID}&redirect_uri=http%3A%2F%2Fm.antway.cn%2Fcallback&response_type=code&scope=snsapi_userinfo&state=${res.channel_id}&connect_redirect=1#wechat_redirect`
                        this.dlg_wchat = true
                        this.establishWS(res.channel_id)
                    })
                }
            }
        }
    },
    mounted() {
        // const r_uri = encodeURIComponent(this.redirect)
        // const back_uri = encodeURIComponent(`${process.env.M_URL}/callback1?redirect=${r_uri}`)  
        // console.log(back_uri)
        if (!this.countries.length) this.getCountry()

    }

}
</script>
