<template>
<div>
    <kuc-page-header :title="$t('want.pin')"></kuc-page-header>
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" v-if="product_info">
        <div class="bg-white mt-2 pb-2">
            <div class="p-2">
                <div class="p-2 d-flex" style="background-color:#F7F7F7;">
                    <img :src="getImg1(product_info.assets)" alt=" " width="60" height="60" class="rounded">
                    <div class="text-dark6 font-09 ml-3 flex-1 pr-3">
                        <p>{{$t('company.name')}}：{{gsv(['name', $i18n.locale], product_info.company)}}</p>
                        <div class="d-flex">
                            <p class="text-nowrap">{{$t('product')}}{{$t('name')}}：</p>
                            <p>{{gsv([$i18n.locale], product_info.name)}}</p>
                        </div>
                        <div class="d-flex justify-content-between">
                            <p> {{$t('product')}}{{$t('price')}}：<span class="text-danger">￥{{product_info.price}}</span> </p>
                            <p>{{$t('moq')}}：<span class="text-danger">{{product_info.min_quantity}}</span>
                                {{gsv(['name', $i18n.locale], product_info.unit)}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-2">
                <!-- order quantity -->
                <ku-line />
                <el-form-item prop="quantity">
                    <el-input v-model.number="info.quantity" class="text-right" :placeholder="$t('form.input1')" type="number">
                        <template slot="prepend">{{$t('order_q')}}</template>
                        <span slot="suffix" class="el-input__icon"> {{gsv(['name', $i18n.locale], product_info.unit)}}</span>
                    </el-input>
                </el-form-item>

                <!-- 联系人 contact person-->
                <el-form-item prop="contact_name">
                    <el-input v-model="info.contact_name" class="text-right" placeholder="086-660660">
                        <template slot="prepend">{{$t('contact.p')}}</template>
                    </el-input>
                </el-form-item>

                <!--  landline -->
                <el-form-item>
                    <el-input v-model="info.contact_phone" class="text-right" placeholder="086-660660">
                        <template slot="prepend">{{$t('phone')}}</template>
                    </el-input>
                </el-form-item>

                <!-- mobile -->
                <el-form-item prop="mobile">
                    <el-input v-model="info.mobile" class="text-right" placeholder="156-867-660660" type="number">
                        <ku-mobile slot="prepend" :mobile_code.sync="phone_prefix" />
                    </el-input>
                </el-form-item>

                <!-- email -->
                <el-form-item prop="contact_email">
                    <el-input v-model="info.contact_email" class="text-right" placeholder="happy@sina.com" readonly>
                        <template slot="prepend">{{$t('email')}}</template>
                    </el-input>
                </el-form-item>

                <!-- location -->
                <ku-input-location :country_id.sync="info.country_id" :region_id.sync="info.region_id" :city_id.sync="info.city_id" />
                <ku-line />

                <el-form-item>
                    <el-input v-model="info.contact_addr" class="text-right" :placeholder="$t('address')">
                        <template slot="prepend">{{$t('address.recieve')}}</template>
                    </el-input>
                </el-form-item>

                <!-- description -->
                <el-form-item class="my-1 pr-2" prop="contact_note">
                    <p>{{$t('remark')}}</p>
                    <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 15}" maxlength="500" show-word-limit v-model="info.contact_note"></el-input>
                </el-form-item>

            </div>
        </div>
    </el-form>
    <div class="text-center mt-3 mb-4">
        <el-button type="primary" @click="handleSubmit" class="w-75" round="">{{$t('btn.send_msg')}}</el-button>
    </div>
    <!-- reviews block 2 -->
    <ku-title-line class="px-2" v-if="$i18n.locale == 'zh'">
        已拼单<span class="text-danger py-1">{{bid_total_quantity}}</span>个，还差 <span class="text-danger">{{product_info.min_quantity - bid_total_quantity}}</span>个完成拼单
    </ku-title-line>
    <ku-title-line class="px-2" style="white-space: unset" v-else>
        Already shared <span class="text-danger py-1">{{bid_total_quantity}}</span> person, need <span class="text-danger">{{product_info.min_quantity - bid_total_quantity}}</span> more to complete the order
    </ku-title-line>
    <div class="bg-white mt-2">
        <div class="py-2 pl-2 bg-white">
            <div v-for="his in bid_list" :key='his.id' class="mt-2 py-1 history-item">
                <p>{{his.contact_name}} {{his.user_id == $store.state.auth.id ? `(${$t('my')})` : ''}}</p>
                <div class="d-flex justify-content-between text-dark9 font-08 mt-1 pr-2">
                    <p>{{parseTime(his.created_at) }}</p>
                    <p>{{his.quantity}}{{gsv(['unit', 'name', $i18n.locale], product_info)}}</p>
                </div>
            </div>
            <no-data v-if="!bid_list.length"></no-data>

        </div>
    </div>

