<template>
<div>
    <kuc-page-header :title="$t('member.apply')"></kuc-page-header>
    <div class="bg-white mt-2">
        <div class="px-3 py-3">
            <ProcessBar3 :status='1' />
        </div>
        <el-alert v-if="alert_title" :title="alert_title" type="warning" show-icon @close="alert_title=''"></el-alert>
        <div class="px-2 el-label-input-contaner">
            <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0">
                <!-- name -->
                <el-form-item prop="name">
                    <el-input v-model="info.name" class="text-right border-top mt-1" placeholder="王希孟">
                        <template slot="prepend">{{$t('name.real')}}</template>
                    </el-input>
                </el-form-item>

                <!-- sex -->
                <ku-sex v-model="info.gender" />
                <ku-line />
                <!--  position in company -->
                <el-form-item prop="position">
                    <el-input v-model="info.position" class="text-right" placeholder="经理">
                        <template slot="prepend">{{$t('duty_position')}}</template>
                    </el-input>
                </el-form-item>

                <!--  company -->
                <el-form-item prop="company_name">
                    <el-input v-model="info.company_name" class="text-right" placeholder="得力">
                        <template slot="prepend">{{$t('company.name')}}</template>
                    </el-input>
                </el-form-item>

                <!--  phone -->
                <el-form-item prop="company_phone">
                    <ku-input-fax v-model="info.company_phone" title="landline" key="landine"></ku-input-fax>
                </el-form-item>

                <!-- fax -->
                <el-form-item>
                    <ku-input-fax v-model="info.company_fax" key="fax"></ku-input-fax>
                </el-form-item>

                <!-- mobile -->
                <el-form-item prop="phone">
                    <el-input v-model="info.phone" class="text-right" placeholder="156-867-660660" type="number" readonly>
                        <ku-mobile slot="prepend" :mobile_code.sync="info.phone_prefix" />
                        <template slot="append"><span class="text-danger" @click="updateMobileEmail('phone')">{{$t('update')}}</span></template>
                    </el-input>
                </el-form-item>

                <!-- email -->
                <el-form-item prop="email">
                    <el-input v-model="info.email" class="text-right" placeholder="happy@sina.com" readonly>
                        <template slot="prepend">{{$t('email')}}</template>
                        <template slot="append"><span class="text-danger" @click="updateMobileEmail('email')">{{$t('update')}}</span></template>
                    </el-input>
                </el-form-item>
                <!-- company website -->
                <el-form-item>
                    <el-input v-model="info.company_website" class="text-right" placeholder="happy.dog.com.cn">
                        <template slot="prepend">{{$t('company.www')}}</template>
                    </el-input>
                </el-form-item>

                <!-- 国家地区 -->
                <ku-input-location :country_code.sync="info.company_country_code" 
                :region_id.sync="info.company_region_id" 
                :city_id.sync="info.company_city_id" mode_code 
                @change_country="hChangeCountry"/>
                <el-form-item class="ku-only-valid" prop="company_city_id">
                    <el-input v-model="info.company_city_id" type="hidden"></el-input> 
                </el-form-item>

                <!-- detail address -->
                <el-form-item class="ku-no-after" prop="company_addr">
                    <el-input v-model="info.company_addr" class="text-right" placeholder="北京市朝阳区朝阳路58号">
                        <template slot="prepend">{{$t('address.d')}}</template>
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>

    <div class="text-center my-4">
        <el-button type="primary" @click="handleSubmit" class="w-75" round="">{{$t('submit.verify')}}</el-button>
    </div>
    <p class="text-center mb-4 px-2" v-if="$i18n.locale == 'zh'">认证完成，你可以在 <span class="text-danger">企业相关</span>里面修改相应资料</p>
    <p class="text-center mb-4 px-2" v-else>After completed, you can revise the information in the <span class="text-danger">Company Information</span>.</p>

</div>
</template>

<script>
import ProcessBar3 from "@/components/ProcessBar3"
import { userPricing, getMyInfo } from "@/api/user"

