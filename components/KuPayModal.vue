<template>
<el-dialog :visible.sync="dialogVisable" class="w-100 px-3 text-center m-auto m-max-width" width="100%" @close="$emit('update:visible', false)">
    <h2 slot="title">选择付款方式</h2>
    <p v-if="title" class="text-dark6 font-09"><span>{{$t(title)}}：</span> 
        <strong class="text-danger font-12">{{amount}}元</strong>
        (<strong class="text-danger font-12">{{amountUsd}}</strong>美元)
    </p>
    <slot></slot>
    <!-- Payment Method Option -->
    <div class="mt-4">

        <div @click="onAlipayClick" class="rounded mb-3 py-1" style="border: 1px solid rgb(0, 0, 0); height: 50px;">
            <img src="/icons/alipay.png" alt="alipay" height="40" />
        </div>

        <client-only>
            <paypal-checkout env="sandbox" :amount="amountUsd+''" :currency="paypal_currency" :locale="paypal_locale" :client="paypal_credentials" :button-style="paypal_btn_style" @payment-authorized="onPaypalPaymentAuthorized" @payment-completed="onPaypalPaymentCompleted" @payment-cancelled="onPaypalPaymentCancelled" />
        </client-only>
    </div>
</el-dialog>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Echo from 'laravel-echo'
import { getAlipay } from "@/api/pay"

