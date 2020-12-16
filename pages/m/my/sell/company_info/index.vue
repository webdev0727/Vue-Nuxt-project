<template>
<div>

    <div class="">

        <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" class="bg-white px-2">

            <el-alert v-if="alert_title" :title="alert_title" type="warning" show-icon @close="alert_title=''"></el-alert>

            <!-- prop="name_cn" -->
            <el-form-item prop="user.name.zh">
                <el-input v-model="info.user.name.zh" class="text-right" placeholder="王希孟">
                    <template slot="prepend">{{$t('name.real')}}（{{$t('lang.zh')}}）</template>
                </el-input>
            </el-form-item>

            <!-- 真实姓名（英文） prop="name.en" -->
            <el-form-item>
                <el-input v-model="info.user.name.en" class="text-right" placeholder="Real Name">
                    <template slot="prepend">{{$t('name.real')}}（{{$t('lang.en')}}）</template>
                </el-input>
            </el-form-item>

            <!-- 性别 sex -->
            <ku-sex v-model="info.user.gender" />
            <ku-line />

            <!--  position in company -->
            <el-form-item label="">
                <el-input v-model="info.user.position.zh" class="text-right" placeholder="经理">
                    <template slot="prepend">{{$t('duty_position')}}（{{$t('lang.zh')}}）</template>
                </el-input>
            </el-form-item>

            <el-form-item label="">
                <el-input v-model="info.user.position.en" class="text-right" placeholder="经理">
                    <template slot="prepend">{{$t('duty_position')}}（{{$t('lang.en')}}）</template>
                </el-input>
            </el-form-item>

            <!--  company -->
            <el-form-item prop="company.name.zh">
                <el-input v-model="info.company.name.zh" class="text-right" placeholder="得力">
                    <template slot="prepend">{{$t('company')}}（{{$t('lang.zh')}}）</template>
                </el-input>
            </el-form-item>

            <el-form-item prop="company.name.en">
                <el-input v-model="info.company.name.en" class="text-right" placeholder="得力">
                    <template slot="prepend">{{$t('company')}}（{{$t('lang.en')}}）</template>
                </el-input>
            </el-form-item>
            <!-- 座机 -->
            <el-form-item prop="company.phone">
                <ku-input-fax v-model="info.company.phone" title="landline" key="landine"></ku-input-fax>
            </el-form-item>
            <!-- 传真 fax -->
            <el-form-item label="">
                <ku-input-fax v-model="info.company.fax" key="fax"></ku-input-fax>
            </el-form-item>
            <!-- 手机  -->
            <el-form-item prop="user.phone">
                <el-input v-model="info.user.phone" class="text-right" placeholder="156-867-660660" type="number" readonly>
                    <ku-mobile slot="prepend" :mobile_code.sync="info.user.phone_pre" readonly />
                    <template slot="append"><span class="text-danger" @click="updateMobileEmail('phone')">{{$t('update')}}</span></template>
                </el-input>
            </el-form-item>
            <!-- 邮箱  -->
            <el-form-item prop="user.email">
                <el-input v-model="info.user.email" class="text-right" placeholder="happy@sina.com" readonly>
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
            <!-- 二级域名 -->
            <el-form-item prop="company.second_domain" :error="error.second_domain">
                <el-input v-model="info.company.second_domain" placeholder="请输入喜欢的域名">
                    <template slot="prepend">{{$t('domain_2st')}} <span class="text-dark9">http://</span> </template>
                    <template slot="append"><span class="text-dark9">.web.antway.cn</span></template>
                </el-input>
            </el-form-item>

            <ku-input-location :country_code.sync="info.company.country_code" :region_id.sync="info.company.region_id" :city_id.sync="info.company.city_id" mode_code />
            <ku-line />

            <el-form-item label="">
                <el-input v-model="info.company.postal" class="text-right" :placeholder="$t('pc')" type="number">
                    <template slot="prepend">{{$t('pc')}}</template>
                </el-input>
            </el-form-item>

            <!-- 地址（中文）  -->
            <el-form-item label="">
                <el-input v-model="info.company.address.zh" class="text-right" placeholder="北京市朝阳区朝阳路58号">
                    <template slot="prepend">{{$t('address')}}（{{$t('lang.zh')}}）</template>
                </el-input>
            </el-form-item>
            <!-- 地址（英文）  -->
            <el-form-item label="" class="ku-no-after">
                <el-input v-model="info.company.address.en" class="text-right" placeholder="beijing Zhoyang 58">
                    <template slot="prepend">{{$t('address')}}（{{$t('lang.en')}}）</template>
                </el-input>
            </el-form-item>
        </el-form>
        <div class="text-center pt-2 my-3">
            <el-button type="primary" @click="handleSubmit" class="w-75" round="" :disabled="company_status=='status.company_suspend'">{{$t('save.setting')}}</el-button>
        </div>

    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { add } from '@/api/my_company'
