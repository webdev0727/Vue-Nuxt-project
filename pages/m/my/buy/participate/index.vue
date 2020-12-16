<template>
<div>
    <kuc-page-header :title="$t('want.visit')" to="/my/buy"></kuc-page-header>
    <div class="bg-white p-2 mt-2">
        <div class="py-input">
            <dlg-select :title="$t('expo.sel')" :checked.sync="expo_id" :list="expos" @change="validExpo"/>
        </div>
        <div class="el-form-item__error" v-if="error">{{error}}</div>
        <ku-line />
        <div class="text-center my-3 px-2 d-flex justify-content-center">
            <div class="w-50 px-2">
                <el-button type="primary" @click="handleSubmit" class="w-100" round>{{is_added ? $t('badge_apply') :  $t('want.visit')}}</el-button>
            </div>
            <div class="w-50 px-2" v-if="is_added">
                <el-button type="primary" @click="goFriend" class="w-100" round>{{$t('apply.friend_vip')}}</el-button>
            </div>
        </div>
        <p v-if="is_added" class="text-dark6 text-center mb-3">{{$t('status.you_approved')}}</p>
    </div>
    <ku-title-line class="px-2">{{$t('history.apply')}}</ku-title-line>
    <div class="bg-white px-2">
        <div v-for="item in list" :key="item.id">
            <div class="py-2 d-flex justify-content-between align-items-center">
                <div>
                    <h4>{{gsv([$i18n.locale], item.expo.name)}}</h4>
                    <p class="mt-2 text-dark9">{{parseTime(item.created_at)}}</p>
                </div>
                <p v-if="item.is_visited" class="text-danger text-nowrap">{{$t('status.participated')}}</p>
                <p v-else class="text-nowrap">{{$t('status.absent')}}</p>
            </div>
            <ku-line />
        </div>
        <ku-loading-no-data :active="is_loading" :total="list.length" />
    </div>
</div>
</template>

<script>
import {getStep, getBuyerExpoList} from "~/api/expo"
export default {
    name: "MyBuyerParticipate",
    middleware: 'authenticated',
    components: {},
    head(){
        return {
            title: this.$t('want.visit')
        }
    },
    data() {
        return {
            is_loading: true,
            expos:[],            
            expo_id:'',
            list: [],
            error: false
        }
    },
    computed: {
        is_added: function() {            
            return this.list.find(el => el.expo_id == this.expo_id)
        }
    },

    methods: {
        validExpo(){
            if (this.expo_id){
                this.error = false
                return true
            }else{
                this.error = this.$t('valid.required', [this.$t('expo.name')])
                return false
            }
        },
        goFriend(){
            this.$router.push({ path: '/my/buy/participate/card/' + this.is_added.id})
        },
        handleSubmit() {
            if (this.validExpo()){
                if (this.is_added){
                    this.$router.push({ path: '/my/buy/participate/' + this.expo_id + '/step4' })
                }else{
                    this.$router.push({ path: '/my/buy/participate/' + this.expo_id + '/step1' })
                }
            }           
        },
    },
    mounted(){
        getBuyerExpoList().then(res=>{
            this.expos = res.expos
            if (res.expos.length) this.expo_id = res.expos[0]['id']
            this.list = res.expo_applicant_buyers
        }).finally(()=>{
            this.is_loading = false
        })
    }
}
</script>