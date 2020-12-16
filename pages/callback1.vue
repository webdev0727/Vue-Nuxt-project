<template>
<div class="text-center mt-5">
    <div v-if="!dialogVisible">
        <p>正在登录...</p>
        
        <!-- <div class="text-center mt-4">
            <el-button type="primary" size="default" @click="dialogVisible=true">Continue(SendCode)</el-button>
        </div> -->
    </div>
    
    <div v-else>
        <h2 class="mb-4">绑定微信</h2>
        <div>
            <el-radio v-model="reg_mode" label="binding" class="mb-2">已有账户绑定</el-radio>
            <el-radio v-model="reg_mode" label="new" class="mb-2">注册新的账号</el-radio>
        </div>
        <div class="mt-4 text-center">
            <el-button type="primary" size="default" class="w-75" round @click="goToRegister">{{$t('confirm.ok')}}</el-button>
        </div>
    </div>
</div>
</template>

<script>
// import axios from 'axios'
import { sendCodeWeiXin } from "~/api/weixin";
export default {
    data() {
        return {
            redirect: this.$route.query.redirect || '',
            dialogVisible: false,
            reg_mode: 'binding'
        }
    },
    head: {
        title: "微信",       
    },
    methods: {
        goToRegister(){
            this.$router.replace({ path: "/register_weixin", query: { redirect: this.redirect, mode: this.reg_mode } })
        },
        sendC() {
            const code = this.$route.query.code
            const state = ''
            sendCodeWeiXin({ code, state }).then(event => {
                console.log(event)
                if (event.token) {
                    this.$store.dispatch('setToken', event.token)
                    this.$store.dispatch('setUserAuth', event.user)
                    // window.open(`${process.env.M_URL}${this.redirect}`, "_self")
                    this.$router.replace({ path: this.redirect })
                } else {
                    this.dialogVisible = true
                    localStorage.setItem('mAntway_wx_temp', JSON.stringify(event))
                }
            }).catch(err => {
                this.$notify({
                    title: this.$t('error'),
                    message: JSON.stringify(err),
                    type: 'error'
                });
                setTimeout(() => {
                    // window.open(`${process.env.M_URL}${this.redirect}`, "_self")
                    this.$router.replace({ path: this.redirect })
                    
                }, 3000);
            })
        }
    },
    mounted() {
        this.sendC()
    }
}
</script>
