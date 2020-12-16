<template>
<div>

    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" class="bg-white px-2 pt-1" :key="r_key">
        <!-- description cn, en -->
        <el-form-item class="ku-no-after" prop="company.description.zh">
            <p>{{$t('company.profile')}} ({{$t('lang.zh')}})</p>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" maxlength="500" show-word-limit v-model="info.company.description.zh" :placeholder="$t('form.say')"></el-input>
        </el-form-item>

        <el-form-item prop="company.description.en">
            <p>{{$t('company.profile')}} ({{$t('lang.en')}})</p>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" maxlength="500" show-word-limit v-model="info.company.description.en" :placeholder="$t('form.say')"></el-input>
        </el-form-item>

        <!--  经营性质 -->
        <div class="py-input">
            <dlg-select :title="$t('business.nature')" :checked.sync="info.company.mgmodel_id" :list="list.mgmodels" />
        </div>
        <ku-line />

        <!--  主营产品 -->        
        <div class="align-items-center py-1 d-flex">
            <p class="text-nowrap mr-2">{{$t('expo.goods')}}（{{$t('lang.zh')}}）</p>
            <el-cascader v-model="main_products" :options="cate2" :props="cate1_props" clearable class="flex-1" @change="hChangeCate" :key="'m'+r_key"></el-cascader>
        </div>
        <!-- <div class="el-form-item__error" v-if="error.cate1">{{error.cate1[0]}}</div> -->
        <ku-line />        
        <div class="align-items-center py-1 d-flex">
            <p class="text-nowrap mr-2">{{$t('expo.goods')}}（{{$t('lang.en')}}）</p>
            <el-cascader v-model="main_products" :options="cate2" :props="cate1_props_en" clearable class="flex-1" @change="hChangeCate" :key="'n'+r_key"></el-cascader>
        </div>
        <ku-line />

        <!-- 主要品牌 -->
        <el-form-item prop="company.major_brand.zh">
            <el-input v-model="info.company.major_brand.zh" class="text-right" :placeholder="$t('form.input')">
                <template slot="prepend">{{$t('brand.main')}} ({{$t('lang.zh')}})</template>
            </el-input>
        </el-form-item>

        <el-form-item prop="company.major_brand.en">
            <el-input v-model="info.company.major_brand.en" class="text-right" :placeholder="$t('form.input')">
                <template slot="prepend">{{$t('brand.main')}} ({{$t('lang.en')}})</template>
            </el-input>
        </el-form-item>

        <!-- 是否可以OEM或ODM -->        
        <div class="align-items-center py-1 d-flex">
                <p class="text-nowrap mr-2">{{$t('is_oem')}}</p>
                <el-select v-model="info.company.avail_oem" :placeholder="$t('select')" class="w-100 text-right" key="Yes_No">
                    <el-option :label="$t('status.yes')" :value="1"></el-option>
                    <el-option :label="$t('status.no')" :value="0"></el-option>
                </el-select>
            </div>
        <ku-line />

        <!-- 主要市场 -->
        <div class="py-input">
            <dlg-select :title="$t('main.market')" :checked.sync="market_ids" :list="list.markets" />
        </div>
        <ku-line />

        <!-- 员工人数 -->
        <el-form-item prop="company.staff_count">
            <el-input v-model.number="info.company.staff_count" class="text-right" placeholder="123" type="number">
                <template slot="prepend">{{$t('count.worker')}}</template>
                <template slot="append"><span class="text-dark6">人</span></template>
            </el-input>
        </el-form-item>

        <!-- 厂房面积 -->
        <el-form-item prop="company.factory_area">
            <el-input v-model.number="info.company.factory_area" class="text-right" placeholder="5233" type="number">
                <template slot="prepend">{{$t('factory.area')}}</template>
                <template slot="append"><span class="text-dark6">m<sup>2</sup></span></template>
            </el-input>
        </el-form-item>

        <!-- Factory address -->
        <el-form-item prop="company.factory_addr.zh">
            <el-input v-model="info.company.factory_addr.zh" class="text-right" :placeholder="$t('factory.addr')">
                <template slot="prepend">{{$t('factory.addr')}} ({{$t('lang.zh')}})</template>
            </el-input>
        </el-form-item>

        <el-form-item prop="company.factory_addr.en">
            <el-input v-model="info.company.factory_addr.en" class="text-right" :placeholder="$t('factory.addr')">
                <template slot="prepend">{{$t('factory.addr')}} ({{$t('lang.en')}})</template>
            </el-input>
        </el-form-item>

        <!-- 年销售额  -->
        <el-form-item prop="company.annual_sale" class="ku-no-after">
            <el-input v-model.number="info.company.annual_sale" class="text-right" placeholder="1600" type="number">
                <template slot="prepend">{{$t('year.sale')}}</template>
                <template slot="append"><span class="text-dark6">万元</span></template>
            </el-input>
        </el-form-item>

    </el-form>

    <div class="text-center pt-2 my-3">
        <el-button type="primary" @click="handleSubmit" class="w-75" round="" :disabled="company_status=='status.company_suspend'">{{$t('save.setting')}}</el-button>
    </div>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { add, getDetail, getList } from '@/api/my_company'
