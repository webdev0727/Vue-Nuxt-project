<template>
<div>
    <kuc-page-header :title="$t('want.xunpan')"></kuc-page-header>
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0">
        <div class="bg-white mt-1">
            <div class="p-2">
                <div class="p-2 d-flex" style="background-color:#F7F7F7;">
                    <img :src="getImg1(product_info.assets)" alt=" " width="60" height="60" class="rounded bg-white">
                    <div class="text-dark6 font-09 ml-1 flex-1 pr-3">
                        <div class="d-flex align-items-center">
                            <p class="item-key text-nowrap">{{$t('product')}}{{$t('name1')}}：</p>
                            <p>{{gsv([$i18n.locale], product_info.name)}}</p>
                        </div>
                        <div class="d-flex">
                            <p class="item-key">{{$t('company')}}：</p>
                            <p>{{gsv(['name', $i18n.locale], product_info.company)}}</p>
                        </div>
                        <div class="d-flex">
                            <p class="item-key">{{$t('recipient')}}：</p>
                            <p>{{gsv(['name', $i18n.locale], product_info.user)}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-2 el-label-input-contaner custom-input-container">
                <ku-line />
                <el-form-item prop="title">
                    <el-input v-model="info.title" class="text-right" :placeholder="$t('xunpan_about', [gsv([$i18n.locale], product_info.name)])">
                        <template slot="prepend">{{$t('topic')}}</template>
                    </el-input>
                </el-form-item>

                <div class="checkbox-button-container">
                    <p class="my-3">{{$t('want.i')}}</p>
                    <el-checkbox-group v-model="info.inquery_items" class="d-flex flex-wrap justify-content-between">
                        <!-- <el-checkbox-button v-for="hopeO in inquiry_items" :label="hopeO.id" :key="hopeO.id">{{hopeO.name}}</el-checkbox-button> -->
                        <el-col :span="12" v-for="item in inquiry_items" :key="item.id" class="mb-2">
                            <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
                        </el-col>
                    </el-checkbox-group>
                </div>

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
                    <ku-input-fax v-model="info.contact_phone" title="landline" key="landine"></ku-input-fax>
                </el-form-item>

                <!-- mobile -->
                <el-form-item prop="contact_mobile">
                    <el-input v-model="info.contact_mobile" class="text-right" placeholder="156-867-660660">
                        <ku-mobile slot="prepend" :mobile_code.sync="info.phone_pre" />
                    </el-input>
                </el-form-item>
                <!-- email -->
                <el-form-item prop="contact_email" class='ku-no-after'>
                    <el-input v-model="info.contact_email" class="text-right" placeholder="happy@sina.com">
                        <template slot="prepend">{{$t('email')}}</template>
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
import { getDetail } from '@/api/product'
import { mapState, mapActions, mapGetters } from 'vuex'
import { add } from '@/api/inquire'

export default {
    middleware: ['authenticated', 'member_0'],
    name: "MyInquire",
    components: {},
    data() {
        return {
            product_info: {},
            info: {
                product_id: this.$route.params.id,
                title: '',
                description: "",
                company_id: '',
                contact_company: this.gsv(['name', this.$i18n.locale], this.$store.state.auth.company) || this.gsv([this.$i18n.locale], this.$store.state.auth.company_name) || '',
                contact_name: this.$store.state.auth.name[this.$i18n.locale],
                contact_phone: this.gsv(['phone'], this.$store.state.auth.company) || this.$store.state.auth.company_phone || '',
                contact_mobile: this.$store.state.auth.phone,
                contact_email: this.$store.state.auth.email,
                inquery_items: [],
                phone_pre: this.$store.state.auth.phone_prefix || '86'
            },
            temp: {},
            rules: {
                title: [{ required: true, message: this.$t('valid.required', [this.$t('title')]), trigger: ['blur', 'change'] }, ],
                contact_name: [{ required: true, message: this.$t('valid.required', [this.$t('contact.p')]), trigger: ['blur', 'change'] }, ],
                contact_mobile: [
                    { required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur', 'change'] },
                    { min: 11, message: this.$t('valid.min.string', [this.$t('mobile'), 11]), trigger: ['blur', 'change'] },
                ],
                contact_email: [{ type: 'email', message: this.$t('valid.required', [this.$t('email')]), trigger: ['blur', 'change'] }, ],
                description: [{ required: true, message: this.$t('valid.required', [this.$t('desc')]), trigger: ['blur', 'change'] }, ],
            },
        }
    },
    computed: {
        ...mapState('common', {
            inquiry_items: state => state.list.inquiry_items,
        }),
        ...mapGetters('common', ['cate2']),
    },
    methods: {
        ...mapActions('common', ['getUnitsList']),
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$store.dispatch("common/setLoading")
                    let da = Object.assign({}, this.info)
                    da.contact_mobile = this.info.phone_pre + this.info.contact_mobile
                    delete da.phone_pre
                    add(da).then(() => {
                            this.$notify({
                                title: this.$t('success'),
                                message: this.$t('success.add'),
                                type: 'success'
                            });
                            this.goBack()
                        })
                        .catch(error => {
                            console.log("Api failed!", error)
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
        getDetail(this.$route.params.id).then(res => {
            this.product_info = res.product
            this.info.company_id = res.product.company_id
        })
        if (!this.inquiry_items.length) {
            this.getUnitsList(['inquiry_items'])
        }
    },

}
</script>

<style lang="scss" scoped>
.item-key {
    width: 6rem;
    text-align: right;
}
</style>