const st = process.client ? require('@/utils/scroll-to') : undefined
export default {
    name: "CompanyInfomation",
    components: {},
    data() {
        return {
            info: {
                company: {
                    id: this.$store.state.auth.company_id,
                    name: {
                        zh: this.$store.state.auth.company.name.zh,
                        en: this.$store.state.auth.company.name.en
                    },
                    phone: this.$store.state.auth.company.phone,
                    fax: this.$store.state.auth.company.fax,
                    country_code: this.$store.state.auth.company.country_code,
                    region_id: this.$store.state.auth.company.region_id,
                    city_id: this.$store.state.auth.company.city_id,
                    postal: this.$store.state.auth.company.postal,
                    address: {
                        zh: this.$store.state.auth.company.address.zh,
                        en: this.$store.state.auth.company.address.en
                    },
                    website: this.$store.state.auth.company.website,
                    second_domain: this.$store.state.auth.company.second_domain,
                },
                user: {
                    id: this.$store.state.auth.id,
                    name: {
                        zh: this.$store.state.auth.name.zh,
                        en: this.$store.state.auth.name.en,
                    },
                    gender: this.$store.state.auth.gender,
                    position: {
                        zh: this.$store.state.auth.position.zh,
                        en: this.$store.state.auth.position.en,
                    },
                    phone: this.$store.state.auth.phone,
                    email: this.$store.state.auth.email,
                }
            },
            rules: {
                "user.name.zh": [{ required: true, message: this.$t('valid.required', [this.$t('name.real')]), trigger: ['blur', 'change'] }, ],
                "user.name.en": [{ required: true, message: this.$t('valid.required', [this.$t('name.real')]), trigger: ['blur', 'change'] }, ],
                "company.name.en": [{ required: true, message: this.$t('valid.required', [this.$t('company')]), trigger: ['blur', 'change'] }, ],
                "company.name.zh": [{ required: true, message: this.$t('valid.required', [this.$t('company')]), trigger: ['blur', 'change'] }, ],
                "company.second_domain": [{ required: true, message: this.$t('valid.required', [this.$t('domain_2st')]), trigger: ['blur', 'change'] }, ],
                "company.phone": [
                    // { required: true, message: this.$t('valid.required', ["phone"]), trigger: ['blur', 'change'] },
                    // { type: "number", message: this.$t('valid.numeric', ["phone"]), trigger: ['blur', 'change'] },
                ],
                "user.phone": [
                    { required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur', 'change'] },
                    // { type: "number", message: this.$t('valid.numeric', ["phone"]), trigger: ['blur', 'change'] },
                ],
                "user.email": [
                    { type: "email", message: this.$t('valid.email', [this.$t('email')]), trigger: ['blur', 'change'] },
                ]
            },
            alert_title: "",
            error: {
                second_domain: ''
            }
        }
    },
    computed: {
        ...mapState('company', ['my_company_info']),
        ...mapGetters(['company_status'])    
    },
    methods: {
        ...mapActions('company', ['getMyCompanyInfo', 'setMyCompanyInfo']),
        // submit-buildquery
        handleSubmit() {
            localStorage.removeItem('mAntway_draft')
            this.$refs['dataForm'].validate((valid) => {
                const second_domain = `http://${this.info.company.second_domain}.web.antway.cn`
                if (!this.validURL(second_domain)) {
                    this.error.second_domain = this.$t('valid.url', [this.$t('domain_2st')])
                    return false
                } else this.error.second_domain = ''
                if (valid) {
                    let obj = this.info.user
                    let s_data = {
                        user: this.buildQuery(this.info.user),
                        company: this.buildQuery(this.info.company),
                    }
                    this.$store.dispatch("common/setLoading")
                    add(s_data).then(res => {
                            this.$notify({
                                title: this.$t('success'),
                                message: this.$t('success.updated'),
                                type: 'success'
                            });
                            this.setMyCompanyInfo(res)
                        }).catch(error => {
                            if (Array.isArray(error)) {
                                this.alert_title = error.join('\n')
                            }
                            st.scrollTo(0)
                            this.$notify({
                                title: this.$t('error'),
                                message: this.$t('error'),
                                type: 'error'
                            });
                        })
                        .finally(() => {
                            this.$store.dispatch("common/setLoading", false)
                        })
                } else {
                    return false;
                }
            });
        },
        updateMobileEmail(mobile_email) {
            const draft = Object.assign({}, this.info)
            delete draft.user[mobile_email]
            localStorage.setItem('mAntway_draft', JSON.stringify(draft))
            this.$router.push({ path: `/my/profile_update/${mobile_email}` })
        }
    },
    mounted() {
        const draft = localStorage.getItem('mAntway_draft')
        if (draft) {
            this.info = Object.assign(this.info, JSON.parse(draft))
        } else {
            this.getMyCompanyInfo().then(res => {
                let info = JSON.parse(JSON.stringify(res))
                info.company.description = {
                    zh: this.gsv(['description', 'zh'], info.company) || '',
                    en: this.gsv(['description', 'en'], info.company) || ''
                }
                info.company.factory_addr = {
                    zh: this.gsv(['factory_addr', 'zh'], info.company) || '',
                    en: this.gsv(['factory_addr', 'en'], info.company) || ''
                }
                info.company.major_brand = {
                    zh: this.gsv(['major_brand', 'zh'], info.company) || '',
                    en: this.gsv(['major_brand', 'en'], info.company) || ''
                }
                info.company.name = {
                    zh: this.gsv(['name', 'zh'], info.company) || this.gsv(['company_name', 'zh'], res.user) || '',
                    en: this.gsv(['name', 'en'], info.company) || this.gsv(['company_name', 'en'], res.user) || ''
                }
                info.company.address = {
                    zh: this.gsv(['address', 'zh'], info.company) || this.gsv(['company_addr'], res.user) || '',
                    en: this.gsv(['address', 'en'], info.company) || this.gsv(['company_addr'], res.user) || ''
                }
                info.company.website = this.gsv(['website'], info.company) || this.gsv(['company_website'], res.user) || ''
                info.company.country_code = this.gsv(['country_code'], info.company) || this.gsv(['company_country_code'], res.user) || ''
                info.company.region_id = this.gsv(['region_id'], info.company) || this.gsv(['company_region_id'], res.user) || ''
                info.company.city_id = this.gsv(['city_id'], info.company) || this.gsv(['company_city_id'], res.user) || ''

                const fax_v = info.company.fax.replace(/['86',+,-]+/g, '')
                const fax_v1 = res.user.company_fax.replace(/['86',+,-]+/g, '')
                if (!fax_v && fax_v1) info.company.fax = res.user.company_fax

                const phone_v = info.company.phone.replace(/['86',+,-]+/g, '')
                const phone_v1 = res.user.company_phone.replace(/['86',+,-]+/g, '')
                if (!phone_v && phone_v1) info.company.phone = res.user.company_phone

                this.info = info

            })
        }
    }
}
</script>
