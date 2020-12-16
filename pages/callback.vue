<template>
<div class="text-center mt-5">
    正在登录...
    <!-- <div class="text-center mt-4">
        <el-button type="primary" size="default" @click="sendC">Continue(SendCode)</el-button>
    </div> -->
</div>
</template>

<script>
// import axios from 'axios'
import { sendCodeWeiXin } from "~/api/weixin";
export default {    
    methods: {
        sendC() {
            const code = this.$route.query.code
            const state = this.$route.query.state
            sendCodeWeiXin({ code, state }).then(res => {
                // alert("Successfull "+ JSON.stringify(res))            
                // window.open('/', '_self').close()
                console.log(res)
            }).catch(err => {
                alert('Something went wrong:' + JSON.stringify(err))
            })
        }
    },
    head: {
        title: "微信",       
    },
    mounted() {
        const code = this.$route.query.code
        const state = this.$route.query.state
        console.log(code, state)
        // alert("1.code = " + code + ' 2.state=' + state)
        sendCodeWeiXin({ code, state }).then(res => {
            WeixinJSBridge.call('closeWindow');             
            // window.open('/', '_self').close()
                   
        }).catch(err => {
            alert('Something went wrong:' + JSON.stringify(err))
        })
        // let reqUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${process.env.WX_APP_ID}&secret=${process.env.WX_APP_SECRET}&code=${code}&grant_type=authorization_code`
        // axios.get(reqUrl)
        //     .then(data => {
        //         const da= data.data
        //         alert("2.get token Data = "+ JSON.stringify(da))
        //         // this.$store.commit('SETACCESSTOKEN', data.accessToken)
        //         // window.location.replace("/")
        //         if (da){
        //             let infoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${da.access_token}&openid=${da.openid}&lang=zh_CN`
        //             axios.get(infoUrl).then(dd=>{
        //                 alert("3. User info= "+ JSON.stringify(dd))
        //             })
        //         }
        //     })
        //     .catch(err => {
        //         logger.error('Something went wrong:', err)
        //     })
    }
}
</script>
