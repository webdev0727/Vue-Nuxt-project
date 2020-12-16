<template>
<div>
    <div class="bg-white p-2">
        <h3 class="mb-1">{{$t('expo.m_construct')}}</h3>
        <ol class="ml-n3">
            <li>根据标准展位平层板配置方案，选取和您展位相同的图，然后根据您预定的平层板数，在图中用粗线画出您的平层板的安装位置，并标明离地高度，以便提前安装，节省您的布展时间。</li>
            <li>请于7月6日前下载表格并妥善填写后，通过邮件发送至主办；更多咨询可联系：0574-87216935239
                2629115@qq.com
            </li>
        </ol>
        <p class="mt-3">{{$t('date.deadline')}}：2020年8月5日</p>
    </div>
    <div class="text-center my-5">
        <el-button type="primary" @click="handleSubmit" class="w-75" round :disabled="isLoading">{{$t('btn.click_download_form')}}</el-button>
    </div>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { myExpoOffice } from "~/api/expo"
export default {
    name: "ExpoDuty_Construct",
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
            myExpoOffice(2, this.my_expo_office_id).then(res => {
                this.link = res.link
            }).finally(() => {
                this.isLoading = false
            })
        }

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

<style>

</style>
