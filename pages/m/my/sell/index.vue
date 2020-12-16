<template>
<div>
    <!-- Top part -->
    <kuc-page-header :title="$t('want.sell')" to="/my"></kuc-page-header>

    <div class="p-2 mb-5" style="position:relative">

        <!-- 我要参展 -->
        <nuxt-link to="/my/sell/participate" class="bg-white py-2 d-flex justify-content-between align-items-center rounded">
            <p class="flex-1 px-2">{{$t('want.expo')}}</p>
            <div class="p-2 text-dark9">
                <i class="el-icon-arrow-right"></i>
            </div>
        </nuxt-link>
        <nuxt-link to="/expo_duty" class="bg-white py-2 d-flex justify-content-between align-items-center rounded mt-1">
            <p class="flex-1 px-2">{{$t('expo.manage')}}</p>
            <div class="p-2 text-dark9">
                <i class="el-icon-arrow-right"></i>
            </div>
        </nuxt-link>

        <nuxt-link to="/product_manage" class="bg-white py-2 d-flex justify-content-between align-items-center rounded mt-3">
            <p class="flex-1 px-2">{{$t('product.manage')}}</p>
            <div class="p-2 text-dark9">
                <i class="el-icon-arrow-right"></i>
            </div>
        </nuxt-link>

        <nuxt-link to="/my/sell/inquiry" class="bg-white py-2 d-flex justify-content-between align-items-center rounded mt-3">
            <p class="flex-1 px-2">{{$t('xunpan.my')}}</p>
            <div class="p-2 text-dark9">
                <i class="el-icon-arrow-right"></i>
            </div>
        </nuxt-link>
        <nuxt-link to="/my/sell/treasure" class="bg-white py-2 d-flex justify-content-between align-items-center rounded mt-1">
            <p class="flex-1 px-2">{{$t('purchase.bao')}}</p>
            <div class="p-2 text-dark9">
                <i class="el-icon-arrow-right"></i>
            </div>
        </nuxt-link>
        <nuxt-link to="/my/sell/pindan" class="bg-white py-2 d-flex justify-content-between align-items-center rounded mt-1">
            <p class="flex-1 px-2">{{$t('pin.bao')}}</p>
            <div class="p-2 text-dark9">
                <i class="el-icon-arrow-right"></i>
            </div>
        </nuxt-link>

        <div @click="goTo('/my/sell/buyer', 5)" class="bg-white py-2 d-flex justify-content-between align-items-center rounded mt-3">
            <p class="flex-1 px-2">{{$t('buyer.my')}}</p>
            <div class="p-2 text-dark9">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
        <div @click="goTo('/my/sell/ads', 5)" class="bg-white py-2 d-flex justify-content-between align-items-center rounded mt-1">
            <p class="flex-1 px-2">{{$t('ads.p_apply')}}</p>
            <div class="p-2 text-dark9">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>

        <div @click="goTo('/my/sell/company_info', 5)" class="bg-white py-2 d-flex justify-content-between align-items-center rounded mt-3">
            <p class="flex-1 px-2">{{$t('info.company')}}</p>
            <div class="p-2 text-dark9">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
        <div @click="goTo('/my/sell/company_file', 5)" class="bg-white py-2 d-flex justify-content-between align-items-center rounded mt-1">
            <p class="flex-1 px-2">{{$t('company.pic')}}/{{$t('videos')}}</p>
            <div class="p-2 text-dark9">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
        <div @click="goTo('/my/sell/company_news', 5)" class="bg-white py-2 d-flex justify-content-between align-items-center rounded mt-1">
            <p class="flex-1 px-2">{{$t('moving.company')}}</p>
            <div class="p-2 text-dark9">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>

        <div to="/my/sell/invite" class="bg-white py-2 d-flex justify-content-between align-items-center rounded mt-3" @click="goToInvite">
            <p class="flex-1 px-2">{{$t('invite')}}</p>
            <div class="p-2 text-dark9">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>

        <nuxt-link to="/my/email" class="bg-white py-2 d-flex justify-content-between align-items-center rounded mt-3">
            <p class="flex-1 px-2">{{$t('subscription.i')}}</p>
            <div class="p-2 text-dark9">
                {{$store.state.auth.email_subscribe}}<i class="el-icon-arrow-right"></i>
            </div>
        </nuxt-link>

    </div>
    <br>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    middleware: 'authenticated',
    name: 'MySell',
    head() {
        return {
            title: this.$t('want.sell')
        }
    },
    data() {
        return {}
    },
    computed: {
        ...mapState('common', {
            running_expos: state => state.list.running_expos
        }),
        ...mapGetters(['userLevel']),
        ...mapState(['auth_numbers']),
    },
    methods: {
        ...mapActions('common', ['getUnitsList']),
        async goToInvite() {
            if (this.userLevel == 5) {
                // if (!this.running_expos.length)
                //     await this.getUnitsList(['running_expos'])

                let expo_prefix = this.gsv(['company', 'cur_expos', 0, 'prefix'], this.auth_numbers.user)
                if (expo_prefix) {
                    if (!this.running_expos.length)
                        await this.getUnitsList(['running_expos'])
                    const cur_expo = this.running_expos.find(rr => rr.prefix == expo_prefix)
                    if (cur_expo) {
                        this.$router.push({ path: '/invite', query: { inviter: this.$store.state.auth.id, expo_id: cur_expo.id } })
                    }
                } else {
                    this.$confirm(this.$t('msg.no_expo_do_you_want'), this.$t('warning'), {
                        confirmButtonText: this.$t('btn.apply'),
                        cancelButtonText: this.$t('confirm.cancle'),
                        showClose: false,
                        showCancelButton: true,
                        confirmButtonClass: 'text-danger',
                        cancelButtonClass: 'border-right',
                        customClass: 'ku-confirm',
                        dangerouslyUseHTMLString: true,
                        center: true,
                    }).then(() => {
                        this.$router.push({ path: "/my/sell/participate"})
                    }).catch(() => {})
                }
            } else {
                this.$confirm("没权限使用该功能", this.$t('warning'), {
                    confirmButtonText: this.$t('btn.apply'),
                    cancelButtonText: this.$t('confirm.cancle'),
                    showClose: false,
                    showCancelButton: true,
                    confirmButtonClass: 'text-danger',
                    cancelButtonClass: 'border-right',
                    customClass: 'ku-confirm',
                    dangerouslyUseHTMLString: true,
                    center: true,
                }).then(() => {
                    this.$router.push({ path: "/pricing", query: { lev: permission_id } })
                }).catch(() => {})
            }
        },
        goTo(path, permission_id) {
            if (this.userLevel >= permission_id) {
                this.$router.push({ path })
            } else {

                this.$confirm("没权限使用该功能", this.$t('warning'), {
                    confirmButtonText: this.$t('btn.apply'),
                    cancelButtonText: this.$t('confirm.cancle'),
                    showClose: false,
                    showCancelButton: true,
                    confirmButtonClass: 'text-danger',
                    cancelButtonClass: 'border-right',
                    customClass: 'ku-confirm',
                    dangerouslyUseHTMLString: true,
                    center: true,
                }).then(() => {
                    this.$router.push({ path: "/pricing", query: { lev: permission_id } })
                }).catch(() => {})
            }
        }
    },
    mounted() {
        if (!this.auth_numbers.user) this.$store.dispatch('getMyInfo')
    }
}
</script>