export default {
    name: "CompanyInfomationDetail",
    components: {},
    data() {
        return {
            info: {
                company: {
                    description: {
                        zh: '',
                        en: ''
                    },
                    major_brand: {
                        zh: '',
                        en: ''
                    },
                    factory_addr: {
                        zh: '',
                        en: ''
                    },
                    mgmodel_id: '',
                    avail_oem: 0,
                    staff_count: 0,
                    factory_area: 0,
                    annual_sale: 0,
                }
            },
            market_ids: [],
            main_products: [],
            cate1_props: {
                multiple: true,
                value: 'id',
                label: 'name_zh',
                children: 'childs'
            },
            cate1_props_en: {
                multiple: true,
                value: 'id',
                label: 'name_en',
                children: 'childs'
            },
            r_key: +new Date(),
            rules: {
                "company.description.zh": [
                    { required: true, message: this.$t('valid.required', [this.$t('company.profile')]), trigger: ['blur', 'change'] },
                ],
                "company.description.en": [
                    { required: true, message: this.$t('valid.required', [this.$t('company.profile')]), trigger: ['blur', 'change'] },
                ],
                "company.factory_area": [
                    // { required: true, message: this.$t('valid.required', [this.$t('factory.area')]), trigger: ['blur', 'change'] },
                    { type: "number", message: this.$t('valid.numeric', [this.$t('factory.area')]), trigger: ['blur', 'change'] },
                ],
                "company.factory_addr.zh": [
                    { required: true, message: this.$t('valid.required', [this.$t('factory.addr')]), trigger: ['blur', 'change'] },
                ],
                "company.factory_addr.en": [
                    { required: true, message: this.$t('valid.required', [this.$t('factory.addr')]), trigger: ['blur', 'change'] },
                ],
                "company.major_brand.zh": [
                    { required: true, message: this.$t('valid.required', [this.$t('brand.main')]), trigger: ['blur', 'change'] },
                ],
                "company.major_brand.en": [
                    { required: true, message: this.$t('valid.required', [this.$t('brand.main')]), trigger: ['blur', 'change'] },
                ],
                "company.annual_sale": [
                    // { required: true, message: this.$t('valid.required', [this.$t('year.sale')]), trigger: ['blur', 'change'] },
                    { type: "number", message: this.$t('valid.numeric', [this.$t('year.sale')]), trigger: ['blur', 'change'] },
                ],
                "company.staff_count": [
                    // { required: true, message: this.$t('valid.required', [this.$t('count.worker')]), trigger: ['blur', 'change'] },
                    { type: "number", message: this.$t('valid.numeric', [this.$t('count.worker')]), trigger: ['blur', 'change'] },
                ],

            },
        }
    },
    computed: {
        ...mapState('common', ['list']),
        ...mapGetters('common', ['cate2']),
        ...mapGetters(['company_status']) ,   
        ...mapState('company', ['my_company_info']),
    },
    methods: {
        ...mapActions('common', ['getUnitsList']),
        ...mapActions('company', ['getMyCompanyInfo', 'setMyCompanyInfo']),

        hChangeCate() {

        },
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    let obj = this.info.user
                    let s_data = {
                        user: this.buildQuery(this.info.user),
                        company: this.buildQuery(this.info.company),
                    }
                    s_data.company.market_ids = this.market_ids.join(',')

                    let main_products = []
                    this.main_products.forEach(mm => {
                        let last_cate = ''
                        const kk = this.list.categories.find(cate0 => cate0.id == mm[0])
                        last_cate = kk
                        if (kk && mm.length > 1) {
                            last_cate = kk.childs.find(cate2 => cate2.id == mm[1])
                        }
                        main_products.push(last_cate)
                    })
                    s_data.company.categories = main_products

                    this.$store.dispatch("common/setLoading")
                    add(s_data).then(res => {
                        this.setMyCompanyInfo(res)
                        this.$notify({
                            title: this.$t('success'),
                            message: this.$t('success.updated'),
                            type: 'success'
                        });
                    }).finally(() => {
                        this.$store.dispatch("common/setLoading", false)
                    })
                } else {
                    return false;
                }
            });
        },
        // need to fix db, temporary fuction
        setSelectedArr(last_cate) {
            if (last_cate) {
                // case [1]
                let selected_cate = [last_cate.id]
                const pid = last_cate.pid
                if (pid != 0) {
                    // case [1, 2]
                    const lv0 = this.cate2.find(e0 => e0.id == pid)
                    if (lv0) {
                        selected_cate.unshift(pid)
                        return selected_cate
                    }
                }
                return selected_cate
            }
        },
        initWithStore() {
            this.info = this.my_company_info
            this.info.company.mgmodel_id = this.info.company.mgmodel_id || ''
            if (this.info.company.market_ids) {
                let tttem = this.info.company.market_ids.split(',').map(x => +x)
                this.market_ids = tttem
            }
            if (this.info.company.categories) {
                let selected_cate_ids = []
                this.info.company.categories.forEach(el => {
                    // selected_cate_ids.push(el.id)
                    const kkk = this.setSelectedArr(el)
                    selected_cate_ids.push(kkk)
                });
                this.main_products = selected_cate_ids
            }
        }
    },
    mounted() {
        let common_cate = []
        if (!this.list.mgmodels.length) {
            common_cate.push('mgmodels')
        }
        if (!this.list.markets.length) {
            common_cate.push('markets')
        }
        if (!this.list.categories.length) {
            common_cate.push('categories')
        }
        if (common_cate.length) this.getUnitsList(common_cate).then(() => {
            this.initWithStore()
        });
        if (!this.my_company_info) {
            this.getMyCompanyInfo().then(res => {
                this.initWithStore()
            })
        } else {
            this.initWithStore()
        }
    }
}
</script>
