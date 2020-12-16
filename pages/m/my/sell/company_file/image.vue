<template>
<div class="bg-white p-2">
    <!-- 公司logo -->
    <p>{{$t('company')}}LOGO</p>
    <div class="py-2">
        <ku-upload-avatar :avatar_pre.sync="logo" name="logo" action="/company/updatelogo" auto :data="{company_id}" :rounded="false" size="5rem" />
    </div>
    <ku-line />

    <!-- <p class="mt-2">{{$t('www.banner')}}(VR)</p>
    <div class="py-2">
        <el-upload class="avatar-uploader" action="/" :auto-upload="false" :show-file-list="false" :on-change="hProgress" accept="image/*">
            <div v-if="banner_vr">
                <img :src="banner_vr" class="fit-cover avatar" style="width: 8rem; height:5rem">
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon" style="width:5rem; height:5rem;"></i>
        </el-upload>
    </div>
    <ku-line /> -->

    <p class="mt-2">{{$t('www.banner')}}</p>
    <div class="py-2">
        <ku-upload :filelist='banner' auto :data="{company_id, 'subtag':'banner'}" action="/company/uploadfile" :limit="3" @on-success="hSuccessBanner"></ku-upload>
    </div>
    <ku-line />

    <ku-tab-line :list='tab_items' :activeTab.sync="info.subtag" @change="handleTabChange" class="mt-3"></ku-tab-line>
    <!-- Image Form -->
    <el-form :model="info" ref="dataForm" :rules="rules" label-position="left" label-width="0">
        <div class="pt-3">
            <ku-upload :f_data.sync="files1" @on-success="hGallarySuccess" ref="upload_gallery"></ku-upload>
            <div class="el-form-item__error" v-if="error.file">{{error.file[0]}}</div>
        </div>

        <el-form-item prop="description_zh" class="ku-no-after">
            <p>{{$t('desc.image.zh')}}</p>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" maxlength="500" show-word-limit v-model="info.description_zh" :placeholder="$t('form.say')"></el-input>
        </el-form-item>

        <el-form-item prop="description_en" class="ku-no-after">
            <p>{{$t('desc.image.en')}}</p>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" maxlength="500" show-word-limit v-model="info.description_en" :placeholder="$t('form.say')"></el-input>
        </el-form-item>

    </el-form>
    <div class="text-center">
        <p class="text-dark9 font-08">{{$t('width.recom')}} : 800px</p>
    </div>
    <div class="text-center pt-2 my-2">
        <el-button type="primary" @click="handleSubmit" class="w-75" round="">{{$t('content.submit')}}</el-button>
    </div>

    <!-- already done -->
    <div class="mt-4">
        <p class="my-2">{{$t('uploaded.img', [list.length])}}</p>
        <ku-line />
        <div>
            <card-video-r v-for="(vi, ind) in list" :key='vi.id' :id="vi.id" :title='vi.description[$i18n.locale]' :subTitle="parseTime(vi.created_at, '{y}-{m}-{d} {h}:{i}') " :poster="vi.url" @delete="handleDelete" @show="openGallery(vi.id, ind)" :showPlayIcon=false>
                <p slot="r" class="p-2 text-dark9 font-12" @click="handleToCover(vi.id)"><i :class="company.cover_id == vi.id ? 'el-icon-picture': 'el-icon-picture-outline'"></i></p>
            </card-video-r>
        </div>
        <no-data v-if="!list.length" />
    </div>

    <client-only>
        <light-box ref="lightbox" :showLightBox='false' :media="media" :showThumbs='false' :disableScroll='false'></light-box>
    </client-only>

</div>
</template>

<script>
import { getPromotionHistory } from "@/api/user"
import { fileUpload, fileList, fileDel } from '@/api/file'
import { add, getDetail, getList, setCover } from '@/api/my_company'

