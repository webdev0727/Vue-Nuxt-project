<template>
<div class="">
    <kuc-page-header :title="$t('msg.send')"></kuc-page-header>
    <div class="mt-2">
        <div class="bg-white px-2">
            <el-form :model="info" class="" label-width="0" ref='dataForm' :rules="rules">
                <!-- Group -->
                <template v-if="!info.reciever_name">
                    <el-row class="py-input px-1">
                        <el-col :span="12">
                            <el-radio v-model="info.is_group" :label="0" style="w-50">{{$t('msg.email_s')}}</el-radio>
                        </el-col>
                        <el-col :span="12">
                            <el-radio v-model="info.is_group" :label="1">{{$t('msg.email_g')}}</el-radio>
                        </el-col>
                    </el-row>
                    <ku-line />
                </template>

                <!-- reciever_name from query -->
                <el-form-item v-if="info.reciever_name">
                    <el-input :value="info.reciever_name" class="text-right" readonly>
                        <template slot="prepend">{{$t('recipient')}}</template>
                    </el-input>
                </el-form-item>

                <!-- user emial or mobile -->
                <el-form-item prop="recipient" v-show="!info.reciever_name">
                    <el-input v-model="info.recipient" class="text-right" :placeholder="$t('form.input1')">
                        <template slot="prepend">{{$t('recipient')}}</template>
                    </el-input>
                </el-form-item>
                <!-- tilte -->
                <el-form-item prop="title">
                    <el-input v-model="info.title" class="text-right" :placeholder="$t('form.input1')">
                        <template slot="prepend">{{$t('title')}}</template>
                    </el-input>
                </el-form-item>

                <!-- description -->
                <el-form-item class="mt-1 ku-no-after" prop="content">
                    <p>{{$t('content.req')}}</p>
                    <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 15}" maxlength="500" v-model="info.content" show-word-limit :placeholder="$t('form.say')"></el-input>
                </el-form-item>

            </el-form>
        </div>

        <div class="text-center py-3">
            <el-button type="danger" round class=" w-75" @click="handleSubmit">{{$t('msg.send_btn')}}</el-button>
        </div>

    </div>

</div>
</template>

<script>
import { sendMsg } from "~/api/message"
import { userSearch, getInfo } from "~/api/user"
export default {
    middleware: 'authenticated',
    name: 'NewMessage',
    components: {},
    head() {
        return{
            title: this.$t('msg.send')
        }
    },
    data() {
        return {
            info: {
                recipient: this.$route.query.to || '',
                title: '',
                content: '',
                is_group: 0,
                limit_no: false,
                receiver_id: "",
                pid: 0,
                tag: 0,
                reciever_name: this.$route.query.name || ''
            },
            dialogImageUrl: '',
            dialogVisible: false,
            rules: {
                recipient: [{ required: true, message: this.$t('valid.required', [this.$t('recipient')]), trigger: ['blur', 'change'] }, ],
                title: [{ required: true, message: this.$t('valid.required', [this.$t('title')]), trigger: ['blur', 'change'] }, ],
                content: [{ required: true, message: this.$t('valid.required', [this.$t('content.i')]), trigger: ['blur', 'change'] }, ],
            },

        }

    },
    computed: {},
    methods: {        
        sendMessage() {
            this.$store.dispatch("common/setLoading")
            sendMsg(this.info).then(() => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.add'),
                        type: 'success'
                    });
                    this.$router.replace({ path: '/my/message', query: { tab: 'sent' } })
                })
                .finally(() => {
                    this.$store.dispatch("common/setLoading", false)
                })
        },
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {

                if (valid) {
                    if (!this.info.receiver_id) {
                        this.$store.dispatch("common/setLoading")
                        userSearch(this.info.recipient).then(({ user }) => {
                            if (user) {
                                this.info.receiver_id = user.id
                                this.sendMessage()
                            }
                        }).finally(error => {
                            this.$store.dispatch("common/setLoading", false)
                        })
                    } else this.sendMessage()

                } else {
                    return false;
                }
            });
        }, 
    },
    mounted() {
        const user_id = this.$route.query.uid
        if (user_id) {
            getInfo(user_id).then(res => {
                this.info.receiver_id = user_id
                this.info.recipient = res.user.phone || res.user.email
                this.info.reciever_name = this.gsv(['name', this.$i18n.locale], res.user)
            })
        }
    }
}
</script>
