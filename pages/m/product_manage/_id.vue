<template>
<div class="mt-2">
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" class="bg-white p-2">

        <el-form-item prop="serial">
            <el-input v-model="info.serial" class="text-right" placeholder="12356789">
                <template slot="prepend">{{$t('product')}}{{$t('sn')}}</template>
            </el-input>
        </el-form-item>

        <el-form-item prop="name_zh">
            <el-input v-model="info.name_zh" class="text-right" placeholder="王希孟">
                <template slot="prepend">{{$t('product')}}{{$t('title')}}（{{$t('lang.zh')}}）</template>
            </el-input>
        </el-form-item>

        <!-- 真实姓名（英文） prop="name_en" -->
        <el-form-item prop="name_en">
            <el-input v-model="info.name_en" class="text-right" placeholder="Real Name">
                <template slot="prepend">{{$t('product')}}{{$t('title')}}（{{$t('lang.en')}}）</template>
            </el-input>
        </el-form-item>

        <div class="align-items-center py-1 d-flex">
            <p class="text-nowrap mr-2">{{$t('expo.goods')}}（{{$t('lang.zh')}}）</p>
            <el-cascader v-model="selected_cate" :options="cate3" :props="cate1_props" clearable class="flex-1" @change="hChangeCate"></el-cascader>
        </div>
        <div class="el-form-item__error" v-if="error.cate1">{{error.cate1[0]}}</div>
        <ku-line />
        <!-- 自定义分类  -->
        <!-- <div class="py-input">
            <dlg-select :title="$t('cate.custom')" :checked.sync="info.custom_category_id" :list="category_me" />
        </div> -->
        <div class="align-items-center py-1 d-flex">
            <p class="text-nowrap mr-2">{{$t('cate.custom')}}</p>
            <el-select v-model="info.custom_category_id" :placeholder="$t('select')" class="w-100 text-right" >
                <el-option v-for="item in category_me" :key="'setting_'+ item.id" :label="gsv([$i18n.locale], item.name)" :value="item.id"></el-option>
            </el-select>
        </div>
        <ku-line />
        <!--  keywords -->
        <div class="d-flex">
            <p class="text-nowrap pr-2 py-input">{{$t("keyword")}}（{{$t('lang.zh')}}）</p>
            <div class="flex-1">
                <div v-for="ii in keywords.zh.length" :key="ii">
                    <div class="d-flex align-items-center" :class="{'border-bottom': ii!=keywords.zh.length}">
                        <el-input v-model="keywords.zh[ii-1]" :placeholder="$t('keyword')">
                        </el-input>
                        <p class="text-nowrap py-input text-danger" v-if="ii==keywords.zh.length" @click="handleAddSingup('zh', ii)">{{$t("add")}}</p>
                        <p class="text-nowrap py-input text-danger" v-else @click="handleRemoveSingup('zh', ii-1)">
                            <i class="el-icon-close"></i>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <ku-line />

        <div class="d-flex">
            <p class="text-nowrap pr-2 py-input">{{$t("keyword")}}（{{$t('lang.en')}}）</p>
            <div class="flex-1">
                <div v-for="ii in keywords.en.length" :key="ii">
                    <div class="d-flex align-items-center" :class="{'border-bottom': ii!=keywords.en.length}">
                        <el-input v-model="keywords.en[ii-1]" :placeholder="$t('keyword')">
                        </el-input>
                        <p class="text-nowrap py-input text-danger" v-if="ii==keywords.en.length" @click="handleAddSingup('en', ii)">{{$t("add")}}</p>
                        <p class="text-nowrap py-input text-danger" v-else @click="handleRemoveSingup('en', ii-1)">
                            <i class="el-icon-close"></i>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <ku-line />

        <!-- 品牌  -->
        <el-form-item label="">
            <el-input v-model="info.brand_zh" class="text-right" :placeholder="$t('form.input')">
                <template slot="prepend">{{$t('brand')}}（{{$t('lang.zh')}}）</template>
            </el-input>
        </el-form-item>

        <el-form-item label="">
            <el-input v-model="info.brand_en" class="text-right" :placeholder="$t('form.input')">
                <template slot="prepend">{{$t('brand')}}（{{$t('lang.en')}}）</template>
            </el-input>
        </el-form-item>

        <!-- 产品单位  -->
        <div class="align-items-center py-1 d-flex">
            <p class="text-nowrap mr-2">{{$t('product')}} {{$t('unit')}}</p>
            <el-select v-model="info.unit_id" :placeholder="$t('select')" class="w-100 text-right">
                <el-option v-for="item in units_product" :key="item.id" :label="gsv([$i18n.locale], item.name)" :value="item.id"></el-option>
            </el-select>
        </div>
        <ku-line />

        <el-form-item prop="price">
            <el-input v-model.number="info.price" class="text-right" :placeholder="$t('form.input')" type="number">
                <template slot="prepend">{{$t('product')}}{{$t('price')}}</template>
                <template slot="append"><span>元/{{unit_txt}}</span></template>
            </el-input>
        </el-form-item>

        <!-- 最小起订量 -->
        <el-form-item prop="min_quantity">
            <el-input v-model.number="info.min_quantity" class="text-right" :placeholder="$t('form.input')" type="number">
                <template slot="prepend">{{$t('moq')}}</template>
            </el-input>
        </el-form-item>

        <div class="align-items-center py-1 d-flex">
            <p class="text-nowrap mr-2">{{$t('is.pindan')}}</p>
            <el-select v-model="info.is_pindan" :placeholder="$t('select')" class="w-100 text-right" key="Pindan">
                <el-option :label="$t('status.yes')" :value="1"></el-option>
                <el-option :label="$t('status.no')" :value="0"></el-option>
            </el-select>
        </div>
        <ku-line />

        <div class="align-items-center py-1 d-flex">
            <p class="text-nowrap mr-2">{{$t('is.is_only_buyer')}}</p>
            <el-select v-model="info.is_only_buyer" :placeholder="$t('select')" class="w-100 text-right" key="Yes_No">
                <el-option :label="$t('status.yes')" :value="1"></el-option>
                <el-option :label="$t('status.no')" :value="0"></el-option>
            </el-select>
        </div>
        <ku-line />

        <el-form-item prop="max_pindan">
            <el-input v-model.number="info.max_pindan" class="text-right" :placeholder="$t('form.input')" type="number">
                <template slot="prepend">{{$t('pin_count')}}</template>
                <template slot="append"><span>{{$t('users')}}</span></template>
            </el-input>
        </el-form-item>

        <!-- description -->
        <p class="mt-3">{{$t('description')}}（{{$t('lang.zh')}}）</p>
        <ku-editor-html v-model="info.description_zh" key="zh" />
        <el-form-item class="ku-only-valid" prop="description_zh">
            <el-input v-model="info.description_zh" type="hidden"></el-input>
        </el-form-item>

        <p class="mt-2">{{$t('description')}}（{{$t('lang.en')}}）</p>
        <ku-editor-html v-model="info.description_en" key="en" />
        <el-form-item class="ku-only-valid" prop="description_en">
            <el-input v-model="info.description_en" type="hidden"></el-input>
        </el-form-item>

        <p class="mt-3">{{$t('product')}}{{$t('video')}}</p>
        <div class="py-2 d-flex align-items-center justify-content-center">
            <ku-upload-video :f_data.sync="video_data" name="videos[]" :file_pre.sync='pre_video' />
            <el-input v-model="info.video_caption" :placeholder="$t('form.input')"></el-input>
        </div>

        <p>{{$t('product')}}{{$t('image')}}</p>
        <div class="py-2">
            <ku-upload :f_data.sync="img_data" name="files[]" :limit="10" :filelist='pre_img' />
        </div>

    </el-form>
    <div class="text-center pt-2 my-3">
        <el-button type="primary" @click="handleSubmit" class="w-75" round="">{{$t(tk)}}</el-button>
    </div>

