<template>
<div>
    <kuc-page-header :title="$t('shuttle_free')" to="/my/buy"></kuc-page-header>

    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" class="bg-white px-2 mt-2">
        <!-- 真实姓名（中文） -->
        <!-- <div class="py-input">
            <dlg-select :title="$t('expo.sel')" :checked.sync="info.expo_id" :list="expoList" @change="handleExpoChange" />
        </div> -->
        <div class="align-items-center py-1 d-flex">
            <p class="text-nowrap mr-2">{{$t('expo.sel')}}</p>
            <el-select v-model="info.expo_id" :placeholder="$t('expo.sel')" class="w-100 text-right" @change="handleExpoChange">
                <el-option v-for="item in expoList" :key="'expo_'+ item.id" :label="item.name[$i18n.locale]" :value="item.id"></el-option>
            </el-select>
        </div>
        <div class="el-form-item__error" v-if="error.expo_id">{{error.expo_id[0]}}</div>
        <ku-line />

        <!-- prop="name_cn" -->
        <el-form-item prop="name">
            <el-input v-model="info.name" class="text-right" placeholder="王希孟">
                <template slot="prepend">{{$t('name.real')}}</template>
            </el-input>
        </el-form-item>

        <!-- 性别 sex -->        
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

        <!-- 座机 -->
        <el-form-item>
            <ku-input-fax v-model="info.phone" title="landline" key="landine"></ku-input-fax>
        </el-form-item>

        <!-- 传真 fax -->
        <el-form-item label="">
            <ku-input-fax v-model="info.fax" key="fax"></ku-input-fax>
        </el-form-item>
        <!-- 手机  -->
        <el-form-item prop="mobile">
            <el-input v-model="info.mobile" class="text-right" placeholder="156-867-660660" type="number">
                <ku-mobile slot="prepend" :mobile_code.sync="phone_prefix" />
            </el-input>
        </el-form-item>
        <!-- 邮箱  -->
        <el-form-item prop="email">
            <el-input v-model="info.email" class="text-right" placeholder="happy@sina.com">
                <template slot="prepend">{{$t('email')}}</template>
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
        <el-form-item label="">
            <el-input v-model="info.address" class="text-right" placeholder="北京市朝阳区朝阳路58号">
                <template slot="prepend">{{$t('address.d')}}</template>
            </el-input>
        </el-form-item>
                
        <div class="align-items-center py-1 d-flex">
            <p class="text-nowrap mr-2">{{$t('city_t')}}</p>
            <el-select v-model="info.bus_id" placeholder="北京至宁波" class="w-100 text-right" @change="handleBusChange">
                <el-option v-for="item in buses" :key="'bus_'+ item.id" :label="item.name[$i18n.locale]" :value="item.id"></el-option>
            </el-select>
        </div>
        <div class="el-form-item__error" v-if="error.bus_id">{{error.bus_id[0]}}</div>
        <ku-line />

        <el-form-item label="">
            <el-input :value="bus_date" class="text-right" placeholder="2020-09-12" readonly>
                <template slot="prepend">{{$t('date.i')}}</template>
            </el-input>
        </el-form-item>

        <!-- <el-form-item label="" class="ku-no-after"> -->
        <!-- <el-input v-model="info.date" class="text-right" placeholder="2020-06-11">
                <template slot="prepend">日期</template>
            </el-input> -->
        <!-- <div class="d-flex align-items-center justify-content-between">
                <span class="text-nowrap input-label">日期</span>
                <div class="date-picker-text-right">
                    <el-date-picker v-model="info.date" type="date" format="yyyy-MM-dd" placeholder="2020-12-12" prefix-icon='ee' :editable="false" :picker-options="pickerOptions"></el-date-picker>
                    <span class=""><i class="el-icon-arrow-right"></i></span>
                </div>
            </div>
        </el-form-item> -->

    </el-form>

    <div class="text-center py-4">
        <el-button :type="is_added ? 'info': 'primary'" @click="handleSubmit" class="w-75" round="" :disabled="is_added">{{is_added ? '已申请' : $t('submit.apply')}}</el-button>
    </div>

    <div class="p-3 mb-3">
        <h3 class="mb-2">{{$t('note')}}</h3>

        <ol class="ml-n3">
            <li class="my-2">本次免费班车仅供文具展专业客商，需提前预定，现场凭本人名片上车！</li>
            <li v-for="item in buses" :key="item.id" class="my-2">
                {{gsv([$i18n.locale], item.name)}} ({{item.date}})
                <p v-html="gsv([$i18n.locale], item.description)"></p>
            </li>
        </ol>
    </div>

    <!-- modal dialog -->
    <el-dialog :visible.sync="dialogVisible" width="100%" class="full-modal-container" :show-close="false">

        <div slot="title" class="position-fixed w-100" style="z-index:999">
            <kuc-page-header :title="$t('expo.success')" disabled @back="dialogVisible = false"></kuc-page-header>
        </div>
        <div class="mt-5 text-center">
            <success-icon></success-icon>
        </div>
        <div class="text-dark9 text-center">
            <h2 class="px-3 text-dark28 mb-3">{{$t('msg.Submited_successfully')}}</h2>
            <p>{{$t('msg.You_may_received_a_message_after_your_application_approved')}}
                {{$t('msg.Thanks_for_visiting', ["xxx"])}}</p>
        </div>
        <div class="px-4 mt-5">
            <el-button type="primary" @click="handleOK" class="w-100" round>{{$t('confirm.ok')}}</el-button>
        </div>

    </el-dialog>

