<template>
<div>
    <kuc-page-header :title="$t('income.my')" to="/my" class="border-bottom"></kuc-page-header>

    <el-form ref="form" :rules="rules" :model="info" label-position="left" label-width="0">
        <div class="bg-white px-2">

            <el-alert v-if="alert_title" :title="alert_title" type="warning" show-icon @close="alert_title=''"></el-alert>

            <div class="py-input">
                <p>{{$t('transaction.balance')}} &nbsp;&nbsp; <span class="text-danger font-13">{{balance}}</span> <span class="text-dark9 font-09">元</span> </p>
            </div>
            <ku-line />

            <!-- 性别 sex -->
            <div class="py-input">
                <dlg-select :title="$t('transaction.mode')" :checked.sync="info.pay_mode" :list="[$t('transaction.alipay'), 'PayPal']" />
            </div>
            <ku-line />
            <!-- 手机  -->
            <el-form-item prop="price">
                <el-input v-model.number="info.price" placeholder="请输入金额" type="number" :max="balance">
                    <template slot="prepend">{{$t('transaction.withraw_amount')}}</template>
                    <template slot="append"> <span class="text-danger" @click="info.price = balance">{{$t('transaction.withraw_all')}}</span></template>
                </el-input>
            </el-form-item>

            <div class="text-center py-3">
                <el-button type="primary" @click="handleSubmit" class="w-50" round>{{$t('transaction.withraw_now')}}</el-button>
            </div>

        </div>
        <div class="px-2 mt-2">
            <ku-tab-line :list='tab_items' :activeTab.sync="listQuery.mode" @change="handleFilter" :activeTabBarWidth=30></ku-tab-line>
        </div>
        <div class="mt-2 bg-white px-2">
            <div v-for="item in list" :key="item.id">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <div>
                        <h3>{{$t(item.type)}} ({{item.contact}})</h3>
                        <p class="text-dark9 font-09 mt-1">{{item.processed_at}}</p>
                    </div>
                    <strong class="text-danger font-12">+￥{{item.amount}}</strong>
                </div>
                <ku-line />
            </div>
            <ku-loading-no-data :active="isLoading" :total="total" push />
        </div>
        <div class="text-center pagination-kuc my-2">
            <el-pagination background layout="prev, pager, next" :total="total" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size="listQuery.limit" :current-page.sync="listQuery.page" @current-change="getList" hide-on-single-page></el-pagination>
        </div>

    </el-form>
</div>
</template>

<script>
import { getTransactionList } from "@/api/transaction"
export default {
    middleware: 'authenticated',
    name: 'MyIncome',
    head() {
        return {
            title: this.$t('income.my')
        }
    },
    data() {
        var validateCustom = (rule, value, callback) => {
            if (value > this.balance) {
                callback(new Error(this.$t('valid.max.numeric', [this.$t('transaction.withraw_amount'), this.balance])));
            } else {
                callback();
            }
        };
        return {
            isLoading: true,
            list: [],
            total: 0,
            sum: 0,
            balance: 0,
            tab_items: [
                { id: 1, name: this.$t('income.detail') },
                { id: 2, name: this.$t('income.detail_w') },
            ],
            info: {
                pay_mode: 'PayPal',
                price: '',
            },
            listQuery: {
                mode: 1,
                page: 1,
                limit: 10
            },
            alert_title: "",
            rules: {
                price: [
                    { required: true, message: this.$t('valid.required', [this.$t('transaction.withraw_amount')]), trigger: ['blur', 'change'] },
                    // { max: this.balance, message: this.$t('valid.max.numeric', [this.$t('transaction.withraw_amount'), this.balance]), trigger: ['blur', 'change'] },
                    { validator: validateCustom, trigger: ['blur', 'change'] },
                    // { min: 100, message: this.$t('valid.min.numeric', [this.$t('transaction.withraw_amount'), 100]), trigger: ['blur', 'change'] },
                ]
            },
        }
    },    
    methods: {
        getList() {
            this.isLoading = true
            getTransactionList(this.listQuery).then(res => {
                this.list = res.items
                this.total = res.total
                this.balance = res.balance
                this.sum = res.sum
            }).finally(() => {
                this.isLoading = false
            })
        },
        handleFilter() {
            this.listQuery.page = 1
            this.getList()
        },
        handleSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.info.price < 100) {
                        this.alert_title = "提现金额最低不能低于100元"
                        return
                    } else {
                        this.$notify({
                            title: this.$t('success'),
                            message: this.$t('success.msg'),
                            type: 'success'
                        });
                    }
                }
            });
        },
    },
    mounted() {
        this.getList()
    }
}
</script>
