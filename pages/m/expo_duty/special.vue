<template>
<div>

    <div class="bg-white p-2">
        <h3 class="mb-1">{{$t('expo.m_special')}}</h3>
        <p>请您在截止日期前下载表格、填写完表格、并通过邮件发送至主办。</p>
        <ol class="ml-n3 mb-3">
            <li>特装费用：特装搭建管理费（人民币10元/平方米）、押金（人民币20元/平方米）、施工证费（人民币10元/张）、接电箱费（单相16A/220V电箱400元/个，三相32A/380V电箱600元/个，三相60A/380V电箱800元/个）； </li>
            <li>申报提交的材料：施工单位资质复印件（或营业执照）、《特装展位施工申报表》（下载）《特装展位施工安全责任保证书》（下载）、施工风险押金、展台设计效果图、施工图、配电图； </li>
            <li>材料提交时间/地址：7月6日之前提交书面材料报送或快递至宁波民安东路268号国际金融中心F座1812王查波收0574-87254006； </li>
            <li>施工风险押金缴纳：施工单位进场前，需交付施工风险押金；小于36平方米：1万元/展台；大于等于36平方米：2万元/展台。展会期间若无安全责任并处理好施工垃圾，展会结束后30日内退回风险押金，若发生相应责任，从押金中扣除相应费用，不足部分根据《特装施工安全保证书》施工单位需另行补足。 </li>
            <li>风险押金缴纳账号：户名：宁波中博国际展览有限公司开户行：广发银行海曙支行账号：7403516010000075</li>
        </ol>

    </div>

    <div class="text-center my-5">
        <el-button type="primary" @click="handleSubmit" class="w-75" round :disabled="isLoading">点击下载特装申报文件</el-button>
    </div>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { myExpoOffice } from "~/api/expo"
export default {
    name: "ExpoDuty_Special",
    data() {
        return {
            isLoading: true,
            link: ''
        }
    },
    computed: {
        ...mapState('expo', ["my_expo_office_id"]),
    },
    methods: {
        handleSubmit() {
            window.open(this.link, '_blank');
        },
        getList() {
            this.isLoading = true
            myExpoOffice(7, this.my_expo_office_id).then(res => {
                this.link = res.link
                this.isLoading = false
            })
        }

    },
    created() {
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

<style>

</style>
