<template>
<div>
    <div class="bg-white px-2 pt-2">
        <h3>{{$t('expo.m_water_power')}}</h3>
        <p class="my-2">{{$t('msg.expo_price')}}</p>
        <ku-line />
        <div>
            <div  v-for="(item, ind) in items" :key="item.id">
                <div class="d-flex align-items-center justify-content-between py-1">
                    <div class="mr-3">
                        <h3 class="font-11">{{item.name}}</h3>
                        <p class="text-dark9 font-09 text-nowrap my-2">{{item.property}}</p>
                        <p class="text-dark9 font-09 text-nowrap my-2">{{$t('unit_price')}}: ￥{{item.price1}} &nbsp;&nbsp; {{$t('deposit')}}:￥{{item.prepay_price}}</p>
                        <p>{{$t('price_subtotal')}}：<span class="text-danger">￥{{item.quantity * item.price1}}</span></p>
                    </div>
                    <el-input-number v-model="item.quantity" :min="0" :max="100" class="elel" style="max-width: 10rem;"></el-input-number>                    
                </div>
                <ku-line  v-if="ind<(items.length-1)" />
            </div> 
        </div>
    </div>
    
    <div class="text-center mt-3 mb-5">
        <p class="mb-3">{{$t('price_sum')}}： <span class="text-danger font-2">￥{{total_price}}</span> </p>
        <el-button type="primary" @click="handleSubmit" class="w-75" round>{{$t('submit')}}</el-button>
    </div>  

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { myExpoOffice, AddExpoAds } from "~/api/expo"
export default {
    name: "ExpoDuty_HydroPower",
    data() {
        return {
            isLoading: true,
            items: []
        }
    },
    computed: {
        ...mapState('expo', ["my_expo_office_id"]),
        total_price: function () {
            let price = 0
            this.items.forEach(el => {
                price += el.quantity * el.price1
            });
            return price
        }
    },
    methods: {
        getList() {
            this.isLoading = true
            myExpoOffice(4, this.my_expo_office_id).then(res => {
                this.items = res.items
            }).finally(() => {
                this.isLoading = false
            })
        },
        handleSubmit() {
            AddExpoAds({
                expo_id: this.my_expo_office_id,
                tag: 1,
                addition_data: this.items
            }).then(() => {
                this.$notify({
                    title: this.$t('success'),
                    message: this.$t('success.msg'),
                    type: 'success'
                });
            })
        },

    },
    mounted() {
        if (this.my_expo_office_id) {
            this.getList()
        }
    },
    watch: {
        my_expo_office_id(to, from) {
            if (to) {
                this.getList()
            }
        }
    }
}
</script>