</div>
</template>

<script lang="zh">
import KuEditorHtml from "@/components/KuEditorHtml"
import { mapState, mapActions, mapGetters } from 'vuex'
import { add, getDetail, update } from '@/api/product'

export default {
    name: "NewProductPost",
    middleware: ['authenticated', 'member_2'],
    components: { KuEditorHtml },
    data() {
        return {
            title_arr: ['submit.check', 'update'],
            type: this.$route.params.id,
            selected_cate: [''],
            info: {
                serial: '',
                name_zh: '',
                name_en: '',
                category_id1: '',
                category_id2: '',
                category_id: '',
                custom_category_id: '',
                keyword_zh: '',
                keyword_en: '',
                brand_zh: '',
                brand_en: '',
                unit_id: '',
                price: '',
                max_pindan: '',
                min_quantity: 0,
                is_pindan: 1,
                is_only_buyer: 0,
                description_zh: '',
                description_en: '',
                video_caption: '',

            },
            cate1_props: {
                // multiple: false,
                checkStrictly: true,
                value: 'id',
                // label: 'name',
                label: 'name_' + this.$i18n.locale,
                children: 'childs'
            },
            rules: {
                serial: [{ required: true, message: this.$t('valid.required', [this.$t('product') + this.$t('sn')]), trigger: ['blur', 'change'] }, ],
                name_zh: [{ required: true, message: this.$t('valid.required', [this.$t('product') + this.$t('title')]), trigger: ['blur', 'change'] }, ],
                name_en: [{ required: true, message: this.$t('valid.required', [this.$t('product') + this.$t('title')]), trigger: ['blur', 'change'] }, ],
                description_zh: [{ required: true, message: this.$t('valid.required', [this.$t('desc')]), trigger: ['blur', 'change'] }, ],
                description_en: [{ required: true, message: this.$t('valid.required', [this.$t('desc')]), trigger: ['blur', 'change'] }, ],
                price: [
                    { required: true, message: this.$t('valid.required', [this.$t('product') + this.$t('price')]), trigger: ['blur', 'change'] },
                    { type: "number", message: this.$t('valid.numeric', [this.$t('product') + this.$t('price')]), trigger: ['blur', 'change'] },
                ],
                max_pindan: [
                    { required: true, message: this.$t('valid.required', [this.$t('pin_count')]), trigger: ['blur', 'change'] },
                    { type: "number", message: this.$t('valid.numeric', [this.$t('pin_count')]), trigger: ['blur', 'change'] },
                    { type: "number", min: 1, message: this.$t('valid.min.numeric', [this.$t('pin_count'), 1]), trigger: ['blur', 'change'] }
                ],
                min_quantity: [
                    { type: "number", message: this.$t('valid.numeric', [this.$t('moq')]), trigger: ['blur', 'change'] },
                ]
            },
            img_data: {},
            pre_file: [],
            pre_video: {},
            video_data: {},
            error: {
                cate1: false,
                email: false,
                verification_code: false,
            },
            keywords: {
                zh: [''],
                en: ['']
            },
        }
    },
    computed: {
        ...mapState('common', {
            category_me: state => state.list.product_custom_categories,
            units_product: state => state.list.product_units
        }),
        ...mapGetters('common', ['cate3']),
        ...mapGetters(['userLevel']) ,   
        tk: function () {
            return this.type == "new" ? this.title_arr[0] : this.title_arr[1]
        },
        pre_img: function () {
            let ll = this.pre_file.filter(re => re.subtag == "image")
            return ll
        },
        unit_txt: function () {
            const kk = this.units_product.find(rr => rr.id == this.info.unit_id)
            return this.gsv(['name', this.$i18n.locale], kk)
        }
        // pre_video: function () {
        //     let ll = this.pre_file.filter(re => re.subtag == "video")
        //     return ll
        // },
    },
    methods: {
        ...mapActions('common', ['getUnitsList']),
        cate1Valid() {
            // if (!this.info.category_id1) {
            if (this.selected_cate.length < 3) {
                this.error.cate1 = [this.$t('valid.required', [this.$t('category')])]
                return false
            } else {
                this.error.cate1 = false
                return true
            }
        },
        hChangeCate() {
            // this.cate1Valid()
            this.info.category_id1 = this.selected_cate[0] || ''
            this.info.category_id2 = this.selected_cate[1] || ''
            this.info.category_id = this.selected_cate[2] || ''
        },
        handleChangeKeyword(lang) {
            const k_key = 'keyword_' + lang
            let kkk = this.keywords[lang].filter(rr => rr != '')
            this.info[k_key] = kkk.join(',')
        },
        handleRemoveSingup(lang = 'zh', ind) {
            // delete this.info.signup_names[ind]
            let new_arr = []
            this.keywords[lang].forEach((element, ii) => {
                if (ii != ind)
                    new_arr.push(element)
            });
            this.keywords[lang] = new_arr
        },
        handleAddSingup(lang = 'zh', ii) {
            this.keywords[lang].push('')
        },
        handleSubmit() {
            this.handleChangeKeyword("en")
            this.handleChangeKeyword("zh")
            this.$refs['dataForm'].validate((valid) => {
                if (!this.cate1Valid()) return
                if (valid) {
                    let ob = Object.assign({}, this.info)
                    ob['videos_desc[]'] = this.info.video_caption
                    delete ob.video_caption
                    let form_s = new FormData()
                    if (this.img_data instanceof FormData) {
                        for (let pp of this.img_data.entries()) {
                            form_s.append(pp[0], pp[1])
                        }
                    }
                    if (this.video_data instanceof FormData) {
                        for (let pp of this.video_data.entries()) {
                            form_s.append(pp[0], pp[1])
                        }
                    }
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
                    const config = {
                        onUploadProgress: function (progressEvent) {
                            var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                            console.log(percentCompleted, "%")
                        }
                    }
                    add(form_s, config).then(() => {
                            this.$notify({
                                title: this.$t('success'),
                                message: this.$t('success.add'),
                                type: 'success'
                            });
                            this.$router.replace({ path: '/product_manage' })
                        })
                        .catch(error => {
                            console.log("Api failed!", error)
                            this.error = error
                        }).finally(() => {
                            this.$store.dispatch("common/setLoading", false)
                        })
                } else {
                    return false;
                }
            });
        },
        setSelectedArr(last_cate) {
            // need to fix db, temporary fuction
            // //  only parent cate with last category_id 
            //     if (last_cate) {
            //         // case [1]
            //         let selected_cate = [last_cate.id]
            //         const pid = last_cate.pid
            //         if (pid != 0) {
            //             // case [1, 2]
            //             const lv0 = this.cate3.find(e0 => e0.id == pid)
            //             if (lv0){
            //                 selected_cate.unshift(pid)
            //                 this.selected_cate = selected_cate
            //                 return selected_cate
            //             }  
            //             // case [1,2,3]
            //             this.cate3.forEach(el => {
            //                 if (el.childs) {
            //                     const lv1 = el.childs.find(e1 => e1.id == pid)
            //                     if (lv1) {
            //                         selected_cate.unshift(pid)
            //                         selected_cate.unshift(el.id)
            //                         this.selected_cate = selected_cate
            //                         return true
            //                     }
            //                 }
            //             });                    

            //         } else {
            //             // case [1]
            //             this.selected_cate = selected_cate
            //         }
            //     }
            let selected_cate = []
            if (this.info.category_id1) {
                selected_cate.push(this.info.category_id1)
                if (this.info.category_id2) {
                    selected_cate.push(this.info.category_id2)
                    if (this.info.category_id) {
                        selected_cate.push(this.info.category_id)
                    }
                }
            }
            this.selected_cate = selected_cate
        }
    },
    async mounted() {        
        let qq_store = []
        if (!this.cate3.length) qq_store.push('categories')
        if (!this.category_me.length) qq_store.push('product_custom_categories')
        if (!this.units_product.length)
            qq_store.push('product_units')
        else
            this.info.unit_id = this.units_product[0]['id']
        if (qq_store.length) await this.getUnitsList(qq_store).then(() => {
            this.info.unit_id = this.units_product[0]['id']
        })
        if (this.type != "new") {
            getDetail(this.type).then(res => {
                let pp = res.product
                this.info.id = pp.id
                this.info.serial = pp.serial
                this.info.name_zh = pp.name.zh
                this.info.name_en = pp.name.en
                this.info.category_id1 = pp.category_id1 || ''
                this.info.category_id2 = pp.category_id2 || ''
                this.info.category_id = pp.category_id || ''
                this.setSelectedArr(pp.category)
                this.info.custom_category_id = pp.custom_category_id || ''
                this.info.keyword_en = pp.keyword.en
                this.info.brand_zh = pp.brand.zh
                this.info.brand_en = pp.brand.en
                this.info.unit_id = pp.unit_id
                this.info.price = pp.price
                this.info.max_pindan = pp.max_pindan
                this.info.min_quantity = pp.min_quantity
                this.info.is_pindan = pp.is_pindan
                this.info.is_only_buyer = pp.is_only_buyer
                this.info.description_zh = pp.description.zh
                this.info.description_en = pp.description.en
                this.info.video_caption = ""
                this.pre_file = pp.assets
                this.info.keyword_zh = pp.keyword.zh
                let keywords = [""]
                if (this.info.keyword_zh) {
                    keywords = this.info.keyword_zh.split(',')
                }
                this.keywords.zh = keywords

                let keywords_e = [""]
                if (this.info.keyword_en) {
                    keywords_e = this.info.keyword_en.split(',')
                }
                this.keywords.en = keywords_e

                this.pre_video = pp.assets.find(re => re.subtag == "video") || {}
            }).catch(err => {
                this.goBack()
            })
        }
    }
}
</script>
