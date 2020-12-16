<template>
<div>
    <kuc-page-header :title="$t('pin.bao')"></kuc-page-header>
    <el-form ref="dataForm" label-position="left" label-width="0" v-if="product">
        <div class="bg-white mt-1 pb-2">
            <div class="p-2">

                <h3>{{gsv(['name', $i18n.locale], product)}}</h3>
                <div class="font-09 text-dark6">
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1">{{$t('post.date')}}： </p>
                        <p v-if="product.created_at">{{parseTime(product.created_at)}}</p>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1">{{$t('product')}}{{$t('unit_price')}}： </p>
                        <p> ￥{{product.price}}</p>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1">{{$t('moq')}}： </p>
                        <p>{{product.min_quantity}}{{gsv(['unit', 'name', $i18n.locale], product)}}</p>
                    </div>
                    <div class="d-flex my-2 align-items-center"  v-html="$t('msg.html_orders', [total_quantity])">
                    </div>
                </div>

                <div class="rounded text-center py-4" style="background-color: #F7F7F7">
                    <h3 class="mb-3">{{$t('pin_progress')}}</h3>
                    <div class="w-75 m-auto">
                        <el-progress :percentage="Math.min(parseInt(calcPercent(total_quantity, product.min_quantity)), 100) " :show-text="false"></el-progress>
                        <div class="d-flex justify-content-between mt-2">
                            <p v-if="total_quantity<product.min_quantity">
                                已有<span class="text-danger">{{total_quantity}}</span>个拼单，还差<span class="text-danger">{{product.min_quantity - total_quantity}}</span>
                            </p>
                            <p v-else>{{$t('step.complete')}} </p>
                            <p class="text-danger">{{calcPercent(total_quantity, product.min_quantity)}}%</p>
                        </div>
                    </div>

                    <div class="text-center mt-3">
                        <el-button type="primary" @click="handleFinish" class="w-50" round plain>{{$t('pin_close')}}</el-button>
                    </div>

                </div>
            </div>

        </div>

        <ku-title-line class="px-2">{{$t('pin_li')}}</ku-title-line>

        <div class="px-2 pt-2 bg-white">
            <div v-for="(pindan, ind) in bid_list" :key="pindan.id">
                <div class="py-2 d-flex align-items-center">
                    <div class="flex-1 mr-4" @click="handleBidDetail(ind)">
                        <h4>{{pindan.contact_name}}({{pindan.contact_mobile}})</h4>
                        <div class="d-flex text-dark9 justify-content-between mt-1">
                            <p>下单量：{{pindan.quantity}}{{gsv(['unit', 'name', $i18n.locale], product)}}</p>
                            <p>{{$t('status.i')}}: {{pindan.status ? $t('status.valid'): $t('status.invalid')}}</p>
                        </div>
                        <div class="d-flex text-dark9 justify-content-between">
                            <p>{{parseTime(pindan.created_at)}}</p>
                            <p>{{$t('address')}}: {{gsv(['name'], pindan.country) || '*'}}·{{gsv(['name'], pindan.region) || '*'}}</p>
                        </div>
                    </div>
                    <div>
                        <el-button type="primary" @click="handleContact(pindan)" size="small">{{$t('msg.send_ta')}}</el-button>
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
        <div class="py-5">
            <div class="d-flex justify-content-between align-items-center mt-2">
                <p>{{$t('pin_quantity1')}}：<span class="text-danger font-12">{{bid_list[show_index]['quantity']}}</span> {{gsv(['unit', 'name', $i18n.locale], bid_list[show_index].product)}}</p>
                <div>
                    <span class="border border-danger bg-danger text-white px-3 py-2 rounded  font-09" @click="handleContact(bid_list[show_index]['user_id'])">{{$t('msg.send_ta')}}</span>
                    <span class="border border-danger text-danger px-3 py-2 rounded  font-09" @click="handleAddBuyer(bid_list[show_index]['user_id'])">设为我的买家</span>
                </div>
            </div>

            <div class="mt-3">
                <div class="d-flex t-label">
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
                </div>
                <div class="d-flex t-label mt-1">
                    <p class="text-dark9 text-right">{{$t('country')+$t('region')}}：</p>
                    <p>{{gsv(['name'], bid_list[show_index].country) || '*'}}·{{gsv(['name'], bid_list[show_index].region) || '*'}}</p>
                </div>
                <div class="d-flex t-label mt-1">
                    <p class="text-dark9 text-right text-nowrap">{{$t('address.recieve')}}：</p>
                    <p>{{bid_list[show_index]['contact_addr']}}</p>
                </div>
                <div class="d-flex t-label mt-1">
                    <p class="text-dark9 text-right">{{$t('remark')}}：</p>
                    <p>{{bid_list[show_index]['contact_note']}}</p>
                </div>
            </div>
        </div>
    </el-dialog>

</div>
</template>

<script>
import { getPindanDetail } from '@/api/my_pindan'
export default {
    name: "MyTreasureDetail",
    components: {},
    data() {
        return {
            product: {},
            bid_list: [],
            total_quantity: 0,
            dialogVisible: false,
            show_index: 0
        }
    },
    methods: {
        handleFinish() {
            this.$confirm("拼单结束后是否拼单改为否的状态", this.$t('warning'), {
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
                // pindan_finish([id]).then(() => {
                this.$notify({
                    title: this.$t('success'),
                    message: this.$t('success.del'),
                    type: 'success'

                });
                //     this.$router.push({path: '/my/sell/treasure'})
                // })
            }).catch(() => {})
        },
        handleContact(item) {            
            if (item){                
                const uid = item.user_id            
                const to = this.gsv(['phone'], item.user) || this.gsv(['email'], item.user)            
                const name = this.gsv(['name', this.$i18n.locale], item.user) || ''
                this.$router.push({ path: `/message/new`, query: { uid, to, name } }) 
            }
            
        },
        handleAddBuyer(to){
            if (to) {
                this.$router.push({ path: '/my/sell/buyer/new', query: { to } })
            }
        },
        handleBidDetail(bid_ind) {
            // this.$router.push({ path: "/pindan/" + bid_id })
            this.show_index = bid_ind
            this.dialogVisible = true
        },
        calcPercent(part, total) {
            if (total)
                return (part * 100 / total).toFixed(1)
            else
                return 0
        },

    },
    mounted() {
        getPindanDetail(this.$route.params.product_id, this.$route.params.group_id).then(res => {
            this.product = res.product
            this.bid_list = res.pindan_list
            this.total_quantity = res.total_quantity
        })
    }

}
</script>