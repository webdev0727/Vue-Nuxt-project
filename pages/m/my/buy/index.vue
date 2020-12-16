<template>
<div class="container">
    <kuc-page-header :title="$t('want.buy')" to="/my"></kuc-page-header>

    <div class="p-2 mb-5" style="position:relative">

        <!-- 我要参展 -->
        <nuxt-link to="/my/buy/participate" class="bg-white py-2 d-flex justify-content-between align-items-center rounded">
            <p class="flex-1 px-2">{{$t('badge_apply')}}</p>
            <div class="p-2 text-dark9">
                申请参观证<i class="el-icon-arrow-right"></i>
            </div>
        </nuxt-link>
        <nuxt-link to="/my/buy/company" class="bg-white py-2 d-flex justify-content-between align-items-center rounded mt-1">
            <p class="flex-1 px-2">{{$t('my_exhibitor')}}</p>
            <div class="p-2 text-dark9">
                <i class="el-icon-arrow-right"></i>
            </div>
        </nuxt-link>
        <nuxt-link to="/my/buy/bus" class="bg-white py-2 d-flex justify-content-between align-items-center rounded mt-1">
            <p class="flex-1 px-2">{{$t('shuttle_free')}}</p>
            <div class="p-2 text-dark9">
                <i class="el-icon-arrow-right"></i>
            </div>
        </nuxt-link>

        <nuxt-link to="/my/buy/inquiry" class="bg-white py-2 d-flex justify-content-between align-items-center rounded mt-3">
            <p class="flex-1 px-2">{{$t('xunpan.my')}}</p>
            <div class="p-2 text-dark9">
                <i class="el-icon-arrow-right"></i>
            </div>
        </nuxt-link>
        <nuxt-link to="/my/buy/treasure" class="bg-white py-2 d-flex justify-content-between align-items-center rounded mt-1">
            <p class="flex-1 px-2">{{$t('purchase.bao')}}</p>
            <div class="p-2 text-dark9">
                {{$t('post')}} {{$t('buyer.news')}}<i class="el-icon-arrow-right"></i>
            </div>
        </nuxt-link>

        <nuxt-link to="/my/buy/pindan" class="bg-white py-2 d-flex justify-content-between align-items-center rounded mt-1">
            <p class="flex-1 px-2">{{$t('pin.bao')}}</p>
            <div class="p-2 text-dark9">
                <i class="el-icon-arrow-right"></i>
            </div>
        </nuxt-link>

        <nuxt-link to="/my/buy/supplier" class="bg-white py-2 d-flex justify-content-between align-items-center rounded mt-1">
            <p class="flex-1 px-2">{{$t('my_supplier1')}}</p>
            <div class="p-2 text-dark9">
                <i class="el-icon-arrow-right"></i>
            </div>
        </nuxt-link>

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

// import { getInfo } from '@/api/user'

export default {
    middleware: 'authenticated',
    name: 'MyBuy',
    head() {
        return {
            title: this.$t('want.buy')
        }
    },    
     
}
</script>