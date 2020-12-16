<template>
<div>
    <kuc-page-header :title="$t('moving.company')" to="/my/sell"></kuc-page-header>
    <div>
        <div class="d-flex justify-content-between align-items-center bg-white px-2">
            <el-select v-model="listQuery.date" placeholder="" style="width: 9rem;" @change="getFilter">
                <el-option key="date_all" :label="$t('post.date')" value="">{{$t('all')}}</el-option>
                <el-option v-for="item in options_date" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <nuxt-link to="/my/sell/company_news/new" class="text-danger">{{$t('moving.post')}}</nuxt-link>
        </div>

        <div class="bg-white px-2">
            <div v-for="(item, index) in list" :key="item.id">                
                <div class="d-flex">
                    <card-r :title="item.title" :poster="gsv([0, 'url'], item.covers)" nl class="flex-1" :key="item.id" @click.native="goDetail(item.id)">
                        <div class="d-flex justify-content-between text-dark9 font-09">
                            <p>{{item.comments}}{{$t('comment')}}⋅ {{formatTime(item.created_at)}} </p>
                            <p><svg-icon name="eye-open"></svg-icon> {{item.views}}</p> 
                        </div>
                    </card-r>
                    <div class="d-flex align-items-center pl-3" @click="handleDelete(item.id)">
                        <p class="p-2 text-dark9 font-12"><i class="el-icon-delete"></i></p>
                    </div>
                </div>
                <ku-line v-if="index<list.length-1"/>
            </div>
            <ku-loading-no-data :active="is_loading" :total="total" />
        </div>

    </div>
    <div class="text-center pagination-kuc my-3">
        <el-pagination background layout="prev, pager, next" :total="total" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size="listQuery.limit" :current-page.sync="listQuery.page" @current-change="getList" hide-on-single-page></el-pagination>
    </div>

</div>
</template>

<script>
import { statusList, statusDel } from "~/api/my_company"
import { getList } from "~/api/article"
export default {
    middleware: ['authenticated',],
    components: { },
    data() {
        return {
            is_loading : true,
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
                // company_id: this.$store.state.auth.company_id,
                page: 1,
                limit: 5,
                date: '',
                category_id: 11,
                mode: 0,
                status: 4,
                user_id: this.$store.state.auth.id,
                tag: 'company_status'
            }
        }
    },
    methods: {
        getList() {
            this.is_loading = true
            getList(this.listQuery).then(res => {
                this.list = res.items
                this.total = res.total
            }).finally(() => {
                this.is_loading = false
            })
        },
        getFilter() {
            this.listQuery.page = 1
            this.getList()
        },
        // confirm-delete              
        handleDelete(id) {
            console.log(id)
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
                statusDel(id).then(re => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'

                    });
                    let t_index = this.list.findIndex(x => x.id == id)
                    this.list.splice(t_index, 1)
                    this.total --
                })
            }).catch(() => {})
        },
        goDetail(id){
            this.$router.push({path: `/article/${id}`})
        }
    },
    mounted() {
        this.getList()
    }
}
</script>