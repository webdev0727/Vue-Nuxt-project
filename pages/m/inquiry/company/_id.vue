<template>
<div>
    <kuc-page-header :title="$t('want.xunpan')"></kuc-page-header>
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0">
        <div class="bg-white mt-1">
            <div class="p-2">
                <div class="p-2 bg-darkF7">
                    <div class="text-dark6 font-09 ml-1 flex-1 pr-3">
                        <div class="d-flex">
                            <p class="item-key pr-2">{{$t('company')}}: </p>
                            <p>{{company_info.name}}</p>
                        </div>
                        <div class="d-flex">
                            <p class="item-key pr-2">{{$t('recipient')}}: </p>
                            <p>{{company_info.user}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-2 el-label-input-contaner custom-input-container">
                <ku-line />
                <el-form-item prop="title">
                    <el-input v-model="info.title" class="text-right" :placeholder="$t('xunpan_about', [company_info.name])">
                        <template slot="prepend">{{$t('topic')}}</template>
                    </el-input>
                </el-form-item>

                <!-- description -->
                <el-form-item prop="description" class="my-1">
                    <p>{{$t('desc.d')}}</p>
                    <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" maxlength="500" show-word-limit v-model="info.description" :placeholder="$t('form.say')"></el-input>
                </el-form-item>

                <!-- 您的公司 -->
                <el-form-item>
                    <el-input v-model="info.contact_company" class="text-right" placeholder="得力">
                        <template slot="prepend">{{$t('your')}}{{$t('company')}}</template>
                    </el-input>
                </el-form-item>

                <!-- 您的姓名 -->
                <el-form-item prop="contact_name">
                    <el-input v-model="info.contact_name" class="text-right" placeholder="086-660660">
                        <template slot="prepend">{{$t('your')}}{{$t('name')}}</template>
                    </el-input>
                </el-form-item>

                <!--  landline -->
                <el-form-item>
                    <el-input v-model="info.contact_phone" class="text-right" placeholder="086-660660">
                        <template slot="prepend">{{$t('phone.contact')}}</template>
                    </el-input>
                </el-form-item>

                <!-- mobile -->
                <el-form-item prop="contact_mobile">
                    <el-input v-model="info.contact_mobile" class="text-right" placeholder="156-867-660660">
                        <ku-mobile slot="prepend" :mobile_code.sync="phone_prefix" title="mobile.contact" />
                    </el-input>
                </el-form-item>
                <!-- email -->
                <el-form-item prop="contact_email" class='ku-no-after'>
                    <el-input v-model="info.contact_email" class="text-right" placeholder="happy@sina.com">
                        <template slot="prepend">{{$t('e_mail')}}</template>
                    </el-input>
                </el-form-item>

            </div>
        </div>
    </el-form>
    <div class="text-center mt-3 mb-4">
        <el-button type="primary" @click="handleSubmit" class="w-75" round="">{{$t('btn.send_msg')}}</el-button>
    </div>

</div>
</template>

<script>
import { add } from '@/api/inquire'
import { getDetail } from "~/api/company"
export default {
    middleware: ['authenticated', 'member_0'],
    name: "MyInquireCompany",
    components: {},
    data() {
        return {
            info: {
                company_id: this.$route.params.id,
                product_id: 0,
                title: '',
                description: "",
                contact_company: this.gsv([this.$i18n.locale], this.$store.state.auth.company_name),
                contact_name: this.$store.state.auth.name[this.$i18n.locale],
                contact_phone: this.$store.state.auth.phone,
                contact_mobile: this.$store.state.auth.phone,
                contact_email: this.$store.state.auth.email,
                inquery_items: []
            },
            company_info: {
                name: this.$route.query.c_n,
                user: this.$route.query.c_u
            },
            phone_prefix: "86",
            temp: {},
            rules: {
                title: [{ required: true, message: this.$t('valid.required', [this.$t('title')]), trigger: ['blur', 'change'] }, ],
                contact_name: [{ required: true, message: this.$t('valid.required', [this.$t('contact.p')]), trigger: ['blur', 'change'] }, ],
                contact_mobile: [{ required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur', 'change'] }, ],
                contact_email: [{ type: 'email', message: this.$t('valid.email', [this.$t('email')]), trigger: ['blur', 'change'] }, ],
                description: [{ required: true, message: this.$t('valid.required', [this.$t('desc')]), trigger: ['blur', 'change'] }, ],
            },
        }
    },
    methods: {
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$store.dispatch("common/setLoading")
                    add(this.info).then(() => {
                            this.$notify({
                                title: this.$t('success'),
                                message: this.$t('success.add'),
                                type: 'success'
                            });
                            // this.$router.push({ path: '/product_manage' })
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
    created() {
        if (!this.$route.query.c_u || !this.$route.query.c_n) {
            getDetail(this.$route.params.id).then(res => {
                this.company_info.name = this.gsv(['name', this.$i18n.locale], res.company)
                this.company_info.user = this.gsv(['user', 'name', this.$i18n.locale], res.company)
            })
        }
    }

}
</script>

<style lang="scss" scoped>
.item-key {
    width: 6rem;
    text-align: right;
}
</style>
