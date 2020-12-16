<template>
<div>
    <kuc-page-header :title="$t('pin.bao')"></kuc-page-header>
    <el-form ref="dataForm" label-position="left" label-width="0" v-if="info.product">
        <div class="bg-white mt-1 pb-2">
            <div class="p-2">
                <div class="d-flex">
                    <img :src="getImg1(info.product.assets)" alt=" " width="60" height="60" class="rounded fit-cover mr-2">
                    <div class="flex-1">
                        <h3 class="mb-1">{{gsv(['name', $i18n.locale],info.product)}}</h3>
                        <div class="font-09 text-dark6">
                            <el-row class="mt-1">
                                <el-col :span="12">{{$t('product')}}{{$t('moq')}}：{{info.product.min_quantity}}{{gsv(['unit', 'name', $i18n.locale], info.product)}}</el-col>
                                <el-col :span="12">{{$t('product')}}{{$t('unit_price')}}：￥{{info.product.price}}</el-col>
                            </el-row>
                            <el-row class="mt-1">
                                <el-col :span="12">{{$t('pin.my.q')}}：{{info.quantity}}{{gsv(['unit', 'name', $i18n.locale], info.product)}}</el-col>
                                <el-col :span="12">{{$t('pin_date')}}：{{parseTime(info.created_at, '{y}-{m}-{d}')}}</el-col>
                            </el-row>

                            <p class="mt-1">{{$t('pin.my.p')}}： <span class="text-danger font-13">￥{{info.quantity * info.product.price}}</span></p>
                            <div class="mt-3">
                                <p>{{$t('contact.p')}}：{{gsv(['company', 'user', 'name', $i18n.locale], info.product)}}</p>
                                <p>{{$t('phone.contact')}}：{{gsv(['company', 'phone'], info.product)}}</p>
                                <p>{{$t('mobile.contact')}}: {{gsv(['company', 'user', 'phone'], info.product)}}</p>
                                <p>{{$t('company')}}：{{gsv(['company', 'name', $i18n.locale], info.product)}}</p>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="rounded text-center mt-2 py-4" style="background-color: #F7F7F7">
                    <h3 class="mb-3">{{$t('pin_progress')}}</h3>
                    <div class="w-75 m-auto">
                        <el-progress :percentage="Math.min(parseInt(calcPercent(total_quantity, info.product.min_quantity)), 100)" :show-text="false"></el-progress>
                        <div class="d-flex justify-content-between mt-2">
                            <p v-if="total_quantity<info.product.min_quantity">
                                已有<span class="text-danger">{{total_quantity}}</span>人拼单，还差<span class="text-danger">{{info.product.min_quantity - total_quantity}}</span>
                            </p>
                            <p v-else> </p>
                            <p class="text-danger">{{calcPercent(total_quantity, info.product.min_quantity)}}%</p>
                        </div>
                    </div>
                    <el-row :gutter="20" class="px-4 mt-3">
                        <el-col :span="12">
                            <el-button type="primary" @click="handleAddSupplier" class="w-100" round>{{$t('supplier.contact')}}</el-button>
                        </el-col>
                        <el-col :span="12">
                            <el-button type="primary" @click="handleDel" class="w-100" round plain>{{$t('pin_cancel')}}</el-button>
                        </el-col>
                    </el-row>

                </div>
            </div>

        </div>

        <ku-title-line class="px-2">{{$t('bidder')}}（{{bid_list.length}}）</ku-title-line>

        <div class="px-2 pt-2 bg-white">
            <div v-for="(item, ind) in bid_list" :key="item.id">
                <div class="py-2">
                    <div @click="handleBidDetail(ind)" class="">
                        <h4>{{item.contact_name}}, {{item.contact_phone}}</h4>
                        <div class="d-flex justify-content-between mt-2">
                            <p class="text-dark6 mr-5">下单量：<span class="text-danger">{{item.quantity}}{{gsv(['unit', 'name', $i18n.locale], info.product)}}</span></p>
                            <p class="text-dark9">{{parseTime(item.created_at)}}</p>
                        </div>
                    </div>
                </div>
                <ku-line />
            </div>

        </div>

    </el-form>

    <el-dialog :visible.sync="dialogVisible" width="100%" class="full-modal-container" :show-close="false" v-if="bid_list.length">
        <div slot="title" class="position-fixed w-100" style="z-index:999">
            <kuc-page-header :title="$t('pin.bao')" disabled @back="dialogVisible = false" />
        </div>
        <div class="py-5 font-1">
            <div class="d-flex justify-content-between align-items-center mt-2">
                <p>{{$t('pin_quantity1')}}：<span class="text-danger font-12">{{bid_list[show_index]['quantity']}}</span> {{gsv(['unit', 'name', $i18n.locale], bid_list[show_index].product)}}</p>
                <div>
                    <span class="border border-danger bg-danger text-white px-3 py-2 rounded  font-09" @click="handleContact">{{$t('msg.send_ta')}}</span>
                    <span class="border border-danger text-danger px-3 py-2 rounded  font-09" @click="handleAddSupplier">设为供应商</span>
                </div>
            </div>

            <div class="mt-3">

                <!-- <div class="d-flex t-label">
                    <p class="text-dark9 text-right">{{$t('contact.p')}}：</p>
                    <p>{{bid_list[show_index]['contact_name']}}</p>
                </div>
                <div class="d-flex t-label mt-1">
                    <p class="text-dark9 text-right">{{$t('phone')}}：</p>
                    <p>{{bid_list[show_index]['contact_phone']}}</p>
                </div>
                <div class="d-flex t-label mt-1">
                    <p class="text-dark9 text-right">{{$t('mobile')}}：</p>
                    <p>{{bid_list[show_index]['contact_mobile']}}</p>
                </div>
                <div class="d-flex t-label mt-1">
                    <p class="text-dark9 text-right">{{$t('email')}}：</p>
                    <p>{{bid_list[show_index]['contact_email']}}</p>
                </div>
                <div class="d-flex t-label mt-1">
                    <p class="text-dark9 text-right">{{$t('company')}}：</p>
                    <p></p>
                </div> -->
                <div class="d-flex t-label">
                    <p class="text-dark9 text-right">{{$t('contact.p')}}：</p>
                    <p>{{gsv(['company', 'user', 'name', $i18n.locale], info.product)}}</p>
                </div>
                <div class="d-flex t-label mt-1">
                    <p class="text-dark9 text-right">{{$t('phone')}}：</p>
                    <p>{{gsv(['company', 'phone'], info.product)}}</p>
                </div>
                <div class="d-flex t-label mt-1">
                    <p class="text-dark9 text-right">{{$t('mobile')}}：</p>
                    <p>{{gsv(['company', 'user', 'phone'], info.product)}}</p>
                </div>
                <div class="d-flex t-label mt-1">
                    <p class="text-dark9 text-right">{{$t('email')}}：</p>
                    <p>{{gsv(['company', 'user', 'email'], info.product)}}</p>
                </div>
                <div class="d-flex t-label mt-1">
                    <p class="text-dark9 text-right">{{$t('company')}}：</p>
                    <p>{{gsv(['company', 'name', $i18n.locale], info.product)}}</p>
                </div>
                
                <div class="d-flex t-label mt-1">
                    <p class="text-dark9 text-right">{{$t('country')+$t('region')}}：</p>
                    <p>{{gsv(['company', 'country', 'name'], info.product)}}{{gsv(['company', 'region', 'name'], info.product)}}</p>
                </div>
                <div class="d-flex t-label mt-1">
                    <p class="text-dark9 text-right text-nowrap">{{$t('address.recieve')}}：</p>
                    <p>{{gsv(['company', 'address', $i18n.locale], info.product)}}</p>
                </div>
                
                <!-- <div class="d-flex t-label mt-1">
                    <p class="text-dark9 text-right">{{$t('country')+$t('region')}}：</p>
                    <p>{{bid_list[show_index]['country_id']}}</p>
                </div>
                <div class="d-flex t-label mt-1">
                    <p class="text-dark9 text-right text-nowrap">{{$t('address.recieve')}}：</p>
                    <p>{{bid_list[show_index]['region_id']}}</p>
                </div> -->
                <div class="d-flex t-label mt-3">
                    <p class="text-dark9 text-right">{{$t('remark')}}：</p>
                    <p>{{bid_list[show_index]['contact_note']}}</p>
                </div>
            </div>
        </div>
    </el-dialog>

