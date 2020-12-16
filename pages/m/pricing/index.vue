<template>
<div>
    <kuc-page-header :title="$t('member.apply')"></kuc-page-header>
    <div class="header-container">
        <!-- <img src="/logo/logo@2x.png" width="250" alt=""> -->
        <span class="dot-effect dot-effect-left1"></span>
        <span class="dot-effect dot-effect-left2"></span>
        <span class="dot-effect dot-effect-right2"></span>
        <span class="dot-effect dot-effect-right3"></span>
        <div class="text-white px-3 py-3">
            <h2 class="mb-2 text-center">蚂蚁街Antway</h2>
            <p class="text-center">{{$t('msg.pricing_1')}}</p>
        </div>
    </div>
    <p class="px-2 my-2 text-dark6">{{$t('msg.pricing_2')}}</p>
    <div class="px-3" v-if="auth.status_verified==1 || auth.vip_id_pending">
        <el-alert :title="$t('btn.apply_pending')" type="warning" show-icon :closable="false"></el-alert>
    </div>
    <div>
        <div class="example-3d">
            <client-only>
                <swiper ref="mySwiper" class="swiper" :options="swiperOption" @slideChange="handleCard" :key="slideKey">
                    <swiper-slide v-for="(item, index) in pricing_cate" :key="item.id">
                        <div class="text-center">
                            <svg-icon v-if="index==0" name="real_name_auth" color="#DA1212" width="60" height="60"></svg-icon>
                            <svg-icon v-if="index==1" name="diamond" color="#DA1212" width="50" height="50"></svg-icon>
                            <svg-icon v-if="index==2" name="wen_jiu" color="#DA1212" width="60" height="60"></svg-icon>
                        </div>
                        <h2 class="text-center my-2">{{gsv([$i18n.locale], item.name)}}{{$i18n.locale == 'en' ? ' ' : ''}}{{$t('member.i')}}</h2>
                        <div class="text-center">
                            <h1 v-if="item.price==0" class="text-danger border-danger d-inline px-2" style="border-bottom: 3px solid">{{$t('free')}}</h1>
                            <h1 v-else class="text-danger border-danger d-inline px-2" style="border-bottom: 3px solid">{{item.price}}<span class="font-1">{{$t('unit_yuen_p_year')}}</span></h1>
                        </div>
                        <h3 class="text-center text-danger mt-3">{{$t('member.permission')}}</h3>
                        <div class="fuc-container px-3 mt-2">
                            <div class="d-flex p-1" v-for="(pp, kk) in permissions" :key="kk">
                                <span :class="{active: getActive(pp, item.permissions)}"></span>
                                <p class="text-dark9">{{gsv([$i18n.locale], pp.name)}}</p>
                            </div>
                        </div>
                    </swiper-slide>
                </swiper>
            </client-only>
        </div>
        <div class="px-5 mb-5" v-if="pricing_cate.length">
            <el-button type="primary" @click="handleOK" round class="w-100" :disabled="disableStatus">
                <!-- (gsv([activePricingIndex, 'id'], pricing_cate) || 0) <= $store.getters.userLevel || auth.status_verified==1 -->
                {{$t('btn.apply')}}
            </el-button>
        </div>
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { pricing_list, getMyInfo } from "@/api/user"
export default {
    middleware: 'authenticated',
    name: "Pricing",
    head() {
        return {
            title: this.$t('member.apply')
        }
    },
    data() {
        return {
            activePricingIndex: 0,
            swiperOption: {
                effect: 'coverflow',
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                coverflowEffect: {
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true
                }
            },
            slideKey: 'slideKey'
        }
    },
    // async asyncData({ params, store }) {
    //     const pricing_list_res = await pricing_list()    
    //     console.log(pricing_list_res, 'addd', store.auth)    
    //     return {
    //         // pricing_cate: pricing_list_res.vips,
    //         // permissions: pricing_list_res.permissions,
    //     }
    // },
    computed: {
        ...mapState('pricing', ['permissions', 'pricing_cate']),
        ...mapState(['auth']),
        disableStatus: function () {
            let st = false
            const cur_id = this.gsv([this.activePricingIndex, 'id'], this.pricing_cate) || 0
            if (!this.auth.status_verified) {
                st = false
            } else if (this.auth.status_verified == 1) {
                st = [4, 5].includes(cur_id)
            } else {
                if (cur_id == 3) st = true
                else {
                    if (this.auth.vip_id == cur_id) st = true
                    if (this.auth.vip_id_pending) {
                        if (cur_id != this.auth.vip_id_pending) st = true
                    }
                    if (this.auth.vip_id == 5) st = true
                }
            }
            return st
        }
    },
    methods: {
        ...mapActions('pricing', ['getPricingList']),
        getActive(permission, permissions) {
            let kk = permissions.filter(rr => rr.id == permission.id)
            if (kk.length) return true
            return false
        },
        handleCard() {
            this.activePricingIndex = this.$refs.mySwiper.$swiper.activeIndex
        },
        handleOK() {
            let index_id = this.pricing_cate[this.activePricingIndex]['id']
            // console.log(index_id)
            if (this.$route.query.redirect)
                localStorage.setItem('mAntway_redirect', this.$route.query.redirect)
            this.$router.push({ 'path': `/pricing/${index_id}/step1` })
        }
    },
    mounted() {
        this.getPricingList().then(() => {
            const vip_id = this.$route.query.lev
            if (vip_id) {
                const int_vip_id = parseInt(vip_id)
                const is_exist = this.pricing_cate.findIndex(rr => rr.id == int_vip_id)
                if (is_exist) {
                    this.activePricingIndex = is_exist
                    this.swiperOption.initialSlide = is_exist
                    this.slideKey = +new Date()
                }
            }
        })
        getMyInfo().then(response => {
            this.$store.dispatch('setUserAuth', response.user)
        })
    }

}
</script>

<style lang="scss" scoped>
.header-container {
    position: relative;
    background: linear-gradient(to right, #F81B2B, #F530B2);
}

.dot-effect-left1 {
    width: 10rem;
    height: 10rem;
    left: -4rem;
    bottom: -4rem;
}

.dot-effect-left2 {
    left: 20%;
    bottom: 5rem;
    width: 2rem;
    height: 2rem;
}

.dot-effect-right2 {
    width: 7rem;
    height: 7rem;
    right: -3rem;
    top: -3rem;
}

.dot-effect-right3 {
    width: 5rem;
    height: 5rem;
    right: 4rem;
    top: 2rem;
}

.price-card {
    width: calc(100vw - 4rem);
    margin: 0 auto;
}

.fuc-container {
    span {
        display: inline-block;
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 1rem;

        &.active {
            background: url(/icons/circle_checked.svg) no-repeat;
            background-size: contain;
        }
    }
}

.example-3d {
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;
}

.swiper {
    height: 100%;
    width: 100%;

    .swiper-slide {
        width: calc(100vw - 4rem);
        max-width: calc(768px - 4rem);
        padding: 1rem;
        height: max-content;
        background-color: white;
        background-position: center;
        background-size: cover;
    }

}
</style>
