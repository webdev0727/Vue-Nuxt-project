<template>
<div>
    <kuc-page-header :title="$t('update.info')"></kuc-page-header>
    <div class="mt-2 bg-white p-2">
        <ProcessBar3 :status="step" :items='process_items' />
        <el-alert v-if="alert_title" :title="alert_title" type="warning" show-icon @close="alert_title=''"></el-alert>
        
        <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" class="mt-3">
            <div class="bg-white px-2" v-if="step<3">
                <ku-line />
                <div v-if="step==1">
                    <div class="py-input d-flex justify-content-between">
                        <p>{{$t(type)}}</p>
                        <p class="text-dark9"><span v-if="type=='phone'"> +{{info.phone_prefix}}</span>{{info[type]}}</p>
                    </div>
                    <ku-line />
                </div>
                <template v-else-if="step==2">

                    <el-form-item prop="phone" v-if="type=='phone'">
                        <el-input v-model="info.phone" class="text-right" :placeholder="$t('form.input')" type="number">
                            <ku-mobile slot="prepend" :mobile_code.sync="info.phone_prefix" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="email" v-if="type=='email'">
                        <el-input v-model="info.email" class="text-right" :placeholder="$t('form.input')">
                            <template slot="prepend">{{$t('email')}}</template>
                        </el-input>
                    </el-form-item>
                </template>

                <el-form-item class="ku-no-after" prop="code" :error="error.code">
                    <el-input v-model="info.code" :placeholder="$t('form.input_v')">
                        <span slot="prepend">{{$t('verify_code')}}</span>
                        <el-button slot="append" type="text" round size="small" @click="isVerificationShow2=true" v-if="show_send_btn" class="text-danger">{{$t('verify_code_send')}}</el-button>
                        <p slot="append" v-if="!show_send_btn" :key="12">
                            <TimerLeft :endTime="counter_end_time" :unit="['s']" @ended="show_send_btn = true" />
                        </p>
                    </el-input>
                </el-form-item>

                <div class="text-center">
                    <PuzzleVerification v-model="isVerificationShow2" :puzzleImgList="puzzleImgList" blockType="puzzle" :width='300' :onSuccess="handleCaptchaSuccess" :key="attemp_try_cnt"/>
                </div>
            </div>
            <div v-else>
                <SuccessIcon />
                <h2 class="text-center pb-3">{{$t('submit.success')}}</h2>
            </div>
        </el-form>

    </div>

    <div class="mt-3 text-center text-dark9">
        <p>为确认是你本人操作,请完成以下验证</p>
    </div>

    <div class="text-center">
        <el-button type="danger" round class="w-75 my-3" @click="handleSubmit">{{$t('confirm.ok')}}</el-button>
    </div>

</div>
</template>

<script>
import ProcessBar3 from "@/components/ProcessBar3"
import TimerLeft from '~/components/TimerLeft.vue'
import PuzzleVerification from 'vue-puzzle-verification'
import { getInfo, updateUser, userVerify, SMS } from "@/api/user"
import SuccessIcon from "@/components/successIcon"
import puzzleImgList from "@/static/json/puzzleImgList.json";

export default {
    middleware: 'authenticated',
    name: 'ProfileUpdateMobileOrEmail',
    components: { ProcessBar3, PuzzleVerification, TimerLeft, SuccessIcon },
    data() {
        return {
            type: this.$route.params.type || 'phone',
            process_items: [this.$t('step.verify_id'), this.$t('update'), this.$t('step.complete')],
            step: 1,
            puzzleImgList,
            isVerificationShow2: false,
            counter_end_time: 0,
            show_send_btn: true,
            attemp_try_cnt: 1,
            info: {
                code: '',
                phone_prefix: '86',
                phone: this.$store.state.auth.phone,
                email: this.$store.state.auth.email,
                field: this.$route.params.type == 'email' ? 'email' : 'phone',
                mode: 1
            },
            rules: {
                code: [
                    { required: true, message: this.$t('valid.required', [this.$t('verify_code')]), trigger: ['blur', 'change'] }
                ],
                phone: [
                    { required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur', 'change'] },
                    { min: 11, message: this.$t('valid.min.string', [this.$t('mobile'), 11]), trigger: ['blur'] },
                ],
                email: [{ type: 'email', message: this.$t('valid.email', [this.$t('email')]), trigger: ['blur', 'change'] }, ],
            },
            error: {
                code: ''
            },
            alert_title:''
        }
    },
    computed: {},
    methods: {
        handleTabChange(activeTab) {},
        handleCaptchaSuccess() {
            this.error['code'] = ''
            this.isVerificationShow2 = false
            this.attemp_try_cnt++
            this.alert_title = ''

            let data = { "mode": 1 }
            if (this.type == "phone") {
                data.phone = '+' + this.info.phone_prefix + this.info.phone
            } else {
                data.email = this.info.email
            }
            if (this.step == 2) data.mode = 0
            SMS(data).then(res => {
                if (res.result.Code == "OK") {
                    this.counter_end_time = +new Date() + 60000
                    this.show_send_btn = false
                }
            }).catch(error => {
                if (error.result) {
                    if (error.result.Code == 'isv.BUSINESS_LIMIT_CONTROL') {
                        this.alert_title = this.$t('msg.max_try_exceed')                        
                    }
                    else this.alert_title = error.result.Message
                }
            })

        },
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    let form_s = Object.assign({}, this.info)
                    if (this.type == 'phone') {
                        delete form_s.email

                    } else {
                        delete form_s.phone_prefix
                    }
                    if (this.step == 2) form_s.mode = 0
                    console.log(form_s)
                    userVerify(form_s).then(res => {
                        this.step = this.step + 1
                        this.info.phone = ''
                        this.info.code = ''
                        this.$refs['dataForm'].resetFields();
                        this.show_send_btn = true
                        this.counter_end_time = 0
                        this.isVerificationShow2 = false
                        if (this.step == 3) {
                            this.$store.dispatch('setUserAuth', res.user)
                            setTimeout(() => {
                                this.goBack()
                            }, 1500);
                        }

                    }).catch(error => {
                        console.log("Api failed!", error)
                        this.error = error
                        this.show_send_btn = true
                        this.counter_end_time = 0
                        this.info.code = ''
                        if (Array.isArray(error))
                            this.alert_title = error.join('\n')
                        // if (error[0]) this.error['verification_code'] = [this.error[0]]
                        
                    })
                } else {
                    return false;
                }
            });
        },

    },
    mounted() {
        if (this.type=='email' && !this.info.email) this.step = 2
        if (this.type=='phone' && !this.info.phone) this.step = 2
    },
}
</script>