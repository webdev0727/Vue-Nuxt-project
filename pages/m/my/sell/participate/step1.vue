<template>
<div>
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" class="bg-white pt-2 px-2">
        <ProcessBar3 :status='1' :items='process_items' />

        <el-alert v-if="gsv(['expo_applicant_seller', 'admin_checked'], seller_step)==2" title="你没有被通过。 尝试再次申请" type="warning" show-icon></el-alert>

        <h3 class="py-2">{{$t('info.basic')}}</h3>
        <ku-line />

        <div class="py-input">
            <dlg-select :title="$t('expo.sel')" :checked.sync="info.expo_id" :list="expo_list" />
        </div>
        <ku-line />
        <!-- 真实姓名（中文） -->
        <!-- prop="name_hz" -->
        <el-form-item>
            <el-input v-model="info.name_hz" class="text-right" placeholder="王希孟">
                <template slot="prepend">{{$t('name.real')}}（{{$t('lang.zh')}}）</template>
            </el-input>
        </el-form-item>

        <!-- 真实姓名（英文） prop="name_en" -->
        <el-form-item>
            <el-input v-model="info.name_en" class="text-right" placeholder="English Name">
                <template slot="prepend">{{$t('name.real')}}（{{$t('lang.en')}}）</template>
            </el-input>
        </el-form-item>
        <!-- 性别 sex -->
        <ku-sex v-model="info.gender" key="ss" />
        <ku-line />
        <!--  position in company -->
        <el-form-item label="">
            <el-input v-model="info.position_zh" class="text-right" :placeholder="$t('duty_position')">
                <template slot="prepend">{{$t('duty_position')}}（{{$t('lang.zh')}}）</template>
            </el-input>
        </el-form-item>

        <el-form-item label="">
            <el-input v-model="info.position_en" class="text-right" :placeholder="$t('duty_position')">
                <template slot="prepend">{{$t('duty_position')}}（{{$t('lang.en')}}）</template>
            </el-input>
        </el-form-item>

        <!--  company -->
        <el-form-item prop="company.name_zh">
            <el-input v-model="info.company.name_zh" class="text-right" placeholder="得力">
                <template slot="prepend">{{$t('company')}}（{{$t('lang.zh')}}）</template>
            </el-input>
        </el-form-item>

        <el-form-item prop="company.name_en">
            <el-input v-model="info.company.name_en" class="text-right" placeholder="得力">
                <template slot="prepend">{{$t('company')}}（{{$t('lang.en')}}）</template>
            </el-input>
        </el-form-item>

        <!-- 座机 -->
        <el-form-item>
            <ku-input-fax v-model="info.company.phone" title="landline" key="landine"></ku-input-fax>
        </el-form-item>

        <!-- 传真 fax -->
        <el-form-item label="">
            <ku-input-fax v-model="info.company.fax" key="fax"></ku-input-fax>
        </el-form-item>

        <!-- 手机  -->
        <!-- <el-form-item label="">
            <el-input v-model="info.mobile" class="text-right" placeholder="089-234-123">
                <template slot="prepend">{{$t('mobile')}}</template>
            </el-input>
        </el-form-item> -->
        <el-form-item prop="phone">
            <el-input v-model="info.phone" class="text-right" placeholder="156-867-660660" type="number" readonly>
                <ku-mobile slot="prepend" :mobile_code.sync="info.phone_prefix" readonly />
                <template slot="append"><span class="text-danger" @click="updateMobileEmail('phone')">{{$t('update')}}</span></template>
            </el-input>
        </el-form-item>
        <!-- 邮箱  -->
        <el-form-item label="">
            <el-input v-model="info.email" class="text-right" placeholder="happy@sina.com" readonly>
                <template slot="prepend">{{$t('email')}}</template>
                <template slot="append"><span class="text-danger" @click="updateMobileEmail('email')">{{$t('update')}}</span></template>
            </el-input>
        </el-form-item>

        <!-- 公司网址  -->
        <el-form-item label="">
            <el-input v-model="info.company.website" class="text-right" :placeholder="$t('company.www')">
                <template slot="prepend">{{$t('company.www')}}</template>
            </el-input>
        </el-form-item>

        <!-- 国家地区 -->
        <ku-input-location :country_code.sync="info.company.country_code" :region_id.sync="info.company.region_id" :city_id.sync="info.company.city_id" mode_code />
        <ku-line />

        <!-- 地址（中文）  -->
        <el-form-item prop="company.address_zh">
            <el-input v-model="info.company.address_zh" class="text-right" placeholder="北京市朝阳区朝阳路58号">
                <template slot="prepend">{{$t('address')}}（{{$t('lang.zh')}}）</template>
            </el-input>
        </el-form-item>
        <!-- 地址（英文）  -->
        <el-form-item prop="company.address_en">
            <el-input v-model="info.company.address_en" class="text-right" placeholder="beijing Zhoyang 58">
                <template slot="prepend">{{$t('address')}}（{{$t('lang.en')}}）</template>
            </el-input>
        </el-form-item>

        <!-- postal -->
        <el-form-item label="">
            <el-input v-model="info.company.postal" class="text-right" :placeholder="$t('pc')" type="number">
                <template slot="prepend">{{$t('pc')}}</template>
            </el-input>
        </el-form-item>

        <h3 class="py-2 mt-3 border-bottom">{{$t("expo.detail")}}</h3>
        <!-- 展会负责人  -->
        <el-form-item prop="leader_name">
            <el-input v-model="info.leader_name" class="text-right" placeholder="王希孟">
                <template slot="prepend">{{$t('expo.charge')}}</template>
            </el-input>
        </el-form-item>

        <!-- 负责人 性别  -->
        <ku-sex v-model="info.leader_gender" key="reader_sex" />
        <ku-line />
        <!--  leader position in company -->
        <el-form-item prop="leader_position">
            <el-input v-model="info.leader_position" class="text-right" placeholder="经理">
                <template slot="prepend">{{$t('duty_position')}}</template>
            </el-input>
        </el-form-item>

        <!-- leader 手机  -->

        <el-form-item prop="leader_phone">
            <el-input v-model="info.leader_phone" class="text-right" placeholder="156-867-660660" type="number">
                <ku-mobile slot="prepend" :mobile_code.sync="info.phone_prefix" />
            </el-input>
        </el-form-item>
        <!-- cate -->
        <div class="align-items-center py-1 d-flex">
            <p class="text-nowrap mr-2">{{$t('expo.product')}}</p>
            <el-cascader v-model="selected_cate" :options="cate3" :props="cate1_props" clearable class="flex-1 text-right" @change="validCate"></el-cascader>
        </div>
        <div class="el-form-item__error" v-if="error.cate">{{error.cate}}</div>
        <ku-line />

        <!-- 展会申请  -->
        <div class="align-items-center py-1 d-flex">
            <p class="text-nowrap mr-2">展会申请</p>
            <el-select v-model="info.areatype_id" :placeholder="$t('select')" class="w-100 text-right">
                <el-option v-for="item in areatype_list" :key="'setting_'+ item.id" :label="gsv([$i18n.locale], item.name)" :value="item.id"></el-option>
            </el-select>
        </div>
        <ku-line />

        <!-- 展位面积 -->
        <el-form-item prop="area" class="ku-no-after">
            <el-input v-model="info.area" :placeholder="$t('form.input_v')" class="text-right" type="number">
                <template slot="prepend">{{$t('expo.area')}}</template>
                <template slot="append"> m<sup>2</sup></template>
            </el-input>
        </el-form-item>

    </el-form>

    <div class="text-center pt-2 my-4">
        <el-button type="primary" @click="handleSubmit" class="w-75" round="" :disabled="!info.expo_id">{{this.$t('next')}}</el-button>
    </div>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getStep, applyStep } from "@/api/expo"
