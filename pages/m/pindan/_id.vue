<template>
<div>
    <kuc-page-header :title="$t('pin.detail')"></kuc-page-header>
    <div class="mt-2 bg-white p-3" style="height:95vh">
        <div class="d-flex justify-content-between align-items-center">
            <p>{{$t('pin_quantity1')}}：<span class="text-danger font-12">{{info.price}}</span> {{$t('unit_set')}}</p>
            <div>
                <span class="border border-danger bg-danger text-white px-3 py-2 rounded  font-09" @click="handleContact">{{$t('msg.send_ta')}}</span>
                <span class="border border-danger text-danger px-3 py-2 rounded  font-09" @click="handleAddSupplier">设为供应商</span>
            </div>
        </div>

        <div class="mt-3">
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('contact.p')}}：</p>
                <p>张云雷</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('phone')}}：</p>
                <p>135263564656</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('mobile')}}：</p>
                <p>135263564656</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('email')}}：</p>
                <p>hi@sina.com</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('company')}}：</p>
                <p>{{$t('company')}}公司公司公司公司公司公司公司</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('country')+$t('region')}}：</p>
                <p>中国北京</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('address.recieve')}}：</p>
                <p>中国北京中国北京中国北京中国北京中国北京中中</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('remark')}}：</p>
                <p>内容内容内容内容内容內容内容</p>
            </div>            
        </div>
    </div>
</div>
</template>

<script>
import { getDetail } from '@/api/my_pindan'
export default {
    middleware: 'authenticated',
    head() {
        return {
            title: this.$t('pin.detail')
        }
    },
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
    },
    mounted(){
        getDetail(this.$route.params.id).then(res=>{

        })
    }
}
</script>

<style lang="scss" scoped>
.t-label {
    p{
        margin-bottom: 0.5rem;
    }
    p:first-child {
        min-width: 5.5rem;
    }
}
</style>
