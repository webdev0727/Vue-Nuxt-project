<template>
<div class="bg-white p-2">
    <h3 class="py-2">{{$t('upload.video')}}</h3>
    <ku-line />
    <!-- 视频路径 -->
    <p class="mt-2">{{$t('upload.video_path')}}</p>

    <!-- Image Form -->
    <el-form :model="info" ref="dataForm" :rules="rules" label-position="left" label-width="0">
        <div class="pt-3">
            <ku-upload :f_data.sync="files1" @on-success="hSuccess" ref="upload_gallery" class="upload-container" accept="video/*" :limit=1 list-type="text">
                <el-button slot="trigger" type="primary">{{$t('upload.i')}}</el-button>
            </ku-upload>
            <div class="el-form-item__error" v-if="error.file">{{error.file[0]}}</div>
        </div>

        <el-form-item prop="description_zh" class="ku-no-after">
            <p>{{$t('desc.video.zh')}}</p>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" maxlength="500" show-word-limit v-model="info.description_zh" :placeholder="$t('form.say')"></el-input>
        </el-form-item>

        <el-form-item prop="description_en" class="ku-no-after">
            <p>{{$t('desc.video.en')}}</p>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" maxlength="500" show-word-limit v-model="info.description_en" :placeholder="$t('form.say')"></el-input>
        </el-form-item>

    </el-form>

    <div class="text-center pt-2 my-2">
        <el-button type="primary" @click="handleSubmit" class="w-75" round="">{{$t('content.submit')}}</el-button>
    </div>

    <!-- already done -->
    <div class="mt-4">
        <p class="my-2">{{$t('uploaded.video', [list.length])}}</p>
        <ku-line />
        <div>
            <card-video-r v-for="(vi, ind) in list" :key='vi.id' :id="vi.id" :title='vi.description[$i18n.locale]' :subTitle="parseTime(vi.created_at, '{y}-{m}-{d} {h}:{i}') " :poster="vi.poster || '/images/bg_user.png'" @delete="handleDelete" @show="openGallery(vi.id, ind)"> </card-video-r>
        </div>
        <no-data v-if="!list.length" />
    </div>

    <client-only>
        <light-box ref="lightbox" :showLightBox='false' :media="media" :disableScroll='false' class="ku-no-thumb-bar" :key="video_key"></light-box>
    </client-only>

</div>
</template>

<script>
import { fileUpload, fileList, fileDel } from '@/api/file'
export default {
    name: "Company_Video",
    components: {},
    data() {
        return {
            info: {
                company_id: '',
                subtag: "video",
                description_zh: "",
                description_en: "",
            },
            video_key: "dd",
            files1: {},
            list: [],
            rules: {
                description_zh: [{ required: true, message: this.$t('valid.required', [this.$t('desc')]), trigger: ['blur', 'change'] }, ],
                description_en: [{ required: true, message: this.$t('valid.required', [this.$t('desc')]), trigger: ['blur', 'change'] }, ],
            },
            error: {
                file: []
            },
            media: [{
                thumb: "",
                sources: [{
                    src: "",
                    type: ""
                }],
                type: 'video',
                width: '100%',
                height: 'auto',
                autoplay: true
            }]
        }
    },
    computed: {
        // media: function () {
        //     var mmm = []
        //     this.list.forEach(el => {
        //         let obj = {}
        //         if (el.subtag == "movie") {
        //             obj = {
        //                 id: el.id,
        //                 thumb: el.poster,
        //                 sources: [{
        //                     src: el.url,
        //                     type: el.content_type
        //                 }],
        //                 type: 'video',
        //                 width: '100%',
        //                 height: 'auto',
        //                 autolay: false
        //             }
        //         } else {
        //             obj = {
        //                 id: el.id,
        //                 src: el.url
        //             }
        //         }
        //         mmm.push(obj)
        //     });
        //     mmm.push({"src": "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2058354034,4205898833&fm=26&gp=0.jpg"})
        //     return mmm
        // }
    },
    methods: {
        resetInfo() {
            this.info.description_zh = ''
            this.info.description_en = ''
            this.$refs.upload_gallery.clearFiles()
        },
        getFileList(subtag) {
            fileList(this.info.company_id, subtag).then(res => {
                this.list = res.files
            })
        },
        handleTabChange(active_tab) {

        },
        // submit-file-valid
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    let form_s = new FormData()
                    let cnt_file = 0
                    if (this.files1 instanceof FormData) {
                        for (let pp of this.files1.entries()) {
                            cnt_file++
                            form_s.append(pp[0], pp[1])
                        }
                    }
                    if (cnt_file == 0) {
                        this.error.file = [this.$t('valid.required', ['file'])]
                        return
                    }
                    let ob = Object.assign({}, this.info)
                    for (const key in ob) {
                        if (ob.hasOwnProperty(key)) {
                            const el = ob[key];
                            form_s.append(key, el)
                        }
                    }
                    // for(let pp of form_s.entries())   
                    // {
                    //     console.log(pp[0], "--", pp[1])
                    // } 
                    this.$store.dispatch("common/setLoading")
                    fileUpload(form_s).then(res => {
                            this.$notify({
                                title: this.$t('success'),
                                message: this.$t('success.add'),
                                type: 'success'
                            });
                            // this.getFileList(this.info.subtag)
                            this.list = res.files
                            this.resetInfo()
                            this.$refs['dataForm'].resetFields();
                        })
                        .catch(error => {
                            console.log("Api failed!", error)
                            this.error = error
                        })
                        .finally(() => {
                            this.$store.dispatch("common/setLoading", false)
                        })
                } else {
                    return false;
                }
            });
        },
        hSuccess() {
            this.error.file = []
        },
        handleDelete(id) {
            console.log(id)
            this.$confirm(this.$t('confirm.msg_del'), this.$t('warning'), {
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
                fileDel(this.info.company_id, [id]).then(re => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'

                    });
                    let t_index = this.list.findIndex(x => x.id == id)
                    this.list.splice(t_index, 1)
                })
            }).catch(() => {})
            // fileDel(id)
        },
        // video-play
        openGallery(id, ind) {
            // this.media = [{ src: "/images/logo/logo.png" }]
            // this.$refs.lightbox.showImage(0)            
            this.media = [{
                sources: [{
                    src: this.list[ind]['url'],
                    type: this.list[ind]['content_type']
                }],
                type: 'video',
                width: '100%',
                height: 'auto',
                autoplay: true
            }]
            this.video_key = +new Date()
            setTimeout(() => {
                this.$refs.lightbox.showImage(0)
            }, 100)
        },
    },
    mounted() {
        let company_id = this.$store.state.auth.company_id
        this.info.company_id = company_id
        if (company_id) {
            this.getFileList(this.info.subtag)
        }
    }
}
</script>