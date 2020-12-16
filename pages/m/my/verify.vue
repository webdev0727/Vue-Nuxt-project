<template>
<div>
    <kuc-page-header :title="$t('want.certification')"></kuc-page-header>
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" class="bg-white px-2 mt-2">
        <!-- 姓名 prop="name_en" -->
        <el-form-item>
            <el-input v-model="info.name" class="text-right" placeholder="王希孟">
                <template slot="prepend">{{$t('name.real')}}</template>
            </el-input>
        </el-form-item>
                
        <ku-sex v-model="info.gender"/>
        <ku-line />

        <el-form-item label="">
            <el-input v-model="info.position" class="text-right" placeholder="经理">
                <template slot="prepend">{{$t('duty_position')}}</template>
            </el-input>
        </el-form-item>

        <el-form-item label="">
            <el-input v-model="info.company" class="text-right" placeholder="公司">
                <template slot="prepend">{{$t('company')}}</template>
            </el-input>
        </el-form-item>

        <!-- 座机 -->
        <el-form-item>
            <ku-input-fax v-model="info.landline" title="landline" key="landine"></ku-input-fax>
        </el-form-item>

        <!-- 传真 fax -->
        <el-form-item label="">
            <ku-input-fax v-model="info.fax" key="fax"></ku-input-fax>
        </el-form-item>

        <!-- 手机  -->
        <el-form-item prop="contact_mobile">
            <el-input v-model="info.phone" class="text-right" placeholder="156-867-660660" type="number">
                <ku-mobile slot="prepend" :mobile_code.sync="info.phone_prefix" />
            </el-input>
        </el-form-item>

        <!-- 邮箱  -->
        <el-form-item label="">
            <el-input v-model="info.email" class="text-right" placeholder="happy@sina.com">
                <template slot="prepend">{{$t('email')}}</template>
            </el-input>
        </el-form-item>

        <!-- 公司网址  -->
        <el-form-item label="">
            <el-input v-model="info.address" class="text-right" :placeholder="$t('company.www')">
                <template slot="prepend">{{$t('company.www')}}</template>
            </el-input>
        </el-form-item>

        <!-- 国家地区 -->
        <ku-input-location :country_id.sync="info.country_id" :region_id.sync="info.region_id" :city_id.sync="info.city_id" />
        <ku-line />
        <!-- detail address -->
        <el-form-item label="">
            <el-input v-model="info.website" class="text-right" placeholder="北京市朝阳区朝阳路58号">
                <template slot="prepend">{{$t('address.d')}}</template>
            </el-input>
        </el-form-item>

        <el-form-item label="" class="ku-no-after">
            <el-input v-model="info.postal_code" class="text-right" :placeholder="$t('company.www')">
                <template slot="prepend">{{$t('pc')}}</template>
            </el-input>
        </el-form-item>
    </el-form>
    <div class="text-center py-4">
        <el-button type="primary" round class="w-75" @click="handleSubmit">{{$t('submit.verify')}}</el-button>
    </div>
</div>
</template>

<script>
export default {
    middleware: 'authenticated',
    name: "BuyerGroupNewEdit",
    components: {  },
    data() {
        return {
            type: this.$route.params.id,
            info: {
                name: this.$store.state.auth.name.zh,
                account: '',
                gender: this.$store.state.auth.gender,
                company: this.$store.state.auth.company_name.zh,
                position: '',
                landline: '',
                fax: '',
                mobile: '',
                phone: this.$store.state.auth.phone,
                phone_prefix: '86',
                verify_code: '',
                friend_name: '',
                mobile: '',
                email: this.$store.state.auth.email,
                address: '',
                postal_code: '',
                country_id: 1,
                region_id: '',
                ciry_id: ''
            },
            rules: {
                account: [{ required: true, message: this.$t('valid.required', [this.$t('account')]), trigger: ['blur', 'change'] }, ],
                email: [{ type: 'email', message: this.$t('valid.email', [this.$t('email')]), trigger: ['blur', 'change'] }, ],
                mobile: [{ required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur', 'change'] },
                    { min: 11, max: 15, message: this.$t('valid.between.string', [this.$t('mobile'), 11, 15]), trigger: ['blur', 'change'] },
                ]
            },
        }
    },
    async asyncData({ params, route }) {

    },
    computed: {},
    methods: {
        handleSubmit() {
            this.$notify({
                title: this.$t('success'),
                message: this.$t('success.add'),
                type: 'success'
            });
            // this.$router.push({ path: '/my/buy/supplier' })
        },
    }
}
</script>
