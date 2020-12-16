<template>
<div>

    <div class="bg-white p-2">
        <h3>{{$t('expo.m_end')}}</h3>        
        <ol class="ml-n3 mb-3">
            <li>以下报价包含展具的提供和安装；</li>
            <li>展商在7月6日前预订并付款可以享受预定价，逾期以现场租赁价计算； </li>
            <li>所有展具均系租赁，租期为1展期；</li>
            <li>所有租赁的项目不得调换或自行交换； </li>
            <li>所有取消的预定，将不予退款。</li>
            <li>支付条款：所有定单请于2020年7月6日前按以下方式全额缴付： 账户名：宁波中博国际展览有限公司支付宝账号：934667450@qq.com截止日期：2020年7月6日</li>
        </ol>

    </div>

    <div class="text-center my-5">
        <el-button type="primary" @click="handleSubmit" class="w-75" round>点击下载特装申报文件</el-button>
    </div>

</div>
</template>

<script>

export default {
    name: "ExpoDuty_End",
    components: { },
    data() {
        return {}
    },
    methods: {
        handleSubmit() {

        },

    }
}
</script>

<style>

</style>
