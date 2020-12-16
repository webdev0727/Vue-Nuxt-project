<template>
<div>
    <div class="bg-white p-2">
        <h3 class="mb-1">{{$t('expo.m_badge_apply')}}</h3>
        <p>本届展会参展证为实名制，证件上均印有“参展者姓名”，“参展单位名称”和“展位号”每个展位可申领3张证件的原则。</p>
        <p class="mt-3">{{$t('remark')}}：
            ·参展证是参展企业工作人员进出展览场地的有效证件之一，展会期间必须配戴（同时带好身份证），不得转让，不得转借给其他人员使用，一人一证，凡未佩带者，将被视为无证人员，展馆安保人员将有权拒绝进入展览场地。
            ·每展位可申领3张证件的原则，信息不全者不予办理参展证。
            ·7月14-15日8：30-17：00，在宁波国际会展中心北登陆厅展商报到处领取参展证件。</p>
        <p class="mt-3">您公司最多可以领取展商胸卡数为：<span class="text-danger">12</span> 张。</p>
    </div>

    <div class="d-flex justify-content-between align-items-center p-2">
        <ku-title-line>{{$t('expo.badge_history')}}</ku-title-line>
        <div>
            <el-button type="primary" @click="handleNew" size="medium" :disabled="!my_expo_office_id">{{$t('expo.btn_new_badge')}}</el-button>
        </div>
    </div>
    <div class="bg-white px-2 pt-2">
        <div class="mt-2" v-for="(item, ii) in list" :key="item.id">
            <div class="d-flex justify-content-between">
                <div class="flex-1">
                    <h3>{{gsv([$i18n.locale], item.name)}}</h3>
                    <div class="text-dark9">
                        <p class="mt-1">{{gsv([$i18n.locale], item.position) }}</p>
                        <p class="mt-1">{{$t('expo.no_')}}：{{item.hallname}}</p>
                        <p class="mt-1">{{gsv([$i18n.locale], item.componay) }}</p>
                    </div>
                </div>
                <el-button type="text" @click="handleEdit(item.id)" class="p-2 font-11 text-dark9">
                    <svg-icon name="edit-1"></svg-icon>
                </el-button>
                <el-button type="text" @click="handleDelete(item.id, ii)" icon="el-icon-delete p-2 font-11 text-dark9"></el-button>
            </div>
            <ku-line />
        </div>
        <ku-loading-no-data :active="isLoading" :total="list.length" />
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { myExpoOffice } from "~/api/expo"

export default {
    name: "ExpoDuty1",
    data() {
        return {
            isLoading: false,
            list: []
        }
    },
    computed: {
        ...mapState('expo', ["my_expo_list", "my_expo_office_id"]),
    },
    methods: {
        handleNew() {
            this.$router.push({ path: "/expo_duty_doc/new?expo_id=" + this.my_expo_office_id })
        },
        handleEdit(id) {
            this.$router.push({ path: "/expo_duty_doc/" + id })
        },
        handleDelete(id, index) {
            this.list.splice(index, 1)
            this.$notify({
                title: this.$t('success'),
                message: this.$t('success.del'),
                type: 'success'
            });
        },
        getList() {
            this.isLoading = true
            myExpoOffice(1, this.my_expo_office_id).then(res => {
                this.list = res.expo_bages
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
            console.log(to, from)
            if (to) {
                this.getList()
            }
        }
    }
}
</script>