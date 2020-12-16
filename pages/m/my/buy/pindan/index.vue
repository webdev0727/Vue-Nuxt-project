<template>
<div>
    <div class="bg-white">
        <kuc-page-header :title="$t('pin.bao')" to="/my/buy"></kuc-page-header>
        <div class="px-2 filter-box-2">
            <el-select v-model="listQuery.date" @change="handleFilter">
                <el-option key="date_all" :label="$t('post.date')" value="">{{$t('all')}}</el-option>
                <el-option v-for="item in options_date" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </div>
    </div>

    <div class="mt-2 bg-white px-2">
        <div v-for="item in list" :key="item.id">
            <div class="py-2">
                <!-- <nuxt-link class="d-flex" :to="`/my/buy/pindan/${item.product_id}/${item.group_id}?pindan_id=${item.id}`"> -->
                <nuxt-link class="d-flex" :to="`/my/buy/pindan/${item.id}`">
                    <img :src="getImg1(item.product.assets)" alt=" " width="60" height="60" class="rounded">
                    <div class="ml-2 flex-1">
                        <h3>{{gsv(['name', $i18n.locale], item.product)}}</h3>
                        <div class="d-flex justify-content-between text-dark6 my-1">
                            <p>{{$t('unit_price')}}：<span>￥{{item.product.price}}</span> </p>
                            <p>{{$t('pin_quantity')}}：<span>{{item.quantity}}{{$t('unit_set1')}}</span> </p>
                        </div>
                        <p>{{$t('pin_date')}}：{{parseTime(item.created_at)}}</p>
                    </div>
                </nuxt-link>
                <div class="d-flex justify-content-between mt-2">
                    <div class="flex-1 mr-5">
                        <el-progress :percentage="Math.min(parseInt(calcPercent(gsv(['total_quantity'], item.group_info), item.product.min_quantity)), 100)" :show-text="false"></el-progress>
                        <div class="d-flex justify-content-between mt-2">
                            <p v-if="item.total_quantity<item.product.min_quantity">
                                已有<span class="text-danger">{{item.quantity}}</span>个拼单，还差<span class="text-danger">{{item.product.min_quantity - item.total_quantity}}</span>
                            </p>
                            <p v-else>{{$t('step.complete')}} </p>
                            <p class="text-danger">{{calcPercent(gsv(['total_quantity'], item.group_info), item.product.min_quantity)}}%</p>
                        </div>
                    </div>
                    <div>
                        <span class="border border-danger px-3 py-1 rounded text-danger" @click="handleDel(item.id)">{{$t('confirm.cancle')}}</span>
                    </div>
                </div>
            </div>
            <ku-line />
        </div>
        <ku-loading-no-data :active="isLoading" :total="total" />
    </div>

    <div class="text-center pagination-kuc mt-2">
        <el-pagination background layout="prev, pager, next" :total="total" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size="listQuery.limit" :current-page.sync="listQuery.page" @current-change="getList" :hide-on-single-page='true'></el-pagination>
    </div>
</div>
</template>

<script>
import { getList, del } from '@/api/my_pindan'
export default {
    middleware: ['authenticated'],
    name: "MyBuyPinDan",
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
            getList('buyer', this.listQuery).then(res => {
                this.list = res.items
                this.total = res.total
            }).finally(()=>{
                this.isLoading = false
            })
        },
        handleFilter() {
            this.listQuery.page = 1
            this.getList()
        },
        handleNew() {

        },
        calcPercent(part, total) {
            return (part * 100 / total).toFixed(1)
        },
        handleShow(id) {
            this.$router.push({ path: "/my/buy/pindan/" + id })
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
                del([id]).then(() => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'

                    });
                    this.getList()
                })
            }).catch(() => {})
        }
    },
    mounted() {
        this.getList()
    }
}
</script>