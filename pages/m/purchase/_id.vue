<template>
<div>
    <kuc-page-header :title="$t('purchase.detail')"></kuc-page-header>
    <div class="mt-2" v-if="info.title">
        <div class="bg-white rounded p-2">
            <div>
                <h2>{{info.title}}</h2>
                <h2>{{gsv([$i18n.locale], info.title)}}</h2>
                <div class="my-2 d-flex font-09">
                    <!-- <p class="border px-2 py-1 mr-2 text-nowrap font-09">tag</p> -->
                    <p v-for="(tag,ii) in info.tags" :key="ii" class="border px-2 py-1 mr-2 text-nowrap font-09">{{tag}}</p>
                </div>
                <p>{{info.description[$i18n.locale]}}</p>
                <div>
                    <p><span class="text-dark9">{{$t('post.date')}}：</span> {{parseTime(info.created_at, '{y}-{m}-{d} {h}:{i}')}}</p>
                    <p><span class="text-dark9">{{$t('source.quantity')}}：</span> {{info.quantity}}{{gsv(['name', $i18n.locale], info.unit)}}</p>
                    <div class="d-flex align-items-center">
                        <span class="text-dark9">{{$t('product')}}{{$t('image')}}：</span>
                        <ku-media-box v-if="info.assets" :assets="info.assets"></ku-media-box>
                        <svg-icon name='no-data' width='100' height="50" v-else></svg-icon>
                    </div>
                </div>
            </div>
            <!-- 采购商信息 -->
            <div class="mt-3">
                <h3>{{$t('buyer.info')}}</h3>
                <div v-if="$store.getters.userLevel == 5 || ($store.getters.myId == info.user.id )">
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('name')}}：</p>
                        <p> {{info.user.user_name}}</p>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('company')}}：</p>
                        <p> {{gsv(['name', $i18n.locale], info.user.company)}}</p>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('phone')}}：</p>
                        <a :href="'tel:'+info.user.phone"> {{info.user.phone}}</a>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('mobile')}}： </p>
                        <a :href="'tel:'+info.user.user_name"> {{info.user.user_name}}</a>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('email')}}：</p>
                        <a :href="'mailto:'+info.user.email"> {{info.user.email}}</a>
                    </div>
                </div>
                <ku-d-show v-else></ku-d-show>
            </div>
            <!-- button -->
            <div class="text-center my-4">
                <!-- :disabled="$store.getters.myId == info.user_id || $store.getters.userLevel != 5" -->
                <el-button type="danger" round class="w-75" @click="handleOK" :disabled="$store.getters.myId == info.user_id">{{$t('want.quote')}}</el-button>
            </div>
        </div>

        <!-- reviews -->
        <ku-title-line class="px-2">
            {{$t('quoted')}}（{{info.offers.length}}<span v-if="$i18n.locale=='zh'">人</span>）
        </ku-title-line>

        <div class="py-2 pl-2 bg-white">
            <no-data v-if="!info.offers.length"></no-data>
            <div v-for="his in info.offers" :key='his.id' class="mt-2 py-1 history-item">
                <nuxt-link :to="'/purchase/offer/'+his.id">{{his.contact_company}}</nuxt-link>
                <p class="text-dark9 font-08 mt-1">{{parseTime(his.created_at, '{y}.{m}.{d} {h}:{i}')}}</p>
            </div>

        </div>
    </div>
    <no-data v-else />
</div>
</template>

<script>
import { getDetail } from '@/api/treasure'

export default {
    name: 'TreasureDetails',
    middleware: ['authenticated'],
    components: {},
    // directives: {
    //     loading: {
    //         bind: function (el, binding, vnode) {
    //             // console.log(binding)
    //             var ttt = gsv([binding.value, 'zh'], binding.arg)
    //             // if (!vnode.children){
    //             if (!ttt) {
    //                 var css_name = "loading" + Math.floor(Math.random() * 3)
    //                 el.classList.add(css_name)
    //             } else {
    //                 el.innerHTML = ttt
    //             }
    //         }
    //     }
    // },
    data() {
        return {
            info: {},
            value: "一号馆"
        }
    },
    head() {
        return {
            title: this.info.title ? `${this.info.title}-${this.$t('purchase.bao')}` : this.$t('purchase.bao')
        }
    },
    async asyncData({ params, redirect }) {
        let info = {}
        const res = await getDetail(params.id)
        if (res) {
            info = res.purchase || {}
        } else {
            redirect("/purchase")
        }
        return { info }
    },
    methods: {
        handleOK() {
            if (this.$store.getters.userLevel == 5) {
                this.$router.push({ path: '/purchase/offer/create/' + this.$route.params.id })
            } else {
                const title = this.$t('warning')
                const path = '/pricing?lev=5'
                let content = this.$t('msg.permission_upgrade_wen')                

                this.$confirm(content, title, {
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
                    this.$router.push({ path })
                }).catch(() => {})
            }
        },
    },
    mounted() {
        // getDetail(this.$route.params.id).then(res => {
        //     this.info = res.purchase
        // }).catch(err => {
        // })
        if (!this.info.title) {
            setTimeout(() => {
                this.goBack()
            }, 1000);
        }
    },
}
</script>

<style lang="scss" scoped>
// scss variables
@import "@/assets/scss/config/_variables.scss";

.history-item {
    border-bottom: 1px solid #CCCCCC;

    &:last-child {
        border: none;
    }
}
</style>