export default {
    name: "KuPayModal",
    props: {
        title: {
            type: String,
            default: ''
        },
        visible: {
            type: Boolean,
            default: false
        },
        alipay_subject: {
            type: String,
            default: '会员价格'
        },
        amount: {
            type: [String, Number],
            default: 0
        },        
        paypal_currency: {
            type: String,
            default: "USD" //CNY
        },
        // usage for pay
        whatfor: {
            type: String,
            default: "SELLER_APPLICANT"
        },

    },
    data() {
        return {
            dialogVisable: this.visible,
            paid_status: 0,
            // PayPal-----------------------------------------------------------------------------------------
            paypal_credentials: {
                sandbox: process.env.PAYPAL_CREDENTIALS_SANDBOX, //'<sandbox client id>',
                production: process.env.PAYPAL_CREDENTIALS_PRODUCTION // '<production client id>'
            },
            paypal_btn_style: {
                // label: "",
                size: "responsive", // small | medium | large | responsive
                shape: "rect", // pill | rect
                color: "white", // gold | blue | silver | black,
                height: 50
            },
            paypal_locale: this.$i18n.locale == 'zh' ? "zh_CN" : 'en_US',
            // Alipay-----------------------------------------------------------------------------------------
            alipay_link: null,
            alipay_channel_id: null,
            alipay_new_tab: null,
            // Prevent_refresh_flag , ------------------------------------------------------------------------
            // transaction_status, {0:init, 1:ws, 2: saving_transaction, (3):complete}
            transaction_status: 0,
            transaction_data: {
                // vip_id: this.$route.params.id,
                status: "",
                channel: "alipay",
                payment_type: this.whatfor
            }
        }
    },
    computed: {
        ...mapState('common', {
            cny_usd: (state) => state.list.cny_usd,
            usd_cny: (state) => state.list.usd_cny,
        }),
        amountUsd: function () {
            let p_usd = 0
            if (this.amount) {
                p_usd = this.amount * this.cny_usd
                p_usd = p_usd.toFixed(2)
            }
            return p_usd
        },

    },
    methods: {      
        ...mapActions('common', ['getUnitsList']),  
        setTransaction(tmp) {
            this.transaction_data = Object.assign(this.transaction_data, tmp)
        },
        saveTransaction() {
            if (this.transaction_data.status == 'completed') {
                this.transaction_status = 2
                this.$emit('success', this.transaction_data)
                // this.$store.dispatch("common/setLoading")
                // userPricing(2, this.transaction_data).then(res => {
                //     if (res.user) {
                //         this.$store.dispatch('setToken', res.token)
                //         this.$store.dispatch('setUserAuth', res.user)
                //     }
                //     this.transaction_status = 0
                //     this.processIndex = 3
                // }).catch(() => {

                // }).finally(() => {
                //     this.$store.dispatch("common/setLoading", false)
                // })
            } else {
                this.transaction_status = 0
                const resut_t = JSON.parse(this.transaction_data.result)
                this.$notify({
                    title: this.$t('error'),
                    message: resut_t ? resut_t.error : this.$t('error'),
                    type: 'error'
                });
            }
        },
        // ===================================================================================================
        //  Alipay
        // ===================================================================================================
        async onAlipayClick() {

            // console.log(this.amount)
            // return false
            if (!this.alipay_link) {
                const amount = 0.01
                // const amount = this.amount
                const res = await getAlipay(this.alipay_subject, amount).catch(() => {})
                if (res) {
                    this.alipay_link = res.link
                    this.alipay_channel_id = res.channel_id
                }
            }
            if (this.alipay_link) {
                this.alipay_new_tab = window.open(this.alipay_link, "_blank");
                // if(window.Echo){
                //     // window.Echo.leaveChannel(`antway.alipay.callback.${this.alipay_channel_id}`);
                // }
                if (this.transaction_status != 1 || !window.Echo)
                    this.establishWS(this.alipay_channel_id)
            }
        },
        establishWS() {
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
                // cluster: process.env.PUSHER_APP_CLUSTER,
            });

            window.Echo.connector.pusher.connection.bind('connected', () => {
                this.transaction_status = 1
            })

            window.Echo.channel(`antway.alipay.callback.${this.alipay_channel_id}`)
                .listen("AlipayCallback", callback => {
                    // console.log("onAlipayCallback()", callback);

                    window.Echo.leaveChannel(`antway.alipay.callback.${this.alipay_channel_id}`);
                    window.Echo = null

                    const param = JSON.parse(callback.result);
                    // calback ex:
                    // {
                    //     charset: UTF - 8,
                    //     out_trade_no: 202011182231115104,
                    //     method: alipay.trade.page.pay.return,
                    //     total_amount: 0.01,
                    //     sign: X11q7xuiZz6qGMnRI60FBbegOfB....,
                    //     trade_no: 2020111822001466421430281136,
                    //     auth_app_id: 2021001190669295,
                    //     version: 1.0,
                    //     app_id: 2021001190669295,
                    //     sign_type: RSA2,
                    //     seller_id: 2088501717208553,
                    //     timestamp: 2020-11-18 22:32:06
                    // }
                    this.transaction_data = Object.assign(this.transaction_data, {
                        status: "completed",
                        channel: "alipay",
                        result: callback.result,
                        amount: this.amount,
                        payment_id: param.trade_no,
                        payment_at: this.parseTime(param.timestamp),
                        payment_amount: param.total_amount,
                        payment_currency: "CNY",
                        payment_rate: 1,
                        payment_contact: param.seller_id,
                        payment_account: `unknown`
                    })
                    this.paid_status = 1;
                    if (this.alipay_new_tab) {
                        this.alipay_new_tab.close();
                    }
                    this.saveTransaction()
                    // this.handleRedirect()
                })
        },
        // ===================================================================================================
        //  PayPal
        // sb-tk47ns3743096@business.example.com / twX0$(LS
        // https://www.npmjs.com/package/vue-paypal-checkout
        // ===================================================================================================

        onPaypalPaymentAuthorized(param) {
            this.transaction_status = 1
            // console.log("onPaypalPaymentAuthorized()", param);
            const tmp = {
                status: "authorized",
                channel: "paypal",
                result: JSON.stringify(param)
            };
            this.setTransaction(tmp)
        },
        onPaypalPaymentCompleted(param) {
            console.log("onPaypalPaymentCompleted()");
            this.transaction_status = 1
            // response
            // {
            //     "id": "PAY-4N746561P0587231SKQQK6MY",
            //     "create_time": "2014-09-22T23:22:27Z",
            //     "update_time": "2014-09-22T23:31:13Z",
            //     "state": "approved",
            //     "intent": "sale",
            //     "payer": {
            //         "payment_method": "paypal",
            //         "payer_info": {
            //               "email": "npurayil-uspr-60@paypal.com",
            //               "first_name": "Brian",
            //               "last_name": "Robinson",
            //               "payer_id": "JMKDKJ4D7DG7G",
            //               "shipping_address": {
            //                   "line1": "4thFloor",
            //                   "line2": "unit#34",
            //                   "city": "SAn Jose",
            //                   "state": "CA",
            //                   "postal_code": "95131",
            //                   "country_code": "US",
            //                   "phone": "011862212345678",
            //                   "recipient_name": "HelloWorld"
            //               }
            //          }
            //     }
            // }
            const tmp = {
                status: "completed",
                channel: "paypal",
                result: JSON.stringify(param),
                amount: this.amount,
                payment_id: param.transactions[0].related_resources[0].sale.id,
                payment_at: this.parseTime(param.create_time),
                payment_amount: this.amountUsd,
                payment_currency: "USD",
                payment_rate: this.cny_usd,
                payment_contact: param.payer.payer_info.email,
                payment_account: `${param.payer.payer_info.first_name} ${param.payer.payer_info.middle_name} ${param.payer.payer_info.last_name}`
            };
            this.setTransaction(tmp)
            this.paid_status = 1;
            this.dialogVisable = false
            this.saveTransaction()
        },
        onPaypalPaymentCancelled(param) {
            this.transaction_status = 0
            const tmp = {
                status: "cancelled",
                channel: "paypal",
                result: JSON.stringify(param),
            };
            this.setTransaction(tmp)
        },

        onDirectPayment() {
            this.transaction_data = {
                status: "pending",
                channel: "direct",
                result: "{}",
                amount: this.amount,
                currency: "CNY",
                payment_rate: 1
            };
            this.paid_status = 0;
            this.dialogVisable = false;
        },
        preventRefreshDuringWS(e) {
            if (this.transaction_status > 0) {
                e.preventDefault()
                e.returnValue = ''
            }
        }
    },
    beforeMount() {
        window.addEventListener("beforeunload", this.preventRefreshDuringWS)
    },
    beforeDestroy() {
        window.removeEventListener("beforeunload", this.preventRefreshDuringWS)
    },
    watch: {
        visible(new_v) {
            if (this.dialogVisable != new_v) {
                if(new_v == false) this.transaction_status = 0
                this.dialogVisable = new_v
            }
        },
    },
    mounted(){
        this.getUnitsList(['cny_usd', 'usd_cny'])
    }
}
</script>
