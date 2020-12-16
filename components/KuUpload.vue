<template>
<div>
    <el-upload ref="upload" multiple action="/" :list-type="listType" :on-preview="handlePicturePreview" :auto-upload="false" :on-change="hProgress" :before-remove="handleDelConfirm" :on-remove="hRemove" :accept="accept" :limit="limit" :file-list="filelist" :class="{trigger: hasTrigger}">
        <template slot='trigger' v-if="cIcon==''">
            <slot name="trigger"></slot>
        </template>
        <i :class="cIcon" v-else></i>
    </el-upload>
    <client-only>
        <light-box ref="lightbox" :showLightBox='false' :media="media" :showThumbs='false' :disableScroll='false'></light-box>
    </client-only>
    <!-- copy -->
    <!-- <div class="image-upload" v-for="(img,i) in upload_imgs" :key="i">
        <img :src="img" alt />
    </div>

    <input type="file" @change="uploadImage($event)" accept="image/*" /> -->
    <!-- copy end -->
</div>
</template>

<script>
// ku-upload
import api from '@/utils/request'
import { fileDel } from '@/api/file'
export default {
    name: "KuUpload",
    components: {},
    props: {
        f_data: {},
        accept: {
            type: String,
            default: 'image/*'
        },
        listType: {
            type: String,
            default: 'picture-card'
        },
        limit: {
            type: Number,
            default: 1
        },
        name: {
            type: String,
            default: 'file'
        },
        filelist: {
            type: Array,
            default: function () {
                return []
            }
        },
        auto: {
            type: Boolean,
            default: false
        },
        action: {
            type: [String, Number]
        },
        data: {
            type: Object,
            default: function () {
                return {}
            }
        }

    },
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            media: [{ src: '' }]
        }
    },
    computed: {
        hasTrigger: function () {
            return !!this.$slots['trigger']
        },
        cIcon: function () {
            if (!!this.$slots['trigger']) return ''
            if (this.accept.indexOf('image') != -1) {
                return "el-icon-plus"
            } else {
                return "el-icon-video-camera-solid"
            }
        }
    },

    methods: {
        hProgress(e, file, filelist) {
            console.log(file, filelist)
            let f_key = this.name
            var fd = new FormData
            file.forEach(el => {
                // console.log(el.raw)
                fd.append(f_key, el.raw)
            });
            let ob = this.data
            for (const key in ob) {
                if (ob.hasOwnProperty(key)) {
                    const el = ob[key];
                    fd.append(key, el)
                }
            }
            // console.log(fd)
            if (this.auto) {
                api({
                    url: this.action,
                    method: 'POST',
                    data: fd
                }).then(re => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.msg'),
                        type: 'success'
                    });
                    this.$emit('on-success', re)
                })
            } else {
                this.$emit('update:f_data', fd)
                this.$emit('on-success', "success")
            }
        },
        handlePicturePreview(file) {
            this.media[0]['src'] = file.url
            this.$refs.lightbox.showImage(0)
        },
        handleDelConfirm(file) {
            return this.$confirm(this.$t('confirm.msg_del'), this.$t('warning'), {
                confirmButtonText: this.$t('confirm.ok'),
                cancelButtonText: this.$t('confirm.cancle'),
                showClose: false,                
                showCancelButton: true,
                confirmButtonClass: 'text-danger',
                cancelButtonClass: 'border-right',
                customClass: 'ku-confirm',
                dangerouslyUseHTMLString: true,
                center: true,
            })
        },
        hRemove(file) {
            // console.log("rrrrevomed", file)
            let del_id = file.id
            let company_id = file.source_id
            if (!del_id || !company_id) return
            // console.log(del_da)
            fileDel(company_id, [del_id]).then(re => {
                this.$notify({
                    title: this.$t('success'),
                    message: this.$t('success.del'),
                    type: 'success'
                });
                this.$emit('on-success', re)
            })
        },
        clearFiles() {
            this.$refs.upload.clearFiles()
        },
        calLimitAndAddBtnHidden() {
            const dom = document.querySelector("div.el-upload.el-upload--picture-card")
            if (dom){
                if (this.filelist.length >= this.limit) {
                        dom.setAttribute('style', "display: none;")
                }else{
                    dom.setAttribute('style', "")
                }
            }
        }
        // uploadImage(event) {
        //     const target = event.target || event.srcElement;
        //     if (target.files && target.files[0]) {
        //         var url = target.value;
        //         var ext = url.substring(url.lastIndexOf(".") + 1).toLowerCase();
        //         if (["png", "jpg", "svg"].includes(ext)) {                    
        //             this.upload_img_formData.append("files[]", target.files[0]);
        //             var reader = new FileReader();
        //             var _that = this;
        //             reader.onload = function (e) {
        //                 _that.upload_imgs.push(e.target.result);
        //             };
        //             reader.readAsDataURL(target.files[0]);
        //         }
        //     }
        // }
    },
    mounted() {
        this.calLimitAndAddBtnHidden()
    },
    watch: {
        filelist(newValue) {
            this.calLimitAndAddBtnHidden()
        }
    },
}
</script>

<style scoped>
.trigger {
    flex: 1;
    display: flex;
    flex-flow: row-reverse;
}
</style>
