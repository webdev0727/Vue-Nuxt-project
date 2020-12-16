<template>
<div>
    <div class="bg-white">
        <kuc-page-header :title="$t('purchase.bao')" to="/my/sell"></kuc-page-header>
        <div class="px-2 filter-box-2">
            <el-select v-model="listQuery.date" placeholder="" @change="handleFilter">
                <el-option key="date_all" :label="$t('post.date')" value="">{{$t('all')}}</el-option>
                <el-option v-for="item in options_date" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </div>
    </div>
    <!-- list -->
    <div class="mt-2 px-2 pt-2 bg-white">
        <div v-for="item in list" :key="item.id">
            <div class="py-2">
                <nuxt-link :to="`/my/sell/treasure/${item.id}`">
                    <h3>{{gsv(['title'], item.purchase)}}</h3>
                    <div class="d-flex justify-content-between text-dark9 font-09 my-1">
                        <p>{{gsv(['category', 'name', $i18n.locale], item.purchase)}}</p>
                        <p>{{$t('my')}}{{$t('offer.i')}}：￥{{item.price}}</p>
                        <p>{{parseTime(item.created_at, '{y}-{m}-{d} {h}:{i}:{s}')}}</p>
                    </div>
                </nuxt-link>
                <div class="text-right mb-1">
                    <div class="d-flex justify-content-end btn-group-1">
                        <nuxt-link :to="'/purchase/offer/create/'+gsv(['id'], item.purchase)" class="pt-1 px-2 border rounded text-center text-nowrap mr-4">{{$t('offer.again')}}</nuxt-link>
                        <span class="p-1 text-danger border border-danger rounded  text-center" @click="handleCancel(item.id)">{{$t('confirm.cancle')}}</span>
                    </div>
                </div>
            </div>
            <ku-line></ku-line>
        </div>
        
        <ku-loading-no-data :active="isLoading" :total="total" />
    </div>

    <div class="text-center pagination-kuc mt-2 pb-5">
        <el-pagination background layout="prev, pager, next" :total="total" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size="listQuery.limit" :current-page.sync="listQuery.page" @current-change="getList" :hide-on-single-page='true'></el-pagination>
    </div>

</div>
</template>

<script>
import { getList, offer_del } from '@/api/my_treasure'
export default {
    head() {
        return {
            title: this.$t('purchase.bao')
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
                date: '',
                limit: 10,
                page: 1
            },
        }
    },
    methods: {
        getList() {
            this.isLoading = true
            getList('seller', this.listQuery).then(res => {
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
        handleCancel(id) {
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
                offer_del([id]).then(() => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'

                    });
                    let t_index = this.list.findIndex(x => x.id == id)
                    this.list.splice(t_index, 1)
                })
            }).catch(() => {})
        },
    },
    mounted() {
        this.getList()
    }
}
</script>

<style lang="scss" scoped>
.btn-group-1 {
    span,
    a {
        width: 23%;
        min-width: 6rem;
    }
}
</style>
