<template>
<div>
    <div class="py-2 mb-1">
        <nuxt-link :to="'/company/' + productDa.id" class="d-flex">
            <img :src="gsv(['url'], productDa.logo) || '/files/avatar.png'" alt="" width="55" height="55" class="rounded">
            <div class="pl-2 pb-2 d-flex justify-content-between flex-column">
                <h4 class="pr-2 text-dark text-line-1">{{gsv([$i18n.locale], productDa.name)}}</h4>
                <div class="text-dark9 mt-1 d-flex">
                    <p>{{$t('expo.i')}}:</p>
                    <p class="flex-1" v-html="getExpoNames(productDa.cur_expos)"></p>
                </div>                
            </div>
        </nuxt-link>
        <div class="text-dark9 mt-2">
            <div class="d-flex">
                <p class="text-nowrap mr-1">{{$t('main.product1')}}: </p>
                <p> {{getNames(productDa.categories) }}</p>
            </div>
            <div class="d-flex">
                <p class="text-nowrap mr-1">{{$t('main.market')}}: </p>
                <p>{{getNames(productDa.market)}}</p>
            </div>
        </div>
    </div>
    <ku-line />
</div>
</template>

<script>
export default {
    name: 'CardCompany',
    props: [
        'productDa'
    ],
    data() {
        return {
            currentValue: this.value
        }
    },
    computed: {},
    methods: {
        getExpoNames(array){
            var name_arr = []
            if(array){
                if(typeof array == 'object'){
                    if(array.length){
                        for (let index = 0; index < array.length; index++) {
                            const element = array[index]['expo'];
                            if (element)
                                name_arr.push(element[this.$i18n.locale])
                        }
                    }
                }
            }
            return name_arr.join('<br>')
        }
    }
}
</script>