<template>
<div>
    <kuc-page-header :title="$t('subscription.i')" to="/my/sell">
        <span class="text-danger" @click="hToggleStatus(info.status)">{{info.status ? $t('subscription.un') : $t('subscription.do')}}</span>
    </kuc-page-header>
    <div class="mt-2 bg-white min-vh-100 px-2">
        <div class="py-1">
            <el-input v-model="info.email" placeholder="" :disabled='disable' @blur="hChangeEmail">
                <template slot="prepend">{{$t('subscription.done')}} </template>
                <template slot="append"><span class="text-dark9" @click="disable=false"><i class="el-icon-arrow-right"></i></span></template>
            </el-input>
        </div>
        <ku-line />
        <div class="mb-3">
            <h3 class="my-2">{{$t('buyer.lead')}}</h3>
            <div class="checkbox-button-container-rec my-1">
                <div v-for="item in temp.purchase_keyword" :key="item" class="tag">
                    {{item}} <span class="text-dark9" @click="hDelTitle('purchase_keyword', item)"><i class="el-icon-close"></i></span>
                </div>
            </div>
            <div class="d-flex">
                <div class="flex-1 border bg-darkF7 d-flex align-items-center">
                    <el-input v-model="temp.new.purchase_keyword" placeholder="" class="el-no-bg"></el-input>
                </div>
                <div class="text-white bg-danger text-nowrap px-4 py-2 border border-danger" @click="handleAdd('purchase_keyword')">
                    {{$t("add")}}
                </div>
            </div>
        </div>
        <div class="mb-3">
            <h3 class="my-2">{{$t('product.info')}}</h3>
            <div class="checkbox-button-container-rec my-1">
                <div v-for="item in temp.product_keyword" :key="item" class="tag">
                    {{item}} <span class="text-dark9" @click="hDelTitle('product_keyword', item)"><i class="el-icon-close"></i></span>
                </div>
            </div>
            <div class="d-flex">
                <div class="flex-1 border bg-darkF7 d-flex align-items-center">
                    <el-input v-model="temp.new.product_keyword" placeholder="" class="el-no-bg"></el-input>
                </div>
                <div class="text-white bg-danger text-nowrap px-4 py-2 border border-danger" @click="handleAdd('product_keyword')">
                    {{$t("add")}}
                </div>
            </div>
        </div>
        <div class="mb-3">
            <h3 class="my-2">{{$t('headline_news')}}</h3>
            <div class="checkbox-button-container-rec my-1">
                <div v-for="item in temp.article_keyword" :key="item" class="tag">
                    {{item}} <span class="text-dark9" @click="hDelTitle('article_keyword', item)"><i class="el-icon-close"></i></span>
                </div>
            </div>
            <div class="d-flex">
                <div class="flex-1 border bg-darkF7 d-flex align-items-center">
                    <el-input v-model="temp.new.article_keyword" placeholder="" class="el-no-bg"></el-input>
                </div>
                <div class="text-white bg-danger text-nowrap px-4 py-2 border border-danger" @click="handleAdd('article_keyword')">
                    {{$t("add")}}
                </div>
            </div>
        </div>
        <div class="mb-3">
            <h3 class="my-2">{{$t('subscription.cycle')}}</h3>
            <div class="radio-button-container my-1">
                <el-radio-group v-model="temp.duration" class="d-flex flex-wrap justify-content-between" @change="handleSubmit()">
                    <el-radio-button v-for="(hopeO, ind) in hopeOptions" :label="hopeO" :key="ind">{{hopeO.label}}</el-radio-button>
                </el-radio-group>
            </div>
        </div>

    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { doSubscribe } from '~/api/user'
export default {
    middleware: 'authenticated',
    name: "MyEmail",
    head() {
        return {
            title: this.$t('subscription.i')
        }
    },
    data() {
        return {
            disable: true,
            hopeOptions: [{
                    duration: 3,
                    duration_unit: 'days',
                    label: this.$t('duration.days', [this.$t('3')])
                },
                {
                    duration: 1,
                    duration_unit: 'week',
                    label: this.$t('duration.week')
                },
                {
                    duration: 1,
                    duration_unit: 'month',
                    label: this.$t('duration.month')
                },
                {
                    duration: 3,
                    duration_unit: 'months',
                    label: this.$t('duration.months', [this.$t('3')])
                },
            ],
            info: {
                user_id: this.$store.state.auth.id,
                duration: 0,
                duration_unit: "",
                email: this.$store.state.auth.email_subscribe,
                article_keyword: null,
                product_keyword: null,
                purchase_keyword: null,
                status: 0,
            },

            temp: {
                new: {
                    purchase_keyword: '',
                    product_keyword: '',
                    article_keyword: '',
                },
                purchase_keyword: [],
                product_keyword: [],
                article_keyword: [],
                duration: {}
            },
        }
    },
    computed: {},
    methods: {
        handleSubmit() {
            this.info.purchase_keyword = this.temp.purchase_keyword.join(',')
            this.info.product_keyword = this.temp.product_keyword.join(',')
            this.info.article_keyword = this.temp.article_keyword.join(',')
            if (!this.temp.duration.duration) {
                this.temp.duration = this.hopeOptions[0]
            }
            this.info.duration = this.temp.duration.duration
            this.info.duration_unit = this.temp.duration.duration_unit

            this.$store.dispatch("common/setLoading")
            doSubscribe(this.info).then(res => {

            }).finally(() => {
                this.$store.dispatch("common/setLoading", false)
                this.temp.new = {
                    purchase_keyword: '',
                    product_keyword: '',
                    article_keyword: '',
                }
            })
        },
        handleAdd(tag_type) {
            const new_v = this.temp.new[tag_type]
            if (new_v) {
                const exist_ = this.temp[tag_type].find(rr => rr == new_v)
                if (exist_) {
                    this.$notify({
                        title: this.$t('error'),
                        message: 'Already Exist',
                        type: 'error'
                    });
                } else {
                    this.temp[tag_type].push(new_v)
                    this.handleSubmit()
                }
            }
        },
        hChangeEmail() {
            this.disable = true
            this.handleSubmit()
        },
        hToggleStatus(cur_status) {
            this.info.status = cur_status ? 0 : 1
            this.handleSubmit()
        },
        hDelTitle(tag_type, title) {
            const iii = this.temp[tag_type].findIndex(rr => rr == title)
            if (iii > -1) {
                this.temp[tag_type].splice(iii, 1)
                this.handleSubmit()
            }
        }
    },
    mounted() {
        this.$store.dispatch('getMyInfo').then(() => {
            if (this.$store.state.auth_numbers.user.subscribe) {
                this.info = Object.assign({}, this.$store.state.auth_numbers.user.subscribe)
                this.temp.purchase_keyword = this.info.purchase_keyword ? this.info.purchase_keyword.split(',') : []
                this.temp.product_keyword = this.info.product_keyword ? this.info.product_keyword.split(',') : []
                this.temp.article_keyword = this.info.article_keyword ? this.info.article_keyword.split(',') : []
                const kkk = this.hopeOptions.find(rr => rr.duration_unit == this.info.duration_unit)
                if (kkk) this.temp.duration = kkk

            }
        })
    },
}
</script>

<style lang="scss" scoped>
.tag {
    border: 1px solid #dee2e6;
    border-radius: 5px;
    padding: 6px 7px;
    margin-right: 5px;
    margin-bottom: 3px;
    min-width: 4rem;
    display: inline-block;

    span {
        float: right;
    }
}
</style>