</div>
</template>

<script>
import SuccessIcon from "@/components/successIcon"
import { getExpoBuyerBus, addExpoBuyerBus, detailExpoBuyerBus } from '~/api/expo'
export default {
    middleware: 'authenticated',
    name: "MyParticipate",
    components: { SuccessIcon },
    head() {
        return {
            title: this.$t('shuttle_free')
        }
    },
    data() {
        return {
            expos: [],
            buses: [],
            info: {
                expo_id: '',
                expo_applicant_buyer_id: '',
                bus_id: '',
                name: '',
                gender: 0,
                position: '',
                company: '',
                phone: '',
                fax: '',
                mobile: '',
                email: '',
                address: '',
                country_id: 1,
                region_id: '',
                city_id: '',
                website: '',
            },
            bus_date: '',
            phone_prefix: "86",
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                },
            },
            dialogVisible: false,
            is_added: false,
            rules: {
                name: [{ required: true, message: this.$t('valid.required', [this.$t('name')]), trigger: ['blur'] }, ],
                email: [{ type: 'email', message: this.$t('valid.email', [this.$t('email')]), trigger: ['blur'] }, ],
                mobile: [{ required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur'] },

                ]
            },
            error: {
                expo_id: false,
                bus_id: false,
            },
        }
    },
    computed: {
        expoList: function () {
            let expos = []
            this.expos.forEach(el => {
                expos.push({ id: el.expo_id, name: el.expo.name })
            });
            return expos
        },
        expoUserInfo: function () {
            return this.expos.find(xx => xx.expo_id == info.expo_id)
        }
    },
    methods: {
        validCustom() {
            let valid1 = false
            let valid2 = false
            if (!this.info.bus_id) {
                this.error.bus_id = [this.$t('valid.required', [this.$t('city')])]
                valid1 = false
            } else {
                this.error.bus_id = false
                valid1 = true
            }

            if (!this.info.expo_id) {
                this.error.expo_id = [this.$t('valid.required', [this.$t('expo.no_')])]
                valid2 = false
            } else {
                this.error.expo_id = false
                valid2 = true
            }
            return valid1 && valid2
        },

        handleBusChange(bus_id) {
            console.log(bus_id)
            const target_bus = this.buses.find(xx => xx.id == bus_id)
            this.bus_date = target_bus.date
            this.validCustom()
        },
        handleExpoChange(expo_id) {
            const target_expo = this.expos.find(xx => xx.expo_id == expo_id)
            this.info.expo_applicant_buyer_id = target_expo.id
            this.info.name = target_expo.name
            this.info.gender = target_expo.gender
            this.info.position = target_expo.position
            this.info.company = target_expo.company
            this.info.phone = target_expo.phone
            this.info.mobile = target_expo.mobile
            this.info.email = target_expo.email
            this.info.fax = target_expo.fax
            this.info.country_id = target_expo.country_id
            this.info.region_id = target_expo.region_id
            this.info.city_id = target_expo.city_id
            this.info.address = target_expo.addr
            this.validCustom()
            detailExpoBuyerBus(target_expo.id).then(res => {
                const saved_da = res.item
                if (saved_da) {
                    this.info.name = saved_da.name
                    this.info.gender = saved_da.gender
                    this.info.position = saved_da.position
                    this.info.company = saved_da.company
                    this.info.phone = saved_da.phone
                    this.info.mobile = saved_da.mobile
                    this.info.email = saved_da.email
                    this.info.country_id = saved_da.country_id
                    this.info.region_id = saved_da.region_id
                    this.info.city_id = saved_da.city_id
                    this.info.address = saved_da.address
                    this.info.bus_id = saved_da.bus_id
                    this.info.website = saved_da.website
                    this.info.fax = saved_da.fax
                    this.is_added = true
                    this.handleBusChange(this.info.bus_id)
                } else {
                    this.is_added = false
                    const my_info = res.user
                    if (my_info){
                        this.info.website = this.gsv(['website'], my_info.company) || my_info.company_website || ''
                    }
                }
            })
        },

        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                const valid_custom = this.validCustom()
                if (valid && valid_custom) {
                    let data = Object.assign({}, this.info)
                    data.bus = this.buses.find(xx => xx.id == this.info.bus_id)
                    // console.log(data)
                    addExpoBuyerBus(data).then(res => {
                        this.dialogVisible = true
                    })
                }
            });
        },
        handleOK() {
            this.dialogVisible = false
            this.goBack()
        }
    },
    mounted() {
        getExpoBuyerBus().then(res => {
            this.expos = res.expo_applicant_buyers
            this.buses = res.buses
        })
    }
}
</script>
