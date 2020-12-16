<template>
<div>
    <kuc-page-header :title="$t('offer.detail')"></kuc-page-header>
    <div class="mt-2 bg-white p-3" style="height:95vh">
        <div class="d-flex justify-content-between align-items-center">
            <p class="text-nowrap">{{$t('offer.money')}}：<span class="text-danger font-12">￥{{info.price}}</span></p>
            <div style="line-height: 2.3rem; text-align: right" :class="{disabled: $store.state.auth.id == info.user_id}">
                <span class="border border-danger bg-danger text-white px-3 py-2 rounded  font-09" @click="handleContact">{{$t('contact')}}TA</span>
                <span class="border border-danger text-danger text-nowrap px-3 py-2 rounded  font-09" @click="handleAddSupplier">{{$t('supplier.set')}}</span>
            </div>
        </div>
        <div class="mt-3" v-if="info.id">
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('name')}}：</p>
                <p>{{info.contact_name}}</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('contact')}}{{$t('mobile')}}：</p>
                <p>{{info.contact_mobile}}</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('contact')}}{{$t('phone')}}：</p>
                <p>{{info.contact_phone}}</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('company.name')}}：</p>
                <p>{{info.contact_company}}</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('is_in_stock')}}：</p>
                <p v-if="info.in_stock">{{$t('is.have')}}</p>
                <p v-else>{{$t('is.have_no')}}</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('can_provide_sample')}}：</p>
                <p v-if="info.can_provide_sample">{{$t('is.can')}}</p>
                <p v-else>{{$t('is.can_no')}}</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('is_oem')}}：</p>
                <p>{{info.is_oem ? "OEM": "ODM"}}</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('offer.desc')}}：</p>
                <p>{{info.description}}</p>
            </div>
            <div class="d-flex t-label">
                <p class="text-dark9 text-right">{{$t('attachment')}}：</p>
                <ku-media-box v-if="info.assets" :assets="info.assets"></ku-media-box>
                <svg-icon name='no-data' width='100' height="50" v-else></svg-icon>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { offer_detail } from '@/api/my_treasure'
export default {
    middleware: 'authenticated',
    data() {
        return {
            info: {}
        }
    },
    head() {
        return {
            title: this.$t('offer.detail')
        }
    },
    methods: {
        handleContact() {
            if (this.info.user_id != this.$store.state.auth.id) {
                const uid = this.info.user_id      
                const to = this.info.contact_mobile          
                const name = this.info.contact_name    
                this.$router.push({ path: `/message/new`, query: { uid, to, name } }) 
            }
        },
        handleAddSupplier() {
            if (this.info.user_id != this.$store.state.auth.id) {
                const company_id = this.info.purchase.user.company_id
                if (company_id)
                    this.$router.push({ path: '/my/buy/supplier/new?to=' + company_id })
            }
        }
    },
    mounted() {
        offer_detail(this.$route.params.id).then(res => {
            this.info = res.offer
        }).catch(err => {
            this.goBack()
        })
    }
}
</script>

<style lang="scss" scoped>
.t-label {
    p {
        margin-bottom: 0.5rem;
    }

    p:first-child {
        min-width: 9.5rem;
    }
}

.disabled span {
    border-color: #929090 !important;
    background: #929090 !important;
    color: white !important;
}
</style>
