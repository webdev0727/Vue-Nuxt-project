<template>
<div>
    <kuc-page-header :title="$t('moving.post')" to="/my/sell/company_news"></kuc-page-header>
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" class="bg-white px-2 mt-2">

        <el-form-item prop="title" class="ku-no-after">
            <el-input v-model="info.title" :placeholder="$t('form.input_t')">
            </el-input>
        </el-form-item>

        <ku-editor-html v-model="info.content" title="content.i" key="content" class="my-2" />
        <el-form-item class="ku-only-valid ku-no-after" prop="content">
            <el-input v-model="info.content" type="hidden"></el-input>
        </el-form-item>

    </el-form>
    <div class="mt-2 bg-white p-2">

        <div class="checkbox-button-container-rec my-1">
            <el-checkbox-group v-model="info.tag_ids" class="d-flex flex-wrap justify-content-between">
                <el-checkbox-button v-for="item in news_tag" :label="item.id" :key="item.name[$i18n.locale]">{{item.name[$i18n.locale]}}</el-checkbox-button>
            </el-checkbox-group>            
        </div>
        <ku-line />

        <p class="my-2">{{$t('article.cover')}}</p>
        <div class="pt-3">
            <ku-upload :f_data.sync="files1" name="covers[]" :limit=3 ref="upload_gallery" :filelist='pre_img' />
            <div class="el-form-item__error" v-if="error.file">{{error.file[0]}}</div>
        </div>

    </div>
    <p class="mt-3 mb-4 text-center text-dark6">{{$t('msg.company_news')}}</p>
    <div class="text-center">
        <el-button type="primary" round class="w-75" @click="handleSubmit">{{$t('post.now')}}</el-button>
    </div>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import KuEditorHtml from "@/components/KuEditorHtml"

import { statusAdd } from "~/api/my_company"
import { add } from '@/api/discovery'
export default {
    components: { KuEditorHtml },
    data() {
        return {
            info: {
                company_id: this.$store.state.auth.company_id,
                title: "",
                content: "",
                tag_ids: [],
                // category_id: 11,
                tag: 'discover',
                subtag: 'industry_news',
                status: 2
            },
            files1: {},
            pre_img: [],
            rules: {
                title: [{ required: true, message: this.$t('valid.required', [this.$t('title')]), trigger: ['blur', 'change'] },
                    { min: 2, max: 30, message: this.$t('valid.between.string', [this.$t('title'), 2, 30]), trigger: ['blur', 'change'] },

                ],
                content: [{ required: true, message: this.$t('valid.required', [this.$t('content.i')]), trigger: ['blur', 'change'] }, ],
            },
            error: {
                file: []
            }
        }
    },
    computed: {
        ...mapState("common", {
            "news_tag": state => state.list.news_tag,
        }),
    },
    methods: {
        ...mapActions("common", ['getUnitsList']),
        
        resetInfo() {
            this.info.title = ''
            this.info.content = ''
            this.info.tag_ids = []
            this.pre_img = []
            this.$refs.upload_gallery.clearFiles()
        },
        // submit-file-valid
        hSuccess() {
            this.error.file = []
        },
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                let form_s = new FormData()
                let cnt_file = 0
                if (this.files1 instanceof FormData) {
                    for (let pp of this.files1.entries()) {
                        cnt_file++
                        form_s.append(pp[0], pp[1])
                    }
                }
                if (cnt_file == 0) {
                    this.error.file = [this.$t('valid.required', [this.$t('upload.file')])]
                    return
                }
                if (valid) {
                    let ob = Object.assign({}, this.info)
                    delete ob.tag_ids
                    for (const key in ob) {
                        if (ob.hasOwnProperty(key)) {
                            const el = ob[key];
                            form_s.append(key, el)
                        }
                    }
                    this.info.tag_ids.forEach(el => {
                        form_s.append("tag_ids[]", el)
                    });
                    // for(let pp of form_s.entries())   
                    // {
                    //     console.log(pp[0], "--", pp[1])
                    // } 
                    this.$store.dispatch("common/setLoading")
                    add(form_s).then(() => {
                            this.$notify({
                                title: this.$t('success'),
                                message: this.$t('success.add'),
                                type: 'success'
                            });
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
    },
    mounted() {
        if (!this.news_tag.length) {
            this.getUnitsList(["news_tag"])
        }
        // if (this.$route.params.id != 'new') {
        //     getDetail(this.$route.params.id).then(res => {
        //         if (res.item){
        //             console.log(res.item)
        //             this.info.title = res.item.title
        //             this.info.content = res.item.content
        //             this.info.category_id = res.item.category_id
        //             this.info.is_original = res.item.is_original,
        //             this.pre_img = res.item.covers
        //         }
        //     }).catch(()=>{
        //         this.$router.replace({path: "/my/article"})
        //     })
        // }
    }
}
</script>

<style>

</style>
