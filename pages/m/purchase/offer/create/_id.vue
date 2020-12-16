<template>
<div>
    <kuc-page-header :title="$t('want.quote')"></kuc-page-header>
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0">
        <div class="bg-white mt-2 pb-2">
            <div class="p-2">
                <!-- 是否有现货 -->
                <div class="align-items-center py-1 d-flex">
                    <p class="text-nowrap mr-2">{{$t('is_in_stock')}}</p>
                    <el-select v-model="info.in_stock" :placeholder="$t('select')" class="w-100 text-right" key="Yes_No_stock">
                        <el-option :label="$t('status.yes')" :value="1"></el-option>
                        <el-option :label="$t('status.no')" :value="0"></el-option>
                    </el-select>
                </div>
                <ku-line />

                <!-- 是否有现货 -->
                <div class="align-items-center py-1 d-flex">
                    <p class="text-nowrap mr-2">{{$t('can_provide_sample')}}</p>
                    <el-select v-model="info.can_provide_sample" :placeholder="$t('select')" class="w-100 text-right" key="Yes_No_sapmple">
                        <el-option :label="$t('status.yes')" :value="1"></el-option>
                        <el-option :label="$t('status.no')" :value="0"></el-option>
                    </el-select>
                </div>
                <ku-line />

                <!-- 是否可以OEM或ODM -->              
                <div class="align-items-center py-1 d-flex">
                    <p class="text-nowrap mr-2">{{$t('is_oem')}}</p>
                    <el-select v-model="info.is_oem" :placeholder="$t('select')" class="w-100 text-right" key="Yes_No_OEM">
                        <el-option :label="$t('status.yes')" :value="1"></el-option>
                        <el-option :label="$t('status.no')" :value="0"></el-option>
                    </el-select>
                </div>                
                <ku-line />
                <!-- 我的报价 price-->
                <el-form-item label="" prop="price">
                    <div class="d-flex">
                        <el-input v-model="info.price" class="text-right" :placeholder="$t('form.input1')">
                            <template slot="prepend">{{$t('my')}}{{$t('quote')}}</template>
                        </el-input>                        
                        <el-select v-model="info.unit_id" :placeholder="$t('select')" class="text-right" style="width:7rem">
                            <el-option v-for="item in price_units" :key="item.id" :label="gsv([$i18n.locale], item.name)" :value="item.id"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                

                <!-- description -->
                <el-form-item class="my-1 pr-2" prop="description">
                    <p>{{$t('quote')}}{{$t('desc')}}</p>
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" maxlength="300" show-word-limit v-model="info.description"></el-input>
                </el-form-item>

                <!-- file upload -->
                <div class="d-flex align-items-center my-2">
                    <p class="mr-2 text-nowrap">{{$t('upload.file')}}</p>
                    <ku-upload :f_data.sync="img_data" name="files[]" :filelist='img_pre' :limit=5 />
                </div>
            </div>
        </div>

        <!-- block 2 -->
        <div class="bg-white mt-2 px-2">
            <!-- name -->
            <el-form-item prop="contact_name">
                <el-input v-model="info.contact_name" class="text-right" placeholder="王希孟" readonly>
                    <template slot="prepend">{{$t('name')}}</template>
                </el-input>
            </el-form-item>

            <!-- sex -->
            <ku-sex v-model="info.contact_gender" readonly />
            <ku-line />
            <!--  company -->
            <el-form-item label="">
                <el-input v-model="info.contact_company" class="text-right mt-1" placeholder="得力" readonly>
                    <template slot="prepend">{{$t('company')}}</template>
                </el-input>
            </el-form-item>

            <!--  landline -->
            <el-form-item label="">
                <el-input v-model="info.contact_phone" class="text-right mt-1" placeholder="086-660660" readonly>
                    <template slot="prepend">{{$t('phone')}}</template>
                </el-input>
            </el-form-item>

            <!-- mobile -->
            <el-form-item class="ku-no-after">
                <el-input v-model="info.contact_mobile" class="text-right" placeholder="156-867-660660" readonly>
                    <ku-mobile slot="prepend" :mobile_code.sync="mobile_prefix" />
                </el-input>
            </el-form-item>

        </div>
    </el-form>

    <div class="text-center my-5">
        <el-button type="primary" @click="handleSubmit" class="w-75" round="">{{$t('offer.now')}}</el-button>
    </div>

