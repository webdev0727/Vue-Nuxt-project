<template>
<div>
    <div class="bg-white">
        <kuc-page-header :title="$t('purchase.bao')" to="/my/buy">
            <nuxt-link to='/purchase/create' class="text-danger">
                {{$i18n.locale=='zh' ? $t('purchase.post') : "Post"}}
            </nuxt-link>
        </kuc-page-header>
        <div class="px-2 d-flex justify-content-around filter-box-2">
            <el-select v-model="listQuery.date" placeholder="" @change="handleFilter">
                <el-option key="date_all" :label="$t('post.date')" value="">{{$t('all')}}</el-option>
                <el-option v-for="item in options_date" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select v-model="listQuery.cate" placeholder="" @change="handleFilter">
                <el-option key="status_all" :label="$t('status.i')" value="">{{$t('all')}}</el-option>
                <el-option v-for="item in options_status" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
        </div>
    </div>
    <!-- list -->
    <div class="mt-2 px-2 pt-2 bg-white">
        <div v-for="(item, index) in list" :key="item.id">
            <div class="py-2">
                <div @click="handelShow(item.id)">
                    <div class="d-flex">
                        <h3>{{item.title}}</h3>
                        <div span v-if="item.status" class="ml-2">
                            <span class="bg-danger text-white text-nowrap rounded px-2 py-1 font-08">{{$t('status.failed')}}</span>
                        </div>
                        <div v-else class="ml-2">
                            <span class="bg-warning text-white text-nowrap rounded px-2 py-1  font-08">{{$t('status.approved')}}</span>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between text-dark9 font-09 my-1">
                        <p>{{gsv(['category', 'name', $i18n.locale], item)}} {{gsv(['category', 'childs', 0, 'name', $i18n.locale], item)}}</p>
                        <p>{{$t('quote.quantity')}}： {{item.offers}}</p>
                        <p>{{parseTime(item.created_at, '{y}-{m}-{d} {h}:{i}')}}</p>
                    </div>
                </div>
                <div class="text-right mb-1">
                    <div class="d-flex justify-content-end btn-group-1">
                        <span class="p-1 border rounded text-center mr-4" @click="handleClose(item, index)">{{item.is_done ? $t('status.close') : $t('source.close')}}</span>
                        <span class="p-1 text-danger border border-danger rounded  text-center" @click="handleCancel(item.id)">{{$t('del')}}</span>
                    </div>
                </div>
            </div>
            <ku-line></ku-line>
        </div>

        <ku-loading-no-data :active="isLoading" :total="total" />

    </div>

    <div class="text-center pagination-kuc my-3">
        <el-pagination background layout="prev, pager, next" :total="total" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size="listQuery.limit" :current-page.sync="listQuery.page" @current-change="getList" hide-on-single-page></el-pagination>
    </div>

</div>
</template>

<script>
import { getList, del, myofferDone } from '@/api/my_treasure'
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
            options_status: [
                {
                    label: this.$t('status.on'),
                    value: 0
                },
                {
                    label: this.$t('status.approved'),
                    value: 1
                },
                {
                    label: this.$t('status.failed'),
                    value: 2
                },
            ],   
            total: 0,
            list: [],
            listQuery: {
                cate: '',
                date: '',
                page: 1,
                limit: 10
            },
            checked: [],
            checkAll: false,
            isIndeterminate: false,
        }
    },
    methods: {
        handleNew() {
            // this.$router.push({ path: "/my/buy/treasure/" + id })
            console.log("sldkfjslkdjf")
        },
        handelShow(id) {
            this.$router.push({ path: "/my/buy/treasure/" + id })
        },
        getList() {
            this.isLoading = true
            getList('buyer', this.listQuery).then(res => {
                this.list = res.items
                this.total = res.total
            }).finally(() => {
                this.isLoading = false
            })
        },
        handleFilter() {
            this.list = []
            this.total = 0
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
                del([id]).then(() => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'

                    });
                    // let t_index = this.list.findIndex(x => x.id == id)
                    // this.list.splice(t_index, 1)
                    this.handleFilter()
                })
            }).catch(() => {})
        },
        handleUpdate(id, index) {
            // this.list.splice(index, 1)
            this.$notify({
                title: this.$t('success'),
                message: this.$t('success.updated'),
                type: 'success'
            });
        },
        handleClose(item, index) {
            // this.$router.push({ path: "/my/buy/treasure" })
            if (!item.is_done) {
                this.$confirm(this.$t('source.close') + "?", this.$t('warning'), {
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
                    myofferDone(item.id).then(() => {                        
                        this.$notify({
                            title: this.$t('success'),
                            message: this.$t('source.close'),
                            type: 'success'
                        });
                        this.list[index]['is_done'] = 1
                    })
                }).catch(() => {})
            }
        },
    },
    mounted() {
        this.getList()
    }
}
</script>

<style lang="scss" scoped>

.btn-group-1 {
    span {
        min-width: 23%;
        min-width: 6rem;
    }
}
</style>