import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    name: "PricingStep1Infomation",
    middleware: ['authenticated'],
    components: { ProcessBar3 },
    head() {
        return {
            title: this.$t('member.apply')
        }
    },
    data() {
        var validateCustomFax = (rule, value, callback) => {
            const fax_arr = this.info.company_fax.split('-').filter(rr => rr != '')
            if (fax_arr.length < 3) {
                callback(new Error(this.$t('valid.required', [this.$t('fax')])));
            } else {
                callback();
            }
        };
        var validateCustomPhone = (rule, value, callback) => {
            const fax_arr = this.info.company_phone.split('-').filter(rr => rr != '')
            if (fax_arr.length < 3) {
                callback(new Error(this.$t('valid.required', [this.$t('landline')])));
            } else {
                callback();
            }
        };
        var validateCustomUrl = (rule, value, callback) => {
            if (!this.validURL(value)) {
                callback(new Error(this.$t('valid.url', [this.$t('company.www')])));
            } else {
                callback();
            }
        };
        return {
            info: {
                vip_id: this.$route.params.id,
                name: this.gsv(['name', this.$i18n.locale], this.$store.state.auth),
                gender: this.$store.state.auth.gender || 0,
                position: this.gsv([this.$i18n.locale], this.$store.state.auth.position),
                company_name: this.gsv(['name', this.$i18n.locale], this.$store.state.auth.company) || this.gsv([this.$i18n.locale], this.$store.state.auth.company_name) || '',
                company_phone: this.gsv(['phone'], this.$store.state.auth.company) || this.gsv(['company_phone'], this.$store.state.auth) || '',
                company_fax: this.gsv(['fax'], this.$store.state.auth.company) || this.gsv(['company_fax'], this.$store.state.auth) || '',
                phone_prefix: this.$store.state.auth.phone_prefix || '86',
                phone: this.$store.state.auth.phone || '',
                email: this.$store.state.auth.email || '',
                company_website: this.gsv(['website'], this.$store.state.auth.company) || this.gsv(['company_website'], this.$store.state.auth) || '',
                company_country_code: this.gsv(['country_code'], this.$store.state.auth.company) || this.gsv(['company_country_code'], this.$store.state.auth) || 'CHN',
                company_region_id: this.gsv(['region_id'], this.$store.state.auth.company) || this.gsv(['company_region_id'], this.$store.state.auth) || '',
                company_city_id: this.gsv(['city_id'], this.$store.state.auth.company) || this.gsv(['company_city_id'], this.$store.state.auth) || '',
                company_addr: this.gsv(['address', this.$i18n.locale], this.$store.state.auth.company) || this.gsv(['company_address'], this.$store.state.auth) || '',
            },
            rules: {
                name: [{ required: true, message: this.$t('valid.required', [this.$t('name')]), trigger: ['blur', 'change'] },
                    { min: 2, max: 15, message: this.$t('valid.between.string', [this.$t('name'), 2, 15]), trigger: ['blur', 'change'] },
                ],
                position: [{ required: true, message: this.$t('valid.required', [this.$t('duty_position')]), trigger: ['change'] }, ],
                email: [
                    { required: this.$route.params.id ==5 || !this.$store.state.auth.openid, message: this.$t('valid.required', [this.$t('email')]), trigger: ['blur', 'change'] },
                    { type: 'email', message: this.$t('valid.email', [this.$t('email')]), trigger: ['blur', 'change'] },
                ],
                phone: [{ required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur', 'change'] },
                    { min: 11, max: 15, message: this.$t('valid.between.string', [this.$t('mobile'), 11, 15]), trigger: ['blur', 'change'] },
                ],
                company_fax: [
                    { validator: validateCustomFax, trigger: ['blur', 'change'] }
                ],
                company_phone: [
                    { validator: validateCustomPhone, trigger: ['blur', 'change'] }
                ],
                company_addr: [{ required: true, message: this.$t('valid.required', [this.$t('address.d')]), trigger: ['change'] }, ],
                company_name: [{ required: true, message: this.$t('valid.required', [this.$t('company.name')]), trigger: ['change'] }, ],
                company_city_id: [{ required: true, message: this.$t('valid.required', [this.$t('city')]), trigger: ['change'] }, ],
                company_website: [
                    { required: true, message: this.$t('valid.required', [this.$t('company.www')]), trigger: ['change'] },
                    { validator: validateCustomUrl, trigger: ['blur', 'change'] }
                ],
                company: [{ required: true, message: this.$t('valid.required', [this.$t('company')]), trigger: ['change'] }, ],
                position: [{ required: true, message: this.$t('valid.required', [this.$t('duty_position')]), trigger: ['change'] }, ]
            },
            alert_title: '',
            error:{
                company_city_id: '',
                company_region_id: '',
                email: ''
            }
        }
    },
    computed: {
        ...mapState(['auth']),
    },
    methods: {
        ...mapActions(['userUpdate']),
        handleItemClick(command) {
            this.info.gender = command
        },
        handleSubmit() {
            localStorage.removeItem('mAntway_draft')
            if (this.$route.params.id == 3 && this.$store.state.auth.status_verified) {
                this.$router.replace({ 'path': `/pricing/3/step2` })
                return false
            }
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    let params = Object.assign({}, this.info)
                    delete params.name
                    delete params.position
                    delete params.company_name
                    let lang = this.$i18n.locale;
                    params[`name_${lang}`] = this.info.name
                    params[`position_${lang}`] = this.info.position
                    params[`company_name_${lang}`] = this.info.company_name
                    // console.log(params)
                    this.$store.dispatch("common/setLoading")                    
                    userPricing(1, params).then(response => {
                        this.$store.dispatch('setUserAuth', response.user)
                        this.$router.replace({ 'path': `/pricing/${this.info.vip_id}/step2` })
                    }).catch(err=>{
                        this.error = err
                        this.alert_title = JSON.stringify(err)
                    })
                    .finally(() => {
                        this.$store.dispatch("common/setLoading", false)
                    })
                } else {
                    return false;
                }
            });

        },
        updateMobileEmail(mobile_email){   
            const draft = Object.assign({}, this.info)
            delete draft[mobile_email]
            localStorage.setItem('mAntway_draft', JSON.stringify(draft))
            this.$router.push({path: `/my/profile_update/${mobile_email}`})
        },
        // location validation, location_validation
        hChangeCountry(e){
            this.rules.company_city_id[0]['required'] = e=='CHN'
            if(e!='CHN'){
                this.info.company_city_id ="s"
                setTimeout(() => {                    
                    this.info.company_city_id =""
                }, 1);
            } 
        }
    },
    mounted() {
        const vip_id_want = this.$route.params.id ? parseInt(this.$route.params.id) : null
        // if vip you want is pendeng
        if (vip_id_want <= this.$store.state.auth.vip_id) {
            this.$router.replace({ path: `/pricing` })
        } else if (vip_id_want == this.$store.state.auth.vip_id_pending) {
            this.$router.replace({ path: `/pricing/${this.$route.params.id}/step2` })
        } else if(vip_id_want == 3 && this.$store.state.auth.status_verified == 1){
            this.$router.replace({ path: `/pricing/${this.$route.params.id}/step2`, query:{st:1} })
        }
        else {
            let draft = localStorage.getItem('mAntway_draft')
            if(draft){
                draft = JSON.parse(draft)
                this.info = Object.assign(this.info, draft)
                this.hChangeCountry(draft.company_country_code)
                console.log(draft)
            }else{
                getMyInfo().then(response => {
                    this.$store.dispatch('setUserAuth', response.user).then(() => {
                        const new_info = {
                            name: this.gsv(['name', this.$i18n.locale], this.$store.state.auth),
                            gender: this.$store.state.auth.gender || 0,
                            position: this.gsv([this.$i18n.locale], this.$store.state.auth.position),
                            company_name: this.gsv(['name', this.$i18n.locale], this.$store.state.auth.company) || this.gsv([this.$i18n.locale], this.$store.state.auth.company_name) || '',
                            company_phone: this.gsv(['phone'], this.$store.state.auth.company) || this.gsv(['company_phone'], this.$store.state.auth) || '',
                            company_fax: this.gsv(['fax'], this.$store.state.auth.company) || this.gsv(['company_fax'], this.$store.state.auth) || '',
                            phone_prefix: this.$store.state.auth.phone_prefix || '86',
                            phone: this.$store.state.auth.phone || '',
                            email: this.$store.state.auth.email || '',
                            company_website: this.gsv(['website'], this.$store.state.auth.company) || this.gsv(['company_website'], this.$store.state.auth) || '',
                            company_country_code: this.gsv(['country_code'], this.$store.state.auth.company) || this.gsv(['company_country_code'], this.$store.state.auth) || 'CHN',
                            company_region_id: this.gsv(['region_id'], this.$store.state.auth.company) || this.gsv(['company_region_id'], this.$store.state.auth) || '',
                            company_city_id: this.gsv(['city_id'], this.$store.state.auth.company) || this.gsv(['company_city_id'], this.$store.state.auth) || '',
                            company_addr: this.gsv(['address', this.$i18n.locale], this.$store.state.auth.company) || this.gsv(['company_address'], this.$store.state.auth) || '',
                        }
                        this.hChangeCountry(new_info.company_country_code)
                        this.info = Object.assign(this.info, new_info)
                    })
                })
            }
        }
    }

}
</script>
