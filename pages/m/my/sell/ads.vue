<template>
<div>
    <!-- header -->
    <div class="bg-white">
        <kuc-page-header :title="$t('ads.p_apply')" to="/my/sell"></kuc-page-header>
    </div>

    <!-- content -->
    <div class="mt-2 bg-white p-2">

        <div class="d-flex align-items-center">
            <p>{{$t('form.input_ads_p')}}</p>
            <el-select v-model="info.ads_space_id" placeholder="邀请方式" class="flex-1 text-right">
                <el-option v-for="item in positions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
        <ku-line />

        <p class="py-input">{{$t('price')}} <span class="text-danger font-12">￥{{price}}</span><span class="text-dark6">/{{$t('year')}}</span></p>
        <p>{{$t('desc')}}</p>
        <p class="text-dark6">{{desc}}</p>
        <div class="text-center">
            <img :src="img_url" alt=" " class="w-75">
        </div>
    </div>

    <div class="mt-2 bg-white px-2">
        <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0">
            <!-- name -->
            <el-form-item prop="user_name">
                <el-input v-model="info.user_name" class="text-right mt-1" placeholder="王希孟" >
                    <template slot="prepend">{{$t('name')}}</template>
                </el-input>
            </el-form-item>
            <!-- mobile -->
            <el-form-item prop="phone">
                <el-input v-model="info.phone" class="text-right" placeholder="156-867-660660" type="number">
                    <ku-mobile slot="prepend" :mobile_code.sync="info.phone_prefix" />
                </el-input>
            </el-form-item>
            <!-- email -->
            <el-form-item prop="email">
                <el-input v-model="info.email" class="text-right" placeholder="happy@sina.com">
                    <template slot="prepend">{{$t('email')}}</template>
                </el-input>
            </el-form-item>
            <!--  company -->
            <el-form-item prop="company_name" class="ku-no-after">
                <el-input v-model="info.company_name" class="text-right" placeholder="得力" >
                    <template slot="prepend">{{$t('company')}}</template>
                </el-input>
            </el-form-item>
        </el-form>
    </div>

    <div class="text-center my-4">
        <el-button type="primary" @click="handleSubmit" class="w-75" round="" :disabled="applied">{{$t('btn.apply')}}</el-button>
    </div>
</div>
</template>

<script>
import { getList, add } from "@/api/ads"
export default {
    name: "AdsPositonApply",
    middleware: ['authenticated', 'member_2'],
    head() {
        return {
            title: this.$t('ads.p_apply')
        }
    },
    data() {
        return {
            info: {
                ads_space_id: '',
                user_name: this.$store.state.auth.name[this.$i18n.locale],
                phone: this.$store.state.auth.phone,
                phone_prefix: this.$store.state.auth.phone_prefix || '86',
                email: this.$store.state.auth.email,
                company_name: this.$store.state.auth.company.name[this.$i18n.locale],
            },
            positions: [],
            rules: {
                email: [{ type: 'email', message: this.$t('valid.email', [this.$t('email')]), trigger: ['blur', 'change'] }, ],
                user_name: [{ required: true, message: this.$t('valid.required', [this.$t('name')]), trigger: ['blur', 'change'] },],
                company_name: [{ required: true, message: this.$t('valid.required', [this.$t('company')]), trigger: ['blur', 'change'] },],
                phone: [{ required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur', 'change'] },
                    { min: 11, max: 15, message: this.$t('valid.between.string', [this.$t('mobile'), 11, 15]), trigger: ['blur', 'change'] },
                ]
            },
        }
    },
    computed: {
        desc: function () {
            const iii = this.positions.find(rr => rr.id == this.info.ads_space_id)
            return iii ? iii['description'] : ''
        },
        price: function () {
            const iii = this.positions.find(rr => rr.id == this.info.ads_space_id)
            return iii ? iii['price'] : ''
        },
        img_url: function () {
            const iii = this.positions.find(rr => rr.id == this.info.ads_space_id)
            return iii ? this.gsv(['asset', 'url'], iii) : '/upload/图像 1.png'
        },
        applied: function () {
            const iii = this.positions.find(rr => rr.id == this.info.ads_space_id)
            return !!this.gsv(['applicant'], iii)
        },
    },
    methods: {
        getList() {
            getList().then(res => {
                this.positions = res.ads
                if (res.ads.length) this.info.ads_space_id = res.ads[0]['id']
            })
        },
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$store.dispatch("common/setLoading", true)
                    let mm = Object.assign({}, this.info)
                    mm.phone = `+${this.info.phone_prefix} ${this.info.phone}`
                    delete mm.phone_prefix
                    add(mm).then(() => {
                        this.getList()
                    }).finally(() => {
                        this.$store.dispatch("common/setLoading", false)
                    })
                }
            });
        }
    },
    mounted() {
        this.getList()
    }
}
</script>