export default {
    name: "Company_Image",
    components: {},
    data() {
        return {
            api: process.env.BASE_API_URL,
            tab_items: [
                { id: "image1", name: this.$t('company.img_office') },
                { id: "image2", name: this.$t('company.img_factory') },
                { id: "image3", name: this.$t('company.img_certification') },
            ],
            company: {},
            info: {
                company_id: '',
                description_zh: '',
                description_en: '',
                subtag: 'image1'
            },
            logo: "",
            banner_vr: "",
            files1: {},
            list: [],
            rules: {
                description_zh: [{ required: true, message: this.$t('valid.required', [this.$t('desc')]), trigger: ['blur', 'change'] }, ],
                description_en: [{ required: true, message: this.$t('valid.required', [this.$t('desc')]), trigger: ['blur', 'change'] }, ],
            },
            error: {
                file: []
            }
        }
    },

    computed: {
        company_id: function () {
            return this.$store.state.auth.company_id
        },
        banner: function () {
            let ll = this.gsv(['banner'], this.company)
            if (ll) return ll
            return []
        },
        media: function () {
            var mmm = []
            this.list.forEach(el => {
                mmm.push({
                    src: el.url
                })
            });
            return mmm.length ? mmm : [{}]
        }
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
            // this.resetInfo()
            this.getFileList(active_tab)
        },
        hSuccessLogo(res) {
            if (typeof res == 'object') {
                if (res.hasOwnProperty('company')) this.company.logo = res.company.logo
            }
        },
        hSuccessBanner(res) {
            if (typeof res == 'object') {
                if (res.hasOwnProperty('company')) this.company.banner = res.company.banner
            }
        },
        hGallarySuccess() {
            this.error.file = []
        },
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
                    fileUpload(form_s).then(() => {
                            this.$notify({
                                title: this.$t('success'),
                                message: this.$t('success.add'),
                                type: 'success'
                            });
                            this.getFileList(this.info.subtag)
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
                fileDel(this.company_id, [id]).then(re => {
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
        openGallery(id, ind) {
            console.log(id, ind)
            this.$refs.lightbox.showImage(ind)
        },
        async hProgress(e, file, filelist) {
            this.$store.dispatch("common/setLoading")
            console.log(file, filelist)
            let iii = file.length - 1;
            this.banner_vr = URL.createObjectURL(file[iii].raw)
            const f_vr_id = this.gsv(['banner_vr', 'id'], this.company) || ''
            if (f_vr_id) {

                fileDel(this.company_id, [f_vr_id]).then(() => {

                    var fd = new FormData
                    fd.append('file', file[iii].raw)
                    fd.append('company_id', this.company_id)
                    fd.append('subtag', "banner_vr")

                    fileUpload(fd).then(re => {
                        this.$notify({
                            title: this.$t('success'),
                            message: this.$t('success.msg'),
                            type: 'success'
                        });
                    }).finally(() => {
                        this.$store.dispatch("common/setLoading", false)
                    })
                })
            } else {
                var fd = new FormData
                fd.append('file', file[iii].raw)
                fd.append('company_id', this.company_id)
                fd.append('subtag', "banner_vr")

                fileUpload(fd).then(re => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.msg'),
                        type: 'success'
                    });
                }).finally(() => {
                    this.$store.dispatch("common/setLoading", false)
                })
            }

        },
        handleToCover(id){
            if(id!=this.company.cover_id){
                setCover(this.$store.state.auth.company_id, id).then(()=>{
                    this.company.cover_id = id
                })
            }
        }
    },
    mounted() {
        getList().then(res => {
            this.company = res.company
            this.logo = this.gsv(['logo', 'url'], res.company) || ''
            this.banner_vr = this.gsv(['banner_vr', 'url'], this.company) || ''
        })
        let company_id = this.$store.state.auth.company_id
        this.info.company_id = company_id
        console.log(company_id, '--company_id--', this.info.subtag)
        if (company_id) {
            this.getFileList(this.info.subtag)
        }
    }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    text-align: center;
    border: 1px dashed #8C939D;
    border-radius: 0.3rem;
    line-height: 2.4
}
</style>
