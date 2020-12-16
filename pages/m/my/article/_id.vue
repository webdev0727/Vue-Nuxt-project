<template>
<div>
    <kuc-page-header :title="$t('article.post')" class="border-bottom">
        <nuxt-link to='/my/article' class="text-danger">{{$t('article.my_draft')}}</nuxt-link>
    </kuc-page-header>

    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0">
        <div class="bg-white px-2">
            <!-- title -->
            <el-form-item prop="title">
                <el-input v-model="info.title" :placeholder="$t('form.input_t')">
                </el-input>
            </el-form-item>

            <!-- content -->
            <!-- <el-form-item prop="content" class="ku-no-after mt-2">
                <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 15}" maxlength="500" show-word-limit v-model="info.content" placeholder="请输入正文"></el-input>
            </el-form-item> -->
            
            <ku-editor-html v-model="info.content" title="content.i" key="content" class="my-2"/>            
            <el-form-item class="ku-only-valid ku-no-after" prop="content">
                <el-input v-model="info.content" type="hidden"></el-input> 
            </el-form-item>

        </div>

        <div class="bg-white p-2 mt-2">
            <div class="checkbox-button-container-rec my-1">
                <el-checkbox-group v-model="info.tag_ids" class="d-flex flex-wrap justify-content-between">
                    <el-checkbox-button v-for="item in news_tag" :label="item.id" :key="item.name[$i18n.locale]">{{item.name[$i18n.locale]}}</el-checkbox-button>
                </el-checkbox-group>

                <!-- <el-radio-group v-model="info.checked0" size="medium" class="radio-button-container">
                    <el-radio-button v-for="item in news_tag" :key="item.id" :label="item.name[$i18n.locale]">{{item.name[$i18n.locale]}}</el-radio-button>
                </el-radio-group> -->
            </div>
            <ku-line />
            
            <div class="align-items-center py-1 d-flex">
                <p class="text-nowrap mr-2">{{$t('article.creative_work')}}</p>
                <el-select v-model="info.is_original" :placeholder="$t('select')" class="w-100 text-right" key="Yes_No">
                    <el-option :label="$t('status.yes')" :value="1"></el-option>
                    <el-option :label="$t('status.no')" :value="0"></el-option>
                </el-select>
            </div>
            <ku-line />

            <div class="align-items-center py-1 d-flex">
                <p class="text-nowrap mr-2">{{$t('cate.select')}}</p>
                <el-select v-model="info.category_id" :placeholder="$t('select')" class="w-100 text-right" key="dialogVisible">
                    <el-option v-for="item in cate_postable" :key="'setting_'+ item.id" :label="gsv([$i18n.locale], item.name)" :value="item.id"></el-option>
                </el-select>
            </div>
            <el-form-item prop="category_id" class="p-0"></el-form-item> 

            <div class="py-2">
                <p class="mb-2">{{$t('article.cover')}}</p>
                <ku-upload :f_data.sync="files1" name="covers[]" ref="upload_gallery" :limit=3 :filelist='pre_img' />
            </div>

        </div>
    </el-form>
    <div class="text-center py-4">
        <p class="text-dark6">{{$t('moving.help')}}</p>
        <el-row :gutter="20" class="p-4">
            <el-col :span="12">
                <el-button type="primary" @click="handleSubmit(1)" round class="w-100">{{$t('submit.check')}}</el-button>
            </el-col>
            <el-col :span="12">
                <el-button type="primary" @click="handleSubmit(0)" round plain class="w-100">{{$t('save_draft')}}</el-button>
            </el-col>
        </el-row>
    </div>    

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import KuEditorHtml from "@/components/KuEditorHtml"
import { add, getDetail } from '@/api/discovery'
export default {
    middleware: ['authenticated', 'member_writer'],
    name: "NewPost",
    components: { KuEditorHtml },
    head() {
        return {
            title: this.$t('article.post')
        }
    },
    data() {
        return {
            info: {
                id: this.$route.params.id == 'new' ? '' : this.$route.params.id,
                title: "",
                content: "",
                is_original: 1,
                tag_ids: [],
                category_id: "",
            },
            files1: {},
            pre_img: [],
            rules: {
                title: [{ required: true, message: this.$t('valid.required', [this.$t('title')]), trigger: ['blur', 'change'] },
                    { min: 2, max: 50, message: this.$t('valid.between.string', [this.$t('title'), 2, 50]), trigger: ['blur', 'change'] },

                ],
                content: [{ required: true, message: this.$t('valid.required', [this.$t('content.i')]), trigger: ['blur', 'change'] },
                    { min: 5, message: this.$t('valid.min.string', [this.$t('content.i'), 5]), trigger: ['blur', 'change'] },
                ],
                category_id: [{ required: true, message: this.$t('valid.required', [this.$t('category')]), trigger: ['blur', 'change'] }]
            },  
            dlg_key : "slslkdf"                     
        }
    },
    computed: {
        ...mapState("common", {
            "news_tag": state => state.list.news_tag,
        }),
        ...mapGetters("common", ['cate_postable'])
    },
    methods: {
        ...mapActions("common", ['getUnitsList']),
        resetInfo() {
            this.info = {
                title: "",
                content: "",
                is_original: 1,
                tag_ids: [],
                category_id: "",
            }
            this.files1 = {}
            this.pre_img = []
            this.$refs.upload_gallery.clearFiles()
            this.dlg_key = +new Date()
        },        
        validate(){
            this.$refs['dataForm'].validate();
        },
        handleSubmit(status) {
            this.$refs['dataForm'].validate((valid) => {
                let form_s = new FormData()
                form_s.append('tag', "article")
                let cnt_file = 0
                if (this.files1 instanceof FormData) {
                    for (let pp of this.files1.entries()) {
                        cnt_file++
                        form_s.append(pp[0], pp[1])
                    }
                }
                // if (cnt_file == 0) {
                //     this.error.file = [this.$t('valid.required', ['file'])]
                //     return
                // }
                if (valid) {
                    let ob = Object.assign({}, this.info)
                    if (!ob.id) delete ob.id
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
                    form_s.append("status", status)
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
        if (!this.cate_postable.length || !this.news_tag) {
            this.getUnitsList(["newscategories", "news_tag"])
        }
        if (this.$route.params.id != 'new') {
            getDetail(this.$route.params.id).then(res => {
                if (res.item){
                    console.log(res.item)
                    this.info.title = res.item.title
                    this.info.content = res.item.content
                    this.info.category_id = res.item.category_id
                    this.info.is_original = res.item.is_original,
                    this.pre_img = res.item.covers
                }
            }).catch(()=>{
                this.$router.replace({path: "/my/article"})
            })
        }
    }
}
</script>