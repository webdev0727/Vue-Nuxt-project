<template>
<div class="bg-white py-2 pl-2">
    <p class="text-dark9 pr-2">{{$t('msg.expo_you_can_media')}}</p>
    <ku-tab-line :list='tab_items' :activeTab.sync="activeTab" @change="handleTabChange" class=" border-bottom"></ku-tab-line>
    <div class="pr-2 mt-2">
        <!-- cate -->
        <div class="py-input">
            <dlg-select :title="$t('expo.sel')" :checked.sync="activeExpo" :list="myExpoListOfHistory" :placeholder="$t('expo.name')" @change="changeExpo" />
        </div>
        <ku-line />

        <el-form :model="info" ref="dataForm" :rules="rules" label-position="left" label-width="0">
            <!-- 视频路径 -->
            <p class="mt-3">{{activeTab=='video' ? $t('upload.video_path'): $t('upload.image_path')}}</p>
            <div class="">
                <ku-upload v-if="activeTab=='video'" :f_data.sync="info.file" ref="upload_gallery" class="upload-container" :accept="activeTab+'/*'" :limit=1 list-type="text">
                    <el-button slot="trigger" type="primary">{{$t('upload.i')}}</el-button>
                </ku-upload>
                <ku-upload-avatar v-else name="file" :f_data.sync="info.file" :rounded="false" size="6rem" />
                <el-form-item class="ku-only-valid ku-no-after" prop="file">
                    <el-input v-model="info.file" type="hidden"></el-input> 
                </el-form-item>
            </div>

            <el-form-item prop="description_zh" class="ku-no-after">
                <p>{{activeTab=='video' ? $t('desc.video.zh'): $t('desc.image.zh')}}</p>
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" maxlength="500" show-word-limit v-model="info.description_zh" :placeholder="$t('form.say')"></el-input>
            </el-form-item>

            <el-form-item prop="description_en" class="ku-no-after">
                <p>{{activeTab=='video' ? $t('desc.video.en'): $t('desc.image.en')}}</p>
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" maxlength="500" show-word-limit v-model="info.description_en" :placeholder="$t('form.say')"></el-input>
            </el-form-item>

        </el-form>

        <div class="text-center pt-2 my-2">
            <el-button type="primary" @click="handleSubmit" class="w-75" round="" :disabled="!activeExpo">{{$t('content.submit')}}</el-button>
        </div>

        <!-- already done -->
        <div class="mt-4">
            <p class="my-2" v-if="activeTab=='video'">{{$t('upload.video_done', [this.list.length])}}</p>
            <p class="my-2" v-if="activeTab=='image'">{{$t('upload.image_done', [this.list.length])}}</p>
            <ku-line />
            <div>
                <!-- :title='gsv([$i18n.locale], item.description)' -->
                <card-video-r v-for="(item, ind) in list" :key='item.id' :id="item.id" :title='gsv([$i18n.locale], item.description)' :subTitle="parseTime(item.created_at)" :poster="isImage(item.content_type) ? item.url : item.poster" :showPlayIcon="!isImage(item.content_type)" @delete="handleDelete" @show="handleVideoPlay(ind)"> </card-video-r>
                <ku-loading-no-data :active="isLoading" :total="list.length" />
            </div>
        </div>

    </div>

    <client-only>
        <light-box ref="lightbox" :showLightBox='false' :media="media" :showThumbs='false' :disableScroll='false' :key='media_key'></light-box>
    </client-only>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getPromotionHistory } from "@/api/user"
import { AddMyExpoHistory, GetMyExpoHistory, DelMyExpoHistory } from "@/api/expo"

export default {
    name: "Participate_History",
    components: {},
    data() {
        return {
            isLoading: false,
            activeExpo: '',
            tab_items: [
                { id: 'video', name: this.$t('upload.video') },
                { id: 'image', name: this.$t('upload.image') }
            ],
            activeTab: "video",
            promotion_history: [],
            info: {
                description_zh: "",
                description_en: "",
                file: ''
            },
            media: [{}],
            media_key: "media_key",
            list: [],
            rules: {
                description_zh: [{ required: true, message: this.$t('valid.required', [this.$t('desc')]), trigger: ['blur', 'change'] }, ],
                description_en: [{ required: true, message: this.$t('valid.required', [this.$t('desc')]), trigger: ['blur', 'change'] }, ],
                file: [{ required: true, message: this.$t('valid.required', [this.$t('upload.file')]), trigger: ['blur', 'change'] }, ],
            },
            listQuery: {
                page: 1,
                limit: 10
            }
        }
    },
    computed: {
        ...mapGetters('expo', ['myExpoListOfHistory'])
    },
    methods: {
        ...mapActions('expo', ['getMyExpoList']),
        getList() {
            if (this.activeExpo) {
                this.isLoading = true
                GetMyExpoHistory(this.activeExpo, this.activeTab, this.listQuery).then(re => {
                    this.list = re.items
                    let mmm = []
                    this.list.forEach(element => {
                        if (this.isImage(element.content_type)) {
                            mmm.push({
                                src: element.url
                            })
                        } else {
                            mmm.push({
                                sources: [{
                                    src: element.url,
                                    type: element.content_type
                                }],
                                type: 'video',
                                width: '100%',
                                height: 'auto',
                                autoplay: true
                            })

                        }
                    })
                    this.media = mmm.length ? mmm : [{}]
                    this.media_key = +new Date()
                }).finally(() => {
                    this.isLoading = false
                });
            }
        },
        changeExpo() {
            this.activeTab = "video"
            this.list = []
            this.getList()
        },
        handleTabChange(active_tab) {
            this.list = []
            this.getList()
        },
        handleDelete(id) {
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
                DelMyExpoHistory(this.activeExpo, this.activeTab, id).then(() => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'
                    });
                    const iii = this.list.findIndex(rr => rr.id == id)
                    this.list.splice(iii, 1)
                    // this.getList()
                })
            }).catch(() => {})

        },
        handleVideoPlay(ind) {
            // console.log(id)
            // this.media[0]['src'] = img.src
            this.$refs.lightbox.showImage(ind)
        },
        resetInfo() {
            this.info = {
                description_zh: "",
                description_en: "",
                file: ''
            }
        },
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    let form_s = new FormData()
                    if (this.info.file instanceof FormData) {
                        for (let pp of this.info.file.entries()) {
                            form_s.append(pp[0], pp[1])
                        }
                    }
                    let ob = Object.assign({}, this.info)
                    delete ob.file
                    for (const key in ob) {
                        if (ob.hasOwnProperty(key)) {
                            const el = ob[key];
                            form_s.append(key, el)
                        }
                    }
                    this.$store.dispatch("common/setLoading")
                    AddMyExpoHistory(this.activeExpo, this.activeTab, form_s).then(res => {
                            this.$notify({
                                title: this.$t('success'),
                                message: this.$t('success.add'),
                                type: 'success'
                            });
                            this.getList()
                            this.resetInfo()
                            this.$refs['dataForm'].resetFields();
                        })
                        .catch(error => {})
                        .finally(() => {
                            this.$store.dispatch("common/setLoading", false)
                        })
                } else {
                    return false;
                }
            });
        },
    },
    mounted() {
        if (!this.myExpoListOfHistory.length) {
            this.getMyExpoList().then(() => {
                this.activeExpo = this.myExpoListOfHistory[0]['id']
                this.getList()
            })
        } else {
            this.activeExpo = this.myExpoListOfHistory[0]['id']
            this.getList()
        }
    }
}
</script>
