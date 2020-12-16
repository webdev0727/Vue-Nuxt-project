<template>
<div>

    <div class="bg-white p-2">
        <h3 class="mb-1">{{$t('expo.m_tool')}}</h3>
        <ol class="ml-n3 mb-3">
            <li>以下报价包含展具的提供和安装；</li>
            <li>展商在7月6日前预订并付款可以享受预定价，逾期以现场租赁价计算； </li>
            <li>所有展具均系租赁，租期为1展期；</li>
            <li>所有租赁的项目不得调换或自行交换； </li>
            <li>所有取消的预定，将不予退款。</li>
            <li>支付条款：所有定单请于2020年7月6日前按以下方式全额缴付： 账户名：宁波中博国际展览有限公司支付宝账号：934667450@qq.com</li>
        </ol>
        <p class="mt-3">截止日期：2020年7月6日</p>
        <ku-line />

        <div v-for="(item, ind) in items" :key="item.id">
            <div class="d-flex align-items-center justify-content-between py-1">
                <div class="flex-1 mr-3">
                    <h3 class="font-11 mb-1">{{item.name}}</h3>
                    <div class="d-flex justify-content-between text-dark9 font-09">
                        <p class="">{{item.property}}</p>
                        <p class="ml-3 text-nowrap">{{$t('price_site')}}:￥{{item.price2}}</p>
                    </div>
                    <div class="d-flex justify-content-between text-dark9 font-09 text-nowrap">
                        <p>预定租价:￥{{item.price1}} </p>
                        <p class="ml-3">{{$t('deposit')}}：￥{{item.prepay_price}}</p>
                    </div>                
                    <p>{{$t('price_subtotal')}}：<span class="text-danger">￥{{item.quantity * item.price1}}</span></p>
                </div>
                <el-input-number v-model="item.quantity" :min="0" :max="100" class="elel" style="max-width: 10rem;"></el-input-number>
                <!-- <div class="ml-4 border">
                    <el-input v-model="item.quantity" placeholder="请输入数量"></el-input>
                </div> -->
            </div>
            <ku-line v-if="ind<(items.length-1)"/>              
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
    name: "ExpoDuty_Tool",
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
            myExpoOffice(3, this.my_expo_office_id).then(res => {
                this.items = res.items
            }).finally(() => {
                this.isLoading = false
            })
        },
        handleSubmit() {
            AddExpoAds({
                expo_id: this.my_expo_office_id,
                tag: 0,
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