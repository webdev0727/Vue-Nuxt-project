<template>
<div>  
    <el-upload action="#" list-type="picture-card" 
    ref="upload"
    :auto-upload="false" 
    accept="video/*"
    class="ku-upload-video"
    :class="{hiddenUploadBtn}" 
    :on-change="hProgress" 
    :on-remove="handleRemove"
    :before-remove="handleDelConfirm"
    :file-list="file_pre.url ? [file_pre] : []"
    :multiple="limit == 1 ? false : true" :limit="limit">
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{file}">
            <video  class="el-upload-list__item-thumbnail fit-cover avatar" width="100" height="70" :style="getStyle" >
                <source :src="file.url">
            </video>
            <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handleVideoPlay0(file)">
                    <i class="el-icon-zoom-in"></i>
                </span>                
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                    <i class="el-icon-delete"></i>
                </span>
            </span>
        </div>
    </el-upload>

    <client-only>
        <light-box ref="lightbox" :showLightBox='false' :media="media" :showThumbs='false' :disableScroll='false' :key="media_key"></light-box>
    </client-only>
    
</div>
</template>

<script>
// ku-upload
import api from '@/utils/request'
import { fileDel, assetDel } from '@/api/file'
export default {
    name: "KuUploadVideo",
    components: {},
    props: {
        f_data: {},
        name: {
            type: String,
            default: 'avatar'
        },
        file_pre: {
            type: Object
        },
        auto: {
            type: Boolean,
            default: false
        },
        rounded: {
            type: Boolean,
            default: true
        },
        action: {
            type: [String, Number]
        },
        data: {
            type: Object,
            default: function () {
                return {}
            }
        },
        size: {
            type: String,
            default: '5rem'
        },
        width: {
            type: [Number, String, Boolean],
            default: '6rem'
        },
        limit: {
            type: [Number],
            default: 1
        },
    },
    data() {
        return {
            v_src: this.file_pre,
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            media: [{
                thumb: "",
                sources: [{
                    src: "",
                    type: ''
                }],
                type: 'video',
                width: '100%',
                height: 'auto',
                autoplay: true
            }],
            media_key: +new Date()
        }
    },
    computed: {
        getStyle: function () {
            const w_ = this.width || this.size
            return {
                width: w_,
                height: this.size
            }
        },
        hiddenUploadBtn: function(){
            if (this.limit == 1 && this.v_src.url) return true
            else return false
        }
    },

    methods: {
        hProgress(e, file, filelist) {
            console.log(file, filelist)
            let iii = file.length - 1;
            let url = URL.createObjectURL(file[iii].raw)
            this.v_src = file[0]
            const kk = Object.assign({}, this.v_src)
            this.$emit('update:file_pre', kk)

            var fd = new FormData
            fd.append(this.name, file[iii].raw)
            this.$emit('update:f_data', fd)
            this.$emit('on-success', "success")
        },
        handleDelConfirm(file) {
            return this.$confirm(this.$t('confirm.msg_del'), this.$t('warning'), {
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
            })
        },
        handleRemove(file) {
            this.$confirm(this.$t('confirm.msg_del'), this.$t('warning'), {
                confirmButtonText: this.$t('confirm.ok'),
                cancelButtonText: this.$t('confirm.cancle'),
                showClose: false,                
                showCancelButton: true,
                confirmButtonClass: 'text-danger',
                cancelButtonClass: 'border-right',
                customClass: 'ku-confirm',
                dangerouslyUseHTMLString: true,
                center: true,
            }).then(()=>{
                if (file.id){
                    assetDel(file.id).then(re => {                        
                        this.$emit('on-success', re)
                    })
                }
                this.$refs.upload.clearFiles()
                this.v_src = {}
                this.$emit('update:f_data', '')
                this.$emit('update:file_pre', {})
            })

        },       
        handleVideoPlay0(file) {
            console.log(file)
            this.media[0]['sources'][0]["src"] = file.url
            this.media[0]['sources'][0]["type"] = file['content_type']
            this.media_key = +new Date()
            setTimeout(() => {
                this.$refs.lightbox.showImage(0)
            }, 100)
        },
      
    },
    watch: {
        f_data(newValue) {
            if (!newValue)
                this.v_src = {}
        },
        file_pre(newValue) {
            this.v_src = newValue
        },
    },    
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
}
</style>
