<template>
<div>
    <div class="bg-white">
        <kuc-page-header :title="$t('pin.bao')" to="/my/sell"></kuc-page-header>
        <div class="px-2 d-flex justify-content-between filter-box-2">
            <el-select v-model="listQuery.date" placeholder="" @change="handleFilter">
                <el-option key="date_all" :label="$t('post.date')" value="">{{$t('all')}}</el-option>
                <el-option v-for="item in options_date" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <div>
                <el-button type="primary" @click="goNewProduct" size="small">{{$t('pin.post_product')}}</el-button>
            </div>
        </div>
    </div>

    <div class="mt-2 bg-white px-2 tp-1">
        <div v-for="item in list" :key="item.id">
            <div class="py-2">
                <nuxt-link :to="`/my/sell/pindan/${item.product_id}/${item.group_id}`" class="d-flex">
                    <img :src="getImg1(gsv(['assets'], item.product))" alt=" " width="60" height="60" class="rounded">
                    <div class="ml-2 flex-1">
                        <div class="d-flex">
                            <h3>{{gsv(['name', $i18n.locale], item.product)}}</h3>
                            <div span v-if="gsv(['status'], item)" class="ml-2">
                                <span class="bg-danger text-white text-nowrap rounded px-2 py-1 font-08">{{$t('success')}}</span>
                            </div>
                            <div v-else class="ml-2">
                                <span class="bg-dark6 text-white text-nowrap rounded px-2 py-1  font-08">{{$t('success.n')}}</span>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between text-dark6 my-1">
                            <p>{{$t('unit_price')}}：<span>￥{{gsv(['price'], item.product)}}</span> </p>
                            <p>{{$t('pin_quantity')}}：<span>{{item.product.min_quantity}}{{gsv(['unit', 'name', $i18n.locale], item.product)}}</span> </p>
                        </div>
                        <p>{{$t('pin_date')}}：{{parseTime(item.status_date)}}</p>
                    </div>
                </nuxt-link>
                <div class="d-flex justify-content-between mt-2">
                    <div class="flex-1 mr-5">
                        <el-progress :percentage="Math.min(parseInt(calcPercent(item.total_quantity, item.product.min_quantity)), 100)" :show-text="false"></el-progress>
                        <div class="d-flex justify-content-between mt-2">
                            <p v-if="item.total_quantity<item.product.min_quantity">
                                <template v-if="$i18n.locale == 'en'">
                                    Already shared <span class="text-danger">{{item.total_quantity}}</span>, need <span class="text-danger">{{item.product.min_quantity - item.total_quantity}}</span> more to complete the order.
                                </template>
                                <template v-else>
                                    已有<span class="text-danger">{{item.total_quantity}}</span>个拼单，还差<span class="text-danger">{{item.product.min_quantity - item.total_quantity}}</span>
                                </template>
                            </p>
                            <p v-else>{{$t('step.complete')}} </p>
                            <p class="text-danger">{{calcPercent(item.total_quantity, item.product.min_quantity)}}%</p>
                        </div>
                    </div>
                    <div>
                        <span class="border border-danger px-3 py-1 rounded text-danger" @click="handleDel(item.group_id)">{{$t('confirm.cancle')}}</span>
                    </div>
                </div>
            </div>
            <ku-line />
        </div>
        <ku-loading-no-data :active="isLoading" :total="total" /> 
    </div>

    <div class="text-center pagination-kuc mt-2">
        <el-pagination background layout="prev, pager, next" :total="total" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size=4 :current-page.sync="listQuery.page" @current-change="getList" :hide-on-single-page='true'></el-pagination>
    </div>
</div>
</template>

<script>
import { getList, del, getPindan } from '@/api/my_pindan'
export default {
    name: "MyPinDan",
    head() {
        return {
            title: this.$t('pin.bao')
        }
    },
    data() {
        return {
            isLoading: true,
            options_date: [
                {
                    label: this.$t('duration.week'),
                    value: 'one_week'
                },
                {
                    label: this.$t('duration.month'),
                    value: 'one_month'
                },
                {
                    label: this.$t('duration.months', [3]),
                    value: 'three_months'
                },
            ],
            total: 0,
            list: [],
            listQuery: {
                page: 1,
                limit: 10,
                date: ''
            }
        }
    },
    methods: {
        getList() {
            this.isLoading = true
            getPindan(this.listQuery).then(res => {
                this.list = res.items
                this.total = res.total
            }).finally(() => {
                this.isLoading = false
            })
        },
        handleFilter() {
            this.listQuery.page = 1;
            this.getList()
        },
        goNewProduct() {
            this.$router.push({path:"/product_manage/new"})
        },
        calcPercent(part, total) {
            return (part * 100 / total).toFixed(1)
        },
        handleDel(id) {
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
                // offer_del([id]).then(() => {
                this.$notify({
                    title: this.$t('success'),
                    message: this.$t('success.del'),
                    type: 'success'

                });
                //     this.$router.push({path: '/my/sell/treasure'})
                // })
            }).catch(() => {})
        }
    },
    mounted() {
        this.getList()
    }
}
</script>