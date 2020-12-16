<template>
<div>
    <div class="bg-white filter-box-2 px-2">
        <el-select v-model="listQuery.duration" placeholder="" @change="handleFilter">
            <el-option key="date_all" :label="$t('post.date')" value="">{{$t('all')}}</el-option>
            <el-option v-for="item in options_date" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </div>
    <!-- list -->
    <div class="mt-2 px-2 pt-2 bg-white">
        <el-checkbox-group v-model="checked" class="check-box-label-div" @change="handleCheckedChange">
            <div v-for="item in list" :key="item.id">
                <el-checkbox :label="item.id">
                    <div class="d-flex align-items-center">
                        <div class="flex-1">
                            <div class="d-flex align-items-center" @click.prevent="handleDetail(item.id)">
                                <h3 class="text-line-1 ml-2 text-dark28 flex-1">{{gsv(['title_'+$i18n.locale], item)}}</h3>
                                <span v-if="item.is_viewed==1" class="text-white bg-danger py-1 px-2 rounded font-08">{{$t('status.read')}}</span>
                                <span v-else class="text-white bg-dark6 py-1 px-2 rounded font-08">{{$t('status.read_n')}}</span>
                            </div>
                            <p class="text-dark9 font-09 mt-1">&nbsp; {{parseTime(item.created_at, '{y}-{m}-{d}')}} &nbsp;&nbsp; <span>{{item.assets.length ? $t('attachment.is') : ''}}</span> </p>
                        </div>
                        <el-button type="text" @click="handleDelete([item.id])" icon="el-icon-delete p-2 font-11 text-dark9"></el-button>
                    </div>
                </el-checkbox>
                <ku-line></ku-line>
            </div>
        </el-checkbox-group>
        <ku-loading-no-data :active="isLoading" :total="total" />
    </div>

    <div class="text-center pagination-kuc mt-2">
        <el-pagination background layout="prev, pager, next" :total="total" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size=10 :current-page.sync="listQuery.page" @current-change="getList" hide-on-single-page></el-pagination>
    </div>

    <!-- bottom -->
    <div class="fixed-bottom a-m-900 px-2 py-1 bg-white">
        <div class="d-flex justify-content-between align-items-center">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{$t('select.all')}}</el-checkbox>
            <el-button type="text" @click="handleDelete(checked)" :class=" !checked.length ? `ml-3 text-dark6` : 'ml-3 text-dark28'" :disabled="!checked.length">{{$t('del_multi')}}</el-button>
            <p class="text-dark6">{{$t('page.total')}}<span class="text-danger">{{total}}</span>{{$t('page.items')}}</p>
        </div>
    </div>
</div>
</template>

<script>
import { getList, del } from '@/api/notice'
export default {
    name: "NoticeIndex",
    data() {
        return {
            isLoading: true,
            total: 0,
            list: [],
            listQuery: {
                duration: '',
                page: 1,
                limit: 10
            },
            checked: [],
            checkAll: false,
            isIndeterminate: false,
            options_date: [{
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
        }
    },
    methods: {
        getList() {
            this.isLoading = true
            getList(this.listQuery).then(res => {
                this.list = res.items
                this.total = res.total
            }).finally(() => {
                this.isLoading = false
            })
        },
        handleFilter() {
            this.total = 0
            this.list = []
            this.getList()
        },
        handleCheckAllChange(val) {
            if (val) {
                var nn = []
                this.list.forEach(el => {
                    nn.push(el.id)
                });
                this.checked = nn
            } else {
                this.checked = []
            }
            this.isIndeterminate = false;
        },
        handleCheckedChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.list.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length;
        },
        handleDelete(ids) {
            console.log(ids)
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
                del(ids).then(re => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'
                    });
                    this.getList()
                })
            }).catch(() => {})
        },
        handleDetail(id) {
            this.$router.push({ path: '/notice/' + id })
        }
    },
    created() {
        this.getList()
    }
}
</script>
