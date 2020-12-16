<template>
<div>
    <kuc-page-header title="我要报名"></kuc-page-header>
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0">
        <div class="bg-white mt-2 px-2">

            <!-- name -->
            <el-form-item prop="name">
                <el-input v-model="info.name" class="text-right mt-1" placeholder="王希孟">
                    <template slot="prepend">{{$t('name.real')}}</template>
                </el-input>
            </el-form-item>
            <!-- sex -->            
            <ku-sex v-model="info.gender"/>
            <ku-line />
            <!--  position in company -->
            <el-form-item label="">
                <el-input v-model="info.position" class="text-right" placeholder="经理">
                    <template slot="prepend">{{$t('duty_position')}}</template>
                </el-input>
            </el-form-item>

            <!--  company -->
            <el-form-item label="">
                <el-input v-model="info.company" class="text-right" placeholder="得力">
                    <template slot="prepend">{{$t('company')}}</template>
                </el-input>
            </el-form-item>

            <!--  landline -->            
            <el-form-item>
                <ku-input-fax title="landline" v-model="info.phone"></ku-input-fax>
            </el-form-item>

            <!-- mobile -->
            <el-form-item prop="mobile">
                <el-input v-model="info.mobile" class="text-right" placeholder="156-867-660660" type="number">
                    <ku-mobile slot="prepend" :mobile_code.sync="info.phone_prefix" />
                </el-input>
            </el-form-item>

            <!-- email -->
            <el-form-item prop="email">
                <el-input v-model="info.email" class="text-right" placeholder="happy@sina.com">
                    <template slot="prepend">{{$t('email')}}</template>
                </el-input>
            </el-form-item>
            
            <!-- 国家地区 -->
            <ku-input-location 
                :country_id.sync="info.country_id" 
                :region_id.sync="info.region_id" 
                :city_id.sync="info.city_id" 
                />
            <ku-line />  

            <!-- detail address -->
            <el-form-item label="">
                <el-input v-model="info.address" class="text-right" placeholder="北京市朝阳区朝阳路58号">
                    <template slot="prepend">{{$t('address.d')}}</template>
                </el-input>
            </el-form-item>
        </div>

        <div class="bg-white mt-2 px-2">
            <el-form-item prop="signup_count">
                <el-input v-model="info.signup_count" class="text-right" placeholder="10" readonly>
                    <template slot="prepend">{{$t('applicants')}}</template>
                    <template slot="append">人</template>
                </el-input>
            </el-form-item>
            <div class="d-flex">
                <p class="text-nowrap pr-2 py-input">{{$t('applicants_name')}}</p>
                <div class="flex-1">
                    <div v-for="ii in info.signup_count" :key="ii">
                        <div class="d-flex align-items-center border-bottom">
                            <el-input v-model="info.signup_names[ii-1]" placeholder="王希孟">
                            </el-input>
                            <p class="text-nowrap py-input text-danger" v-if="ii==info.signup_count" @click="handleAddSingup(ii)">{{$t("add")}}</p>
                            <p class="text-nowrap py-input text-danger" v-else @click="handleRemoveSingup(ii-1)">
                                <i class="el-icon-close"></i>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="el-form-item__error" v-if="error.count">{{error.count}}</div>

        </div>
    </el-form>

    <div class="text-center my-4">
        <el-button type="primary" @click="handleSubmit" class="w-75" round="">{{$t('btn.sign_up')}}</el-button>
    </div>
</div>
</template>

<script>
import { action } from "@/api/discovery"
export default {
    middleware: 'authenticated',
    name: "Baoming",
    components: {},
    data() {
        return {
            processIndex: 2,
            info: {
                name: this.gsv([this.$i18n.locale], this.$store.state.auth.name),
                gender: this.$store.state.auth.gender,
                position: this.gsv([this.$i18n.locale], this.$store.state.auth.position),
                company: this.gsv(['name', this.$i18n.locale], this.$store.state.auth.company) || this.gsv([this.$i18n.locale], this.$store.state.auth.company_name) || '',
                phone: this.$store.state.auth.company.phone || this.$store.state.auth.company_phone || '',
                mobile: this.$store.state.auth.phone,
                phone_prefix: this.$store.state.auth.phone_prefix || '86',
                email: this.$store.state.auth.email,
                country_id: this.$store.state.auth.company.country_id || this.$store.state.auth.company_country_id,
                region_id: this.$store.state.auth.company.region_id || this.$store.state.auth.company_region_id,
                city_id: this.$store.state.auth.company.city_id || this.$store.state.auth.company_city_id,
                address: this.gsv([this.$i18n.locale], this.$store.state.auth.company.address) || this.$store.state.auth.company_addr || '',
                signup_count: 1,
                signup_names: [""],
            },
            rules: {
                name: [{ required: true, message: this.$t('valid.required', [this.$t('name')]), trigger: ['blur', 'change'] }, ],
                signup_names: [{ required: true, message: this.$t('valid.required', [this.$t('applicants_name')]), trigger: ['blur', 'change'] }, ],
                email: [{ type: 'email', message: this.$t('valid.email', [this.$t('email')]), trigger: ['blur', 'change'] }, ],
                mobile: [{ required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur', 'change'] }, ]
            },
            error: {
                count: false
            }
        }
    },
    methods: {
        handleItemClick(command) {
            this.info.gender = command
        },
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                const signup_names = this.info.signup_names.filter(xx => xx != '')
                if (!signup_names.length) {
                    this.error.count = this.$t('valid.min.array', [this.$t('applicants_name'), 1])
                    return false
                } else {
                    this.error.count = false
                }
                if (valid) {
                    // info save api
                    let form_da = Object.assign({}, this.info)
                    form_da.signup_names = signup_names.join(",")
                    console.log(form_da)
                    this.$store.dispatch("common/setLoading")
                    action('signup', this.$route.params.id, form_da).then(res => {
                        this.$notify({
                            title: this.$t('success'),
                            message: this.$t('success.msg'),
                            type: 'success'
                        });
                        this.goBack()
                    }).finally(() => {
                        this.$store.dispatch("common/setLoading", false)
                    })
                } else {
                    return false;
                }
            });

        },
        handleAddMan() {

        },
        handleRemoveSingup(ind) {
            // delete this.info.signup_names[ind]
            let new_arr = []
            this.info.signup_names.forEach((element, ii) => {
                if (ii != ind)
                    new_arr.push(element)
            });
            this.info.signup_names = new_arr
            this.info.signup_count--
        },
        handleAddSingup(ii) {
            this.info.signup_names.push('')
            this.info.signup_count++
        }
    }
}
</script>