</div>
</template>

<script>
import { getDetail, getPindanDetail, del } from '@/api/my_pindan'
export default {
    name: "MyBuyPindanDetail",
    middleware: ['authenticated'],
    head() {
        return {
            title: this.$t('pin.bao')
        }
    },
    data() {
        return {
            info: {},
            bid_list: [],
            total_quantity: 0,
            dialogVisible: false,
            show_index: 0
        }
    },
    methods: {

        handleAdd() {
            this.$notify({
                title: this.$t('success'),
                message: this.$t('success.msg'),
                type: 'success'
            });
        },
        handleContact() {
            const to = this.gsv(['product', 'user', 'phone'], this.info) || this.gsv(['product', 'user', 'email'], this.info)
            const name = this.gsv(['product', 'user', 'name', this.$i18n.locale], this.info) || ''
            const uid = this.gsv(['product', 'user_id'], this.info)
            
            this.$router.push({ path: `/message/new`, query: { uid, to, name } }) 
        },
        handleAddSupplier() {
            const to = this.gsv(['product', 'company', 'id'], this.info)
            if (to) {
                this.$router.push({ path: '/my/buy/supplier/new', query: { to } })
            }
        },
        handleBidDetail(bid_ind) {
            // this.$router.push({ path: "/pindan/" + bid_id })
            this.show_index = bid_ind
            this.dialogVisible = true
        },
        calcPercent(part, total) {
            return (part * 100 / total).toFixed(1)
        },
        handleDel() {
            let id = parseInt(this.$route.params.id)
            this.$confirm(this.$t('confirm.msg_del'), this.$t('warning'), {
                confirmButtonText: this.$t('confirm.ok'),
                cancelButtonText: this.$t('confirm.cancle'),
                type: 'warning',
                showClose: false,                
                showCancelButton: true,
                confirmButtonClass: 'text-danger',
                cancelButtonClass: 'border-right',
                customClass: 'ku-confirm',
                dangerouslyUseHTMLString: true,
                center: true,
            }).then(() => {
                del([id]).then(() => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'
                    });
                    this.goBack()
                })
            }).catch(() => {})
        }

    },
    mounted() {
        getDetail(this.$route.params.id).then(res => {
            this.info = res.my_pindan
            getPindanDetail(this.info.product_id, this.info.group_id).then(res => {
                this.total_quantity = res.total_quantity
                this.bid_list = res.pindan_list
            })
        })
    }

}
</script>