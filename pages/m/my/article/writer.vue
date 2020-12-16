<template>
<div>
    <kuc-page-header :title="$t('article.cont')" />
    <div>
        <p class="p-3 text-danger" v-if="status_writer==0">{{$t('msg.Not_the_Columnist_Apply_now')}}</p>
        <p class="p-3 text-danger" v-if="status_writer==1">您已经填写了信息申请表。 正在检查中，请稍候。</p>
    </div>
    <div class="bg-white px-2">
        <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0">
            <div class="d-flex align-items-center justify-content-between">
                <p>{{$t('column_portait')}}</p>
                <div class="py-2 ml-2">
                    <ku-upload-avatar :avatar_pre.sync="logo_pre" name="avatar" :f_data.sync="logo_file" />
                </div>
            </div>
            <ku-line />

            <el-form-item prop="name.zh">
                <el-input v-model="info.name.zh" class="text-right" placeholder=" ">
                    <template slot="prepend">{{$t('name.column')}}（{{$t('lang.zh')}}）</template>
                </el-input>
            </el-form-item>
            <el-form-item prop="name.en">
                <el-input v-model="info.name.en" class="text-right" placeholder=" ">
                    <template slot="prepend">{{$t('name.column')}}（{{$t('lang.en')}}）</template>
                </el-input>
            </el-form-item>

            <el-form-item class="mt-1 ku-no-after">
                <p>{{$t('intro.i')}}（{{$t('lang.zh')}}）</p>
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 8}" maxlength="500" show-word-limit v-model="info.summary.zh" :placeholder="$t('form.say')"></el-input>
            </el-form-item>

            <el-form-item class="mt-1 ku-no-after">
                <p>{{$t('intro.i')}}（{{$t('lang.en')}}）</p>
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 8}" maxlength="500" show-word-limit v-model="info.summary.en" :placeholder="$t('form.say')"></el-input>
            </el-form-item>

            <el-form-item prop="position" class="ku-no-after">
                <el-input v-model="info.position" class="text-right" :placeholder="$t('profession')">
                    <template slot="prepend">{{$t('profession')}}</template>
                </el-input>
            </el-form-item>

        </el-form>
    </div>
    <div class="text-center pt-3 pb-5">
        <el-button type="primary" round class="w-75" @click="handleSubmit">{{$t('save.setting')}}</el-button>
    </div>
</div>
</template>

<script>
import { getInfo } from "@/api/user"
import { addWriter } from "@/api/writer"
export default {
    middleware: ['authenticated'],
    name: "WriterInformation",
    head() {
        return {
            title: this.$t('article.cont')
        }
    },
    data() {
        return {
            info: {
                name: {
                    en: '',
                    zh: ''
                },
                summary: {
                    en: '',
                    zh: ''
                },
                id: this.$store.state.auth.id,
                position:''
            },
            is_create: true,
            status_writer: 2,
            logo_pre:  this.$store.state.auth.writer_avatar,
            logo_file: {},

            rules: {
                "name.en": [{ required: true, message: this.$t('valid.required', [this.$t('name.column')]), trigger: ['blur'] }, ],
                "name.zh": [{ required: true, message: this.$t('valid.required', [this.$t('name.column')]), trigger: ['blur'] }, ],
                position: [{ required: true, message: this.$t('valid.required', [this.$t('profession')]), trigger: ['blur'] }, ],

            },            
        }
    },
    methods: {
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    let form_s = new FormData()
                    if (this.logo_file instanceof FormData) {
                        for (let pp of this.logo_file.entries()) {
                            form_s.append(pp[0], pp[1])
                        }
                    }
                    let ob = Object.assign({}, this.info)
                    // delete ob.checked1
                    ob = this.buildQuery(ob)
                    for (const key in ob) {
                        if (ob.hasOwnProperty(key)) {
                            const el = ob[key];
                            form_s.append(key, el)
                        }
                    }
                    // for (let pp of form_s.entries()) {
                    //     console.log(pp[0], "--", pp[1])
                    // }

                    addWriter(form_s).then(() => {
                            this.$notify({
                                title: this.$t('success'),
                                message: this.$t('success.add'),
                                type: 'success'
                            }); 
                            this.goBack()                           
                        })
                        .catch(error => {                            
                        })
                } else {
                    return false;
                }
            });
        },
    },
    mounted() {
        getInfo(this.$store.state.auth.id).then(({ user }) => {
            this.status_writer = user.status_writer            
            if (user.writer){
                this.is_create = false
                this.info.name = user.writer.name || this.$store.state.auth.name
                this.info.position = user.writer.position
                this.logo_pre = this.gsv(['avatar', 'url'], user.writer)
                if (user.writer.summary)
                    this.info.summary = user.writer.summary
            }
        })
    }
}
</script>
