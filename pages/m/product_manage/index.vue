<template>
<div>
    <el-row class="filter-box border-bottom bg-white">
        <el-col :span="6">
            <el-select v-model="listQuery.is_recommend" placeholder="" @change="handleFilter">
                <el-option v-for="item in options_recom" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-col>
        <el-col :span="6">
            <el-select v-model="listQuery.status" placeholder="" @change="handleFilter">
                <el-option key="price_all" :label="$t('status.i')" value="">{{$t('all')}}</el-option>
                <el-option v-for="item in options_status" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-col>
        <el-col :span="6">
            <el-select v-model="listQuery.customcategory_id" placeholder="" @change="handleFilter">
                <el-option key="cate_all" :label="$t('cate.custom')" value="">{{$t('all')}}</el-option>
                <el-option v-for="item in category_me" :key="item.id" :label="`${item.name[$i18n.locale]}`" :value="item.id"></el-option>
            </el-select>
        </el-col>
        <el-col :span="6">
            <el-select v-model="listQuery.created_from" placeholder="" @change="handleFilter">
                <el-option key="date_all" :label="$t('post.date')" value="">{{$t('all')}}</el-option>
                <el-option v-for="item in options_date" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-col>
    </el-row>
    <div class="mt-2 p-2 bg-white">

        <el-checkbox-group v-model="checked" class="check-box-label-div" @change="handleCheckedChange">
            <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
                <div class="d-flex">
                    <img :src="getImg1(item.assets)" alt=" " class="fit-content">
                    <div class="ml-2 flex-1">
                        <div class="d-flex justify-content-between mb-2" @click.prevent="goProductDetail(item)">
                            <h3 class="flex-1 text-line-1 text-dark28">{{item.name[$i18n.locale]}}</h3>
                            <span class="bg-danger px-2 py-1 text-white rounded font-07" v-if="item.is_pindan">{{$t('is.pin_yes')}}</span>
                        </div>
                        <div class="text-dark9">
                            <el-row class="mb-2">
                                <el-col :span="12">{{$t('product')}}{{$t('unit_price')}}：￥{{item.price}}</el-col>
                                <el-col :span="12" class="text-right">{{$t('moq')}}：{{item.min_quantity}}{{item.unit.name[$i18n.locale]}}</el-col>
                            </el-row>
                            <el-row class="mb-2">
                                <el-col :span="12">{{$t('cate.product')}}: {{gsv(['name', $i18n.locale], item.category)}}</el-col>
                                <el-col :span="12" class="text-right">{{parseTime(item.created_at, "{y}.{m}.{d} {h}:{i}")}}</el-col>
                            </el-row>
                        </div>
                        <div class="mb-1 d-flex justify-content-between">
                            <span class="flex-1 border rounded py-2 text-center text-dark28 text-nowrap mr-3" :class="item.is_recommend ? 'bg-danger text-white': ''" @click.prevent="handelToRecom(item.id, item.is_recommend)">{{item.is_recommend ? $t('recomm') :$t('recom.set')}}</span>
                            <span class="flex-1 border rounded py-2 text-center text-dark28 mr-3" @click="handelEdit(item.id, $event)">{{$t('edit')}}</span>
                            <span class="flex-1 border rounded py-2 text-center text-danger border-danger" @click="handelDel(item.id, $event)">{{$t('del')}}</span>

                        </div>

                    </div>
                </div>
            </el-checkbox>
        </el-checkbox-group>

        <ku-loading-no-data :active="isLoading" :total="total" />

    </div>
    <div class="text-center pagination-kuc mt-2 pb-5">
        <el-pagination background layout="prev, pager, next" :total="total" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size="listQuery.limit" :current-page.sync="listQuery.page" @current-change="getList" :hide-on-single-page='true'></el-pagination>
        <p class="text-dark6 mt-2 px-2">{{$t('desc')}}: {{$t('msg.will_top_order')}}</p>
    </div>

    <div class="fixed-bottom a-m-900 px-2 py-1 bg-white">
        <div class="d-flex justify-content-between align-items-center">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{$t('select.all')}}</el-checkbox>
            <el-button class="ml-3 text-dark6" type="text" @click="handleToTopOrder">{{$t('refresh_multi')}}</el-button>

            <p class="text-dark6" v-if="$i18n.locale=='zh'">{{$t('page.total')}}<span class="text-danger">{{total}}</span>{{$t('page.items')}}</p>
            <p class="text-dark6" v-else>Total <span class="text-danger">{{total}}</span></p>
        </div>
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getMyList, toRecom, del, toTop } from '@/api/product'
const MAX_RECOM_LIMIT = 8
export default {
    name: "MyProduct",
    middleware: 'authenticated',
    data() {
        return {
            isLoading: true,
            total_recommend: 0,
            total: 0,
            list: [],
            listQuery: {
                user_id: this.$store.state.auth.id,
                is_recommend: '',
                status: '',
                customcategory_id: '',
                created_from: '',
                page: 1,
                limit: 10
            },
            checked: [],
            checkAll: false,
            isIndeterminate: false,
            options_recom: [{
                    label: this.$t('all'),
                    value: ''
                },
                {
                    label: this.$t('recom.product'),
                    value: true
                },
                // {
                //     label: '热销产品',
                //     value: 'hot'
                // },
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
        }
    },
    computed: {
        ...mapState('common', { category_me: state => state.list.product_custom_categories }),
    },
    methods: {
        ...mapActions('common', ['getUnitsList']),
        getList() {
            this.isLoading = true
            getMyList(this.listQuery).then(res => {
                this.list = res.products
                this.total = res.total,
                    this.total_recommend = res.count_recommend
            }).finally(() => {
                this.isLoading = false
                this.checked = []
            })
        },
        handleFilter() {
            // console.log('Filter working..', this.listQuery)
            this.listQuery.page = 1;
            this.list = [];
            this.total = 0
            this.getList()
        },
        handleCheckAllChange(val) {
            // console.log(val)
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
        handelToRecom(id, is_recommend) {
            if ((is_recommend == 0 && this.total_recommend < MAX_RECOM_LIMIT) || is_recommend == 1) {
                toRecom(id).then(re => {
                    const iii = this.list.findIndex(rr => rr.id == id)
                    if (iii > -1) {
                        this.list[iii]['is_recommend'] = this.list[iii]['is_recommend'] ? 0 : 1
                        if (is_recommend) this.total_recommend -= 1
                        else this.total_recommend += 1
                    }
                })
            } else {
                this.$notify({
                    title: this.$t('error'),
                    message: this.$t('msg.product_max_limit', [MAX_RECOM_LIMIT]),
                    type: 'error'
                });
            }
        },
        goProductDetail(item) {
            this.$router.push({ path: `/product/${item.id}` })
        },
        handelEdit(id, event) {
            event.preventDefault()
            this.$router.push({ path: "/product_manage/" + id })
        },
        handelDel(id, event) {
            event.preventDefault()
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
                del([id]).then(re => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'
                    });
                    this.listQuery.page = 1
                    this.getList()
                })
            }).catch(() => {})
        },
        handleToTopOrder() {
            toTop(this.checked).then(re => {
                this.$notify({
                    title: this.$t('success'),
                    message: this.$t('success.msg'),
                    type: 'success'
                });
                this.listQuery.page = 1
                this.getList()
            })
        }
    },
    mounted() {
        this.getList();
        if (!this.category_me.length)
            this.getUnitsList(['product_custom_categories'])
    },
}
</script>