import ProcessBar3 from "@/components/ProcessBar3"

import { getInfo } from "@/api/user"
export default {
    scrollToTop: true,
    name: "Participate_New_Step1",
    components: { ProcessBar3 },
    data() {
        return {
            process_items: [this.$t('info.fill'), this.$t('investigation'), this.$t('submit.success')],
            dialogVisibleVipAllocation: false,
            activeIndex: '1',
            info: {
                company_id: this.$store.state.auth.company_id,
                name_hz: this.gsv(['zh'], this.$store.state.auth.name) || '',
                name_en: this.gsv(['en'], this.$store.state.auth.name) || '',
                gender: this.$store.state.auth.gender,
                position_en: this.gsv(['en'], this.$store.state.auth.position) || '',
                position_zh: this.gsv(['zh'], this.$store.state.auth.position) || '',
                company: {
                    id: this.$store.state.auth.company_id,
                    name_zh: this.gsv(['name', 'zh'], this.$store.state.auth.company) || '',
                    name_en: this.gsv(['name', 'en'], this.$store.state.auth.company) || '',
                    address_zh: this.gsv(['zh'], this.$store.state.auth.company.address) || this.$store.state.auth.company_addr || '',
                    address_en: this.gsv(['en'], this.$store.state.auth.company.address) || this.$store.state.auth.company_addr || '',
                    website: this.$store.state.auth.company.website,
                    fax: this.$store.state.auth.company.fax,
                    phone: this.$store.state.auth.company.phone,
                    country_code: this.$store.state.auth.company.country_code || 'CHN',
                    region_id: this.$store.state.auth.company.region_id,
                    city_id: this.$store.state.auth.company.city_id,
                    postal: this.$store.state.auth.company.postal,
                },
                phone_prefix: this.$store.state.auth.phone_prefix || '86',
                phone: this.$store.state.auth.phone,
                landline: this.$store.state.auth.company.phone,
                friend_name: '',
                email: this.$store.state.auth.email,
                // country_id: 1,

                expo_id: '',
                areatype_id: '',
                leader_name: '',
                leader_gender: this.$store.state.auth.gender,
                leader_position: '经理',
                leader_phone: '',
                area: '',

            },
            rules: {
                "company.name_en": [{ required: true, message: this.$t('valid.required', [this.$t('company')]), trigger: ['blur', 'change'] }, ],
                "company.name_zh": [{ required: true, message: this.$t('valid.required', [this.$t('company')]), trigger: ['blur', 'change'] }, ],
                "company.address_zh": [{ required: true, message: this.$t('valid.required', [this.$t('company')]), trigger: ['blur', 'change'] }, ],
                "company.address_en": [{ required: true, message: this.$t('valid.required', [this.$t('company')]), trigger: ['blur', 'change'] }, ],
                leader_name: [{ required: true, message: this.$t('valid.required', [this.$t('expo.charge')]), trigger: ['blur', 'change'] }, ],
                leader_position: [{ required: true, message: this.$t('valid.required', [this.$t('duty_position')]), trigger: ['blur', 'change'] }, ],
                phone: [
                    { required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur', 'change'] },
                    { min: 11, message: this.$t('valid.min.string', [this.$t('mobile'), 11]), trigger: ['blur'] },
                ],
                area: [{ required: true, message: this.$t('valid.required', [this.$t('expo.area')]), trigger: ['blur', 'change'] }, ],
                leader_phone: [
                    { required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur', 'change'] },
                    { min: 11, message: this.$t('valid.min.string', [this.$t('mobile'), 11]), trigger: ['blur'] },
                ],

            },
            selected_cate: [],
            cate1_props: {
                multiple: true,
                value: 'id',
                // label: 'name',
                label: 'name_' + this.$i18n.locale,
                children: 'childs'
            },
            expo_list: [],
            areatype_list: [],
            error: {
                cate: false,
            }
        }
    },
    computed: {
        ...mapState('expo', ["seller_step"]),
        ...mapGetters('common', ['cate3']),
    },
    methods: {
        ...mapActions('expo', ['getSellerStatus']),
        ...mapActions('common', ['getUnitsList']),
        updateMobileEmail(mobile_email) {            
            this.$router.push({ path: `/my/profile_update/${mobile_email}` })
        },
        getSelectedCateLevelLast() {
            // let selected_items = this.selected_cate.filter(rr => rr.length > 1)
            let cate_level1 = []
            this.selected_cate.forEach(el => {
                cate_level1.push(el[el.length - 1])
            });
            return cate_level1
        },
        validCate() {
            let valid_c = false;
            if (!this.selected_cate.length) {
                this.error.cate = this.$t('valid.required', [this.$t('category')])
                valid_c = false
            } else {
                valid_c = true
                this.error.cate = false
            }
            return valid_c
        },
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                let category_ids = this.getSelectedCateLevelLast()
                let valid_c = this.validCate()
                if (valid && valid_c) {
                    // leader_phone: "+" + this.info.phone_prefix + this.info.leader_phone,
                    let da = {
                        category_ids,
                        ...this.info
                    }
                    this.$store.dispatch("common/setLoading")
                    applyStep('seller', 0, da).then(async (re) => {
                        const next_step = await this.getSellerStatus()
                        this.handleRoute()
                        // this.$router.push({ path: '/my/sell/participate/step2' })
                    }).finally(() => {
                        this.$store.dispatch("common/setLoading", false)
                    })
                } else {
                    return false;
                }
            });
        },

        setSelectedArrFromLastCate(last_cate) {
            // need to fix db, temporary fuction
            //  only parent cate with last category_id             
            // case [1]
            let selected_cate = [last_cate.id]
            const pid = last_cate.pid
            if (pid != 0) {
                // case [1, 2]
                const lv0 = this.cate3.find(e0 => e0.id == pid)
                if (lv0) {
                    selected_cate.unshift(pid)
                    return selected_cate
                }
                // case [1,2,3]
                this.cate3.forEach(el => {
                    if (el.childs) {
                        const lv1 = el.childs.find(e1 => e1.id == pid)
                        if (lv1) {
                            selected_cate.unshift(pid)
                            selected_cate.unshift(el.id)
                            return selected_cate
                        }
                    }
                });

            } else {
                // case [1]
                return selected_cate
            }

            return selected_cate
        },
        setSelectedArr(last_cate2) {
            const categories = this.gsv(['categories'], this.seller_step.expo_applicant_seller)
            let mm = []
            if (categories) {
                categories.forEach(el => {
                    mm.push(this.setSelectedArrFromLastCate(el))
                });
            }
            this.selected_cate = mm
        },

        initDa() {
            const res = this.seller_step
            // if (res.status == 0) {
            if (res.categories) {
                this.$store.commit("common/SET_UNITS", { 'categories': res.categories })
            }
            this.expo_list = res.expos
            this.areatype_list = res.areatypes
            if (res.expos.length) this.info.expo_id = res.expos[0]['id']
            if (res.expos.areatypes) this.info.areatype_id = res.areatypes[0]['id']
            const user = res.user
            if (user) {
                this.info.position_en = this.gsv(['en'], user.position) || ''
                this.info.position_zh = this.gsv(['zh'], user.position) || ''
                this.info.company.name_en = this.gsv(['name', 'en'], user.company) || this.gsv(['en'], user.company_name) || ''
                this.info.company.name_zh = this.gsv(['name', 'zh'], user.company) || this.gsv(['zh'], user.company_name) || ''
                this.info.company.fax = this.gsv(['fax'], user.company) || user.company_fax || ''
                this.info.company.phone = this.gsv(['phone'], user.company) || user.company_phone || ''
                this.info.company.website = this.gsv(['website'], user.company) || user.company_website || ''
                this.info.company.country_code = this.gsv(['country_code'], user.company) || user.company_country_code || 'CHN'
                this.info.company.region_id = this.gsv(['region_id'], user.company) || user.company_region_id || ''
                this.info.company.city_id = this.gsv(['city_id'], user.company) || user.company_city_id || ''
                this.info.company.postal = this.gsv(['postal'], user.company) || ''
                this.info.phone = user.phone || ''
                this.info.phone_prefix = user.phone_prefix || '86'
                this.info.company.address_zh = this.gsv(['address', 'zh'], user.company) || user.company_addr || ''
                this.info.company.address_en = this.gsv(['address', 'en'], user.company) || user.company_addr || ''
            }
            const saved_data = res.expo_applicant_seller
            if (saved_data) {
                this.info.expo_id = saved_data.expo_id
                this.info.areatype_id = saved_data.areatype_id
                this.info.leader_name = saved_data.leader_name
                this.info.leader_gender = saved_data.leader_gender
                this.info.leader_position = saved_data.leader_position
                this.info.leader_phone = saved_data.leader_phone
                this.info.area = saved_data.area
                this.setSelectedArr()
            }
        },
        handleRoute(step = 0) {
            let path = "/my/sell/participate/"
            if (this.seller_step.status) path = path + "step" + (parseInt(this.seller_step.status) + 1)
            // switch (this.seller_step.status) {
            //     case 0:
            //         // main info setting - page
            //         path = "/my/sell/participate/"
            //         break;
            //     case 1:
            //         // survey - page
            //         path = "/my/sell/participate/" + "step2"
            //         break;
            //     case 2:
            //         // svg-map - page
            //         path = "/my/sell/participate/" + "step3"
            //         // break;
            //     case 3:
            //         // first join success - page
            //         path = "/my/sell/participate/" + "step4"
            //         break;
            //     case 4:
            //         // pay confirm - page
            //         path = "/my/sell/participate/" + "step5"
            //         break;
            //     case 5:
            //     case 6:
            //         // success-5step-all - page
            //         path = "/my/sell/participate/" + "step6"
            //         break;
            //     default:
            //         break;
            // }
            if (this.seller_step.status == step) {
                this.initDa()
            } else {
                this.$router.replace({ path })
            }
        },

    },
    mounted() {
        /* 
        ------------------------------------------------------
        New           processed-status  admin_checked paied
        ------------------------------------------------------
        not                     0       -  
        ------------------------------------------------------
        info                    1       -
        quantity                       
        admin_check_pending     3       -           -
        admin_check_passed      4       1           -
        admin_check_paied       5       1           1
        ------------------------------------------------------   
         */

        if (this.$route.query.edit) {
            this.getSellerStatus(0).then(() => {
                this.initDa()
            })
        } else {
            // if (this.seller_step.status == undefined) {
                this.getSellerStatus().then(() => {
                    this.handleRoute()
                })
            // }
            // this.handleRoute()
        }
        if (!this.cate3.length) this.getUnitsList(['categories']).then(() => {
            this.setSelectedArr()
        })
    }
}
</script>
