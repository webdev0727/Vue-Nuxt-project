<template>
<div class="bg-white">
    <kuc-page-header :title="$t('msg.detail')"></kuc-page-header>
    <div class="p-2" v-if="info.id">
        <template v-if="info.sender_id == $store.state.auth.id">
            <h3>{{$t('my')}} <span v-if="!info.answers.length" class="text-dark9 font-09"> to {{gsv(['name', $i18n.locale], info.receiver)}}</span> </h3>
        </template>

        <template v-else>
            <h3 v-if="$i18n.locale=='zh'">{{gsv(['name', 'zh'], info.sender) || gsv(['user_name'], info.sender) || gsv(['name'], info.sender)}} <span class="font-09">{{GENDER['zh'][sender_sex]}}</span> </h3>
            <h3 v-else><span class="font-09">{{GENDER['en'][sender_sex]}}</span> {{gsv(['name', 'en'], info.sender) || gsv(['user_name'], info.sender) || gsv(['name'], info.sender)}}</h3>
        </template>

        <div class="d-flex justify-content-between text-dark9 mt-2 mb-3 font-09">
            <p>最近登录时间：{{formatTime(info.created_at)}}</p>
            <p v-if="info.created_at">{{parseTime(info.created_at)}}</p>
        </div>
        <h3>{{info.title}}</h3>
        <p class="my-3" v-html="info.content"></p>

        <!-- reply list -->
        <div v-if="info.answers" class="p-2">
            <el-timeline class="ml-n5">
                <el-timeline-item v-for="reply in info.answers" :key="reply.id">
                    <div>
                        <div class="d-flex justify-content-between">
                            <h3>{{reply.title}}</h3>
                            <p class="text-dark9">{{parseTime(reply.created_at)}} </p>
                        </div>
                        <p>
                            {{reply.content}}
                        </p>
                    </div>
                </el-timeline-item>
            </el-timeline>
        </div>
        <template v-if="!is_mine">
            <el-form ref="dataForm" :rules="rules" :model="reply" label-position="left" label-width="0" class="bg-white px-2 mt-2">
                <el-form-item prop="content" class="ku-no-after">
                    <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" maxlength="500" show-word-limit v-model="reply.content" :placeholder="$t('form.say')"></el-input>
                </el-form-item>
            </el-form>
            <div class="text-center py-3">
                <el-button type="primary" @click="handleSubmint" round class="w-75">{{$t('reply')}}</el-button>
            </div>
        </template>
    </div>
    <no-data class="mt-2" v-else-if="loaded" />
</div>
</template>

<script>
import { getDetail, getThread, sendMsg } from "~/api/message"
export default {
    middleware: 'authenticated',
    name: "NoticeDatail",
    data() {
        return {
            desc: '',
            info: {},
            reply: {
                content: "",
                receiver_id: '',
                title: this.$t('msg.title_reply', [this.$store.state.auth.name[this.$i18n.locale]]),
                content: '',
                is_group: 0,
                pid: 0,
                tag: 0
            },
            rules: {
                content: [{ required: true, message: this.$t('valid.required', [this.$t('content.i')]), trigger: ['blur', 'change'] }, ],
            },
            is_mine: true,
            loaded: false
        }
    },
    computed: {
        sender_sex: function () {
            return this.gsv(['gender'], this.info.sender) || 0
        }
    },
    head() {
        return {
            title: this.$t('msg.detail')
        }
    },
    methods: {
        handleSubmint() {
            this.$refs['dataForm'].validate((valid) => {

                if (valid) {
                    this.$store.dispatch("common/setLoading")
                    sendMsg(this.reply).then(() => {
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
                } else {
                    return false;
                }
            });
        }

    },
    mounted() {
        const m_id = this.$route.params.id
        const m_pid = this.$route.query.pid
        // console.log(m_pid, " = m_pid")
        if (m_pid == undefined) {
            this.is_mine = false
            this.reply.pid = m_id
            getThread(m_id).then(res => {
                if (res.message) {
                    this.info = res.message
                    this.reply.receiver_id = res.message.receiver_id == this.$store.state.auth.id ? res.message.sender_id : res.message.receiver_id
                }
            }).finally(() => {
                this.loaded = true
            })
        } else {
            if (m_pid == '0') {
                this.is_mine = true
                this.reply.pid = m_id
                getDetail(m_id).then(res => {
                    this.info = res.message || {}
                }).finally(() => {
                    this.loaded = true
                })
            } else {
                this.is_mine = false
                this.reply.pid = m_pid
                getDetail(m_pid).then(res => {
                    this.info = res.message || {}
                    this.reply.receiver_id = res.message.receiver_id == this.$store.state.auth.id ? res.message.sender_id : res.message.receiver_id
                }).finally(() => {
                    this.loaded = true
                })

            }
        }
    }
}
</script>