</div>
</template>

<script>
import { getDetail } from '@/api/product'
import { add, historyPindanOfProduct } from '@/api/my_pindan'
export default {
    middleware: ['authenticated', 'member_0'],
    name: "CreatePinDan",
    components: {},
    data() {
        var rule_custom = (rule, value, callback) => {
            if (value > this.product_info.min_quantity) {
                callback(new Error(this.$t('valid.max.numeric', ["Name", this.product_info.min_quantity])));
            } else {
                callback();
            }
        };
        return {
            processIndex: 2,
            dialogImageUrl: '',
            dialogVisibleIMG: false,
            // dialogVisible: false,  
            product_info: {},
            bid_list: [],
            bid_total_quantity: 0,
            info: {
                product_id: parseInt(this.$route.params.id),
                quantity: 1,
                contact_note: '',
                contact_email: this.$store.state.auth.email,
                contact_name: this.gsv([this.$i18n.locale], this.$store.state.auth.name),
                contact_mobile: "",
                contact_phone: '',
                contact_addr: this.gsv([this.$i18n.locale], this.$store.state.auth.company_addr),
                country_id: this.$store.state.auth.company_country_id,
                region_id: this.$store.state.auth.company_region_id,
                city_id: this.$store.state.auth.company_city_id,
                mobile: this.$store.state.auth.phone
            },
            phone_prefix: this.$store.state.auth.phone_prefix,
            temp: {
                country: '',
                province: ''
            },
            rules: {
                quantity: [{ required: true, message: this.$t('valid.required', [this.$t('quantity')]), trigger: ['blur', 'change'] },
                    { type: "number", message: this.$t('valid.numeric', [this.$t('quantity')]), trigger: ['blur', 'change'] },
                    // { validator: rule_custom, trigger: 'blur' },
                ],
                contact_name: [{ required: true, message: this.$t('valid.required', [this.$t('name')]), trigger: ['blur', 'change'] }, ],
                contact_email: [{ type: 'email', message: this.$t('valid.email', [this.$t('email')]), trigger: ['blur', 'change'] }, ],
                mobile: [{ required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur', 'change'] },
                    { min: 11, max: 15, message: this.$t('valid.between.string', [this.$t('mobile'), 11, 15]), trigger: ['blur', 'change'] },
                ],
                contact_note: [{ required: true, message: this.$t('valid.required', [this.$t('remark')]), trigger: ['blur', 'change'] },
                    { min: 5, message: this.$t('valid.min.string', [this.$t('remark'), 5]), trigger: ['blur', 'change'] },
                ]
            },
        }
    },
    methods: {
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    // info save api
                    let f_data = Object.assign({}, this.info)
                    f_data.contact_mobile = "+" + this.phone_prefix + this.info.mobile
                    delete f_data.mobile
                    add(f_data).then(() => {
                        this.$notify({
                            title: this.$t('success'),
                            message: this.$t('success.add'),
                            type: 'success'
                        });
                        this.goBack();
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
        })
        historyPindanOfProduct(this.$route.params.id).then(res => {
            this.bid_list = res.pindan_list
            this.bid_total_quantity = res.total_quantity
        })
    },

}
</script>

<style lang="scss" scoped>
// scss variables
@import "@/assets/scss/config/_variables.scss";

.history-item {
    border-bottom: 1px solid #CCCCCC;

    &:last-child {
        border: none;
    }
}
</style>