</div>
</template>

<script>
import { offer, myoffer } from '@/api/my_treasure'
export default {
    name: "MyQuote",
    middleware: ['authenticated', 'member_2'],
    components: {},
    data() {
        return {
            info: {
                purchase_id: this.$route.params.id,
                in_stock: 1,
                can_provide_sample: 1,
                is_oem: 1,
                price: '',
                unit_id: 1,
                description: '',
                contact_name: this.$store.state.auth.name[this.$i18n.locale],
                contact_gender: this.$store.state.auth.gender,
                contact_company: this.gsv([this.$i18n.locale], this.$store.state.auth.company_name),
                contact_mobile: this.$store.state.auth.phone,
                contact_phone: '',
            },
            mobile_prefix: this.$store.state.auth.phone_prefix,
            rules: {
                price: [{ required: true, message: this.$t('valid.required', [this.$t('price')]), trigger: ['blur'] }, ],
                description: [
                    { required: true, message: this.$t('valid.required', [this.$t('desc')]), trigger: ['blur'] },
                    { min: 5, message: this.$t('valid.min.string', [this.$t('desc'), 5]), trigger: ['blur', 'change'] },
                ],
                contact_name: [{ required: true, message: this.$t('valid.required', [this.$t('name')]), trigger: ['blur'] },
                    { min: 2, max: 15, message: this.$t('valid.between.string', [this.$t('name'), 2, 5]), trigger: ['blur', 'change'] },
                ],
                contact_company: [{ required: true, message: this.$t('valid.required', [this.$t('company')]), trigger: ['blur'] }, ],
                contact_mobile: [{ required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur'] },
                    { min: 11, max: 15, message: this.$t('valid.between.string', [this.$t('mobile'), 11, 15]), trigger: ['blur', 'change'] },
                ]
            },
            img_data: {},
            img_pre: [],
            price_units:[
                {
                    id: 1,
                    name:{
                        zh:"￥",
                        en:"￥"
                    }
                },
                {
                    id: 2,
                    name:{
                        zh:"$",
                        zh:"$"
                    }
                },
                {
                    id: 3,
                    name:{
                        zh:"€",
                        zh:"€"
                    }
                }
            ]
        }
    },
    computed: {

    },
    methods: {
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    let ob = Object.assign({}, this.info)
                    // ob.contact_mobile = "+" + this.mobile_prefix + this.info.contact_mobile
                    ob.contact_mobile = this.info.contact_mobile
                    let form_s = new FormData()
                    if (this.img_data instanceof FormData) {
                        for (let pp of this.img_data.entries()) {
                            form_s.append(pp[0], pp[1])
                        }
                    }
                    for (const key in ob) {
                        if (ob.hasOwnProperty(key)) {
                            const el = ob[key];
                            form_s.append(key, el)
                        }
                    }
                    // for(let pp of form_s.entries())
                    // {
                    //     console.log(pp[0], "--", pp[1])
                    // }
                    this.$store.dispatch("common/setLoading")
                    offer(form_s).then(res => {
                        this.$notify({
                            title: this.$t('success'),
                            message: this.$t('success.msg'),
                            type: 'success'
                        });
                        // this.$router.push({ path: `/treasure/${this.info.purchase_id}` })
                        this.goBack()
                    }).finally(() => {
                        this.$store.dispatch("common/setLoading", false)
                    })
                } else {
                    return false;
                }
            });

        },

    },
    mounted() {
        myoffer(this.info.purchase_id).then(res => {
            if (res.myoffer) {
                this.info.in_stock = res.myoffer.in_stock;
                this.info.can_provide_sample = res.myoffer.can_provide_sample;
                this.info.is_oem = res.myoffer.is_oem;
                this.info.price = res.myoffer.price;
                this.info.unit_id = res.myoffer.unit_id;
                this.info.description = res.myoffer.description;
                this.img_pre = res.myoffer.assets
                this.info.contact_name = res.myoffer.contact_name
                this.info.contact_gender = res.myoffer.contact_gender
                this.info.contact_company = res.myoffer.contact_company
                this.info.contact_mobile = res.myoffer.contact_mobile
                this.info.contact_phone = res.myoffer.contact_phone
            }
        })
    }
}
</script>
