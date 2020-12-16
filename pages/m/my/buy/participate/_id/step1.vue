<template>
<div>
    <div class="bg-white p-3">
        <ProcessBar3 :status='1' :items='process_items' />
        <el-alert v-if="inviter_name" :title="$t('msg.invited_by', [inviter_name])" type="info" center show-icon ></el-alert>
    </div>
    <ku-line />
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" class="bg-white px-2">
        <!-- 真实姓名（中文） -->
        <el-form-item prop="name">
            <el-input v-model="info.name" class="text-right" placeholder="王希孟">
                <template slot="prepend">{{$t('name.real')}}</template>
            </el-input>
        </el-form-item>

        <!-- 性别 sex -->
        <ku-sex v-model="info.gender" />
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

        <!-- 座机 -->
        <el-form-item prop="company.phone">
            <ku-input-fax v-model="info.phone" title="landline" key="landine"></ku-input-fax>
        </el-form-item>

        <!-- 传真 fax -->
        <el-form-item label="">
            <ku-input-fax v-model="info.fax" key="fax"></ku-input-fax>
        </el-form-item>

        <!-- 手机  -->
        <el-form-item prop="mobile">
            <el-input v-model="info.mobile" class="text-right" placeholder="156-867-660660" type="number" readonly>
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
            <el-input v-model="info.website" class="text-right" :placeholder="$t('company.www')">
                <template slot="prepend">{{$t('company.www')}}</template>
            </el-input>
        </el-form-item>

        <!-- 国家地区 -->
        <ku-input-location :country_id.sync="info.country_id" :region_id.sync="info.region_id" :city_id.sync="info.city_id" />
        <ku-line />

        <!-- 地址（中文）  -->
        <el-form-item label="" class="ku-no-after">
            <el-input v-model="info.address" class="text-right" placeholder="北京市朝阳区朝阳路58号">
                <template slot="prepend">{{$t('address.d')}}</template>
            </el-input>
        </el-form-item>

    </el-form>

    <div class="text-center my-3">
        <el-button type="primary" @click="handleSubmit" class="w-75" round="">{{this.$t('next')}}</el-button>
    </div>

    <div class="text-center mb-5">
        <p v-if="$i18n.locale=='en'">After completed, you can revise <span class="text-danger">the information</span> in the Company Information.</p>
        <p v-else>认证完成，你可以在 <span class="text-danger">企业相关</span>里面修改相应资料</p>
    </div>
</div>
</template>

<script>
import ProcessBar3 from "@/components/ProcessBar3"

import { mapState, mapActions, mapGetters } from 'vuex'
import { getInfo } from "@/api/user"
import { applyStep } from "@/api/expo"

export default {
    scrollToTop: true,
    name: "BuyParticipate_Step1",
    components: { ProcessBar3 },
    data() {
        return {
            loaded: false,
            process_items: [this.$t('step.info'), this.$t('investigation'), this.$t('step.auditing'), this.$t('badge_apply')],
            activeIndex: '1',
            inviter_name: '',
            info: {
                expo_id: this.$route.params.id,
                name: this.gsv([this.$i18n.locale], this.$store.state.auth.name),
                gender: this.$store.state.auth.gender,
                position: this.gsv([this.$i18n.locale], this.$store.state.auth.position),
                company: this.gsv(['name', this.$i18n.locale], this.$store.state.auth.company) || this.gsv([this.$i18n.locale], this.$store.state.auth.company_name) || '',
                phone: this.gsv(['fax'], this.$store.state.auth.company) || this.$store.state.auth.company_fax || '',
                fax: this.gsv(['fax'], this.$store.state.auth.company) || this.$store.state.auth.company_fax || '',
                mobile: this.$store.state.auth.phone,
                phone_prefix: this.$store.state.auth.phone_prefix || '86',
                email: this.$store.state.auth.email,
                address: this.gsv(['address', this.$i18n.locale], this.$store.state.auth.company) || this.gsv([this.$i18n.locale], this.$store.state.auth.company_addr),
                country_id: this.$store.state.auth.company.country_id || this.$store.state.auth.company_country_id || 1,
                // country_code: 'CHN',
                city_id: this.$store.state.auth.company.city_id || this.$store.state.auth.company_city_id || '',
                region_id: this.$store.state.auth.company.region_id || this.$store.state.auth.company_region_id || '',
                website: this.$store.state.auth.company.website || this.$store.state.auth.company_website || ''

            },
            rules: {
                name: [{ required: true, message: this.$t('valid.required', [this.$t('name.real')]), trigger: ['blur'] }, ],
                mobile: [{ required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur'] }, ],
                company: [{ required: true, message: this.$t('valid.required', [this.$t('company')]), trigger: ['blur'] }, ],
            },
        }
    },
    computed: {
        ...mapState('expo', ["step_buyer"]),
    },
    methods: {
        ...mapActions('expo', ['getBuyerStatus']),
        updateMobileEmail(mobile_email) {
            const draft = Object.assign({}, this.info)
            const kkey = mobile_email == 'phone' ? 'mobile' : 'email'
            delete draft[kkey]
            localStorage.setItem('mAntway_draft_buy', JSON.stringify(draft))
            this.$router.push({ path: `/my/profile_update/${mobile_email}` })
        },
        handleSubmit() {
            localStorage.removeItem('mAntway_draft_buy')
            this.$router.push({ path: '/my/buy/participate/' + this.$route.params.id + '/step2' })
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    // info save api                    
                    applyStep('buyer', 0, this.info).then(async (re) => {
                        await this.getBuyerStatus(this.$route.params.id)
                        this.$router.push({ path: '/my/buy/participate/' + this.$route.params.id + '/step2' })
                    })
                } else {
                    return false;
                }
            });
        },       

    },
    mounted() {
        const draft = localStorage.getItem('mAntway_draft_buy')
        if (draft) {
            this.info = Object.assign(this.info, JSON.parse(draft))
        } else {
            getInfo(this.$store.state.auth.id).then(({ user }) => {
                this.loaded = true
                this.info.position = this.gsv([this.$i18n.locale], user.position)
                this.info.company = this.gsv(['name', this.$i18n.locale], user.company)
                this.info.fax = this.gsv(['fax'], user.company) || user.company_fax || ''
                this.info.phone = this.gsv(['phone'], user.company) || user.company_phone || ''
                this.info.mobile = user.phone || ''
                this.info.phone_prefix = user.phone_prefix
                this.info.website = this.gsv(['website'], user.company) || user.company_website || ''
                this.info.address = this.gsv(['address', this.$i18n.locale], user.company) || this.gsv([this.$i18n.locale], user.company_addr)
                this.info.country_id = this.gsv(['country', 'id'], user.company) || user.company_country_id
                // this.info.country_code = user.company.country_code
                this.info.region_id = user.company.region_id || user.company_region_id || ''
                this.info.website = user.company.website || user.company_website || ''

            })
        }

        // Invite 
        let invite_da = localStorage.getItem('mAntway_invite')
        if (invite_da) invite_da = JSON.parse(invite_da)
        if (this.$route.params.id == invite_da.expo_id) {
            if (this.$store.state.auth.id != invite_da.inviter_id) {
                this.info.inviter_id = invite_da.inviter_id
                this.inviter_name = this.gsv(['inviter_name', this.$i18n.locale], invite_da)                        
            }
        }
    }
}
</script>
