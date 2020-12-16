<template>
<div>
    <kuc-page-header title="报价详情"></kuc-page-header>
    <div class="mt-2 bg-white p-3" style="height:95vh">
        <div class="d-flex justify-content-between align-items-center">
            <p>报价金额：<span class="text-danger font-12">￥{{info.price}}</span></p>
            <div>
                <span class="border border-danger bg-danger text-white px-3 py-2 rounded  font-09" @click="handleContact">{{$t('msg.send_ta')}}</span>
                <span class="border border-danger text-danger px-3 py-2 rounded  font-09" @click="handleAddSupplier">设为供应商</span>
            </div>
        </div>
        <div class="mt-3">
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('name')}}：</p>
                <p>张云雷</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('contact')}}{{$t('mobile')}}：</p>
                <p>135263564656</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('contact')}}{{$t('phone')}}：</p>
                <p>135263564656</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('company.name')}}：</p>
                <p>{{$t('company')}}公司公司公司公司公司公司公司</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('is_in_stock')}}：</p>
                <p>有</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('can_provide_sample')}}：</p>
                <p>可以</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('is_oem')}}：</p>
                <p>OEM</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('offer.desc')}}：</p>
                <p>内容内容内容内容内容內容内容</p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            info: {
                id: 1,
                name: "姓名",
                mobile: "135989796654",
                price: 124,
                tags: ['现货', '提供样品', 'OEM'],
                date: '2020.05.26  11:21',
            }
        }
    },
    methods: {
        handleContact() {

        },
        handleAddSupplier() {

        }
    }
}
</script>

<style lang="scss" scoped>
.t-label {
    p{
        margin-bottom: 0.5rem;
    }
    p:first-child {
        min-width: 9.5rem;
    }
}
</style>
