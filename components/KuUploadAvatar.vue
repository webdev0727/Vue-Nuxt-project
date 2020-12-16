<template>
<div>
    <el-upload class="avatar-uploader" action="/" :auto-upload="false" :show-file-list="false" :on-change="hProgress" accept="image/*">
        <img v-if="img_src" :src="img_src" class="fit-cover avatar" :style="getStyle" :class="{'rounded-circle': rounded}">
        <i v-else class="el-icon-plus avatar-uploader-icon" :style="`width:${size}; height:${size}; line-height: ${size};`"></i>
    </el-upload>
</div>
</template>

<script>
// ku-upload
import api from '@/utils/request'
import { fileDel } from '@/api/file'
export default {
    name: "KuUploadAvatar",
    components: {},
    props: {
        f_data: {},
        name: {
            type: String,
            default: 'avatar'
        },
        avatar_pre: {
            type: String
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
            default: '4rem'
        },
        width: {
            type: [Number, String, Boolean],
            default: false
        },
    },
    data() {
        return {
            img_src: this.avatar_pre
        }
    },
    computed: {
        getStyle: function () {
            const w_ = this.width || this.size
            return {
                width: w_,
                height: this.size
            }
        }
    },

    methods: {
        hProgress(e, file, filelist) {
            console.log(file, filelist)
            let iii = file.length - 1;
            let avatar_pre = URL.createObjectURL(file[iii].raw)
            this.img_src = avatar_pre
            this.$emit('update:avatar_pre', avatar_pre)

            var fd = new FormData
            fd.append(this.name, file[iii].raw)
            if (this.auto) {
                let ob = this.data
                for (const key in ob) {
                    if (ob.hasOwnProperty(key)) {
                        fd.append(key, ob[key])
                    }
                }
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
        }
    },
    watch: {
        f_data(newValue) {
            if (!newValue)
             this.img_src = ''
        },
        avatar_pre(newValue) {
            this.img_src = newValue
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
