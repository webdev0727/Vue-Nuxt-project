<template>
<div class="min-vh-100">
    <kuc-page-header title="六号馆"></kuc-page-header>
    <div class="p-2 mt-1">
        <div class="bg-white rounded p-2">
            <div class="search-rounded-group mb-2">
                <el-input :placeholder="$t('search')" suffix-icon="el-icon-search" v-model="keyword">
                    <div slot="prepend">
                        <el-select v-model="value" placeholder="馆">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-input>
            </div>
            <img :src="details.img" alt="" width="100%">
            <div class="p-2">
                <h2 class="text-blue-2">{{$t('expo.no_')}}: {{details.postion_number}}</h2>
                <h2 class="my-3">{{details.company_name}}</h2>
                <div class="d-flex my-2">
                    <p class="text-nowrap mr-1 text-dark9">{{$t('main.product')}}: </p>
                    <p> {{details.main_goods}}</p>
                </div>
                <div class="d-flex my-2">
                    <p class="text-nowrap mr-1 text-dark9">{{$t('business.mode')}}: </p>
                    <p> {{details.business_mode}}</p>
                </div>
                <div class="d-flex my-2">
                    <p class="text-nowrap mr-1 text-dark9">{{$t('main.market')}}: </p>
                    <p> {{details.main_markets}}</p>
                </div>
                <div class="d-flex my-2">
                    <p class="text-nowrap mr-1 text-dark9">{{$t('company')}}{{$t('address')}}: </p>
                    <p> {{details.address}}</p>
                </div>
                <div class="d-flex my-2">
                    <p class="text-nowrap mr-1 text-dark9">{{$t('company')}}{{$t('phone')}}： </p>
                    <a class="text-blue-2" :href="'tel:'+details.contact_phone"> {{details.contact_phone}}</a>
                </div>
                <div class="d-flex my-2">
                    <p class="text-nowrap mr-1 text-dark9">{{$t('e_mail')}}: </p>
                    <a class="text-blue-2" :href="'mailto:'+details.contact_email"> {{details.contact_email}}</a>
                </div>
                <div class="d-flex my-2">
                    <p class="text-nowrap mr-1 text-dark9">{{$t('company.www')}}: </p>
                    <a class="text-blue-2" :href="details.website" target='_blank'> {{details.website}}</a>
                </div>
            </div>
            <div class="text-center my-3">
                <nuxt-link to="/" class="">
                    <h3 class="bg-blue-2 text-white btn--link">{{$t('want.visit')}}</h3>
                </nuxt-link>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'RoomDetails',
    components: {},
    data() {
        return {
            details: [],
            keyword: '',
            options: [{
                value: '一号馆',
                label: '一号馆'
            }, {
                value: '二号馆',
                label: '二号馆'
            }],
            value:"一号馆"
        }
    },    
}
</script>

<style lang="scss" scoped>
.btn--link {
    border-radius: 10rem;
    vertical-align: middle;
    padding: 0.7rem;
}
</style>
