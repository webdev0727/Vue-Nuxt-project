<template>
<div>
    <kuc-page-header :title="$t('preference')" to="/my"></kuc-page-header>
    <div class="mt-2 bg-white p-2">
        <div class="pb-2" v-for="(item, ind) in categories" :key="item.id">
            <h3 class="mb-2 mt-1">{{gsv([$i18n.locale], item.name)}}</h3>
            <div class="d-flex px-1">                
                <div v-for="(hopeO, ic) in item.childs"  :key="hopeO.id" class="btn mx-1" :class="hopeO.is_selected ? 'active': ''" 
                    @click="categories[ind]['childs'][ic]['is_selected'] = categories[ind]['childs'][ic]['is_selected'] ? 0 : 1">
                    {{gsv([$i18n.locale], hopeO.name)}}
                </div>
            </div>
        </div>
    </div>
    <div class="text-center pt-4">
        <el-button type="primary" @click="handleSubmit" class="w-75" round>{{$t('save.setting')}}</el-button>
    </div>
</div>
</template>

<script>
import { preferenceList, setPreferenceList } from "@/api/user"
export default {
    middleware: 'authenticated',
    name: 'MyEnvirenment',
    head() {
        return {
            title: this.$t('preference')
        }
    },
    data() {
        return {
            categories: []            
        }
    },
    methods: {
        async handleSubmit() {
            this.$store.dispatch("common/setLoading")
            await setPreferenceList(this.categories)
            this.$store.dispatch("common/setLoading", false)
        },
    },
    mounted() {
        preferenceList().then(res => {
            this.categories = res.categories || []
        })
    }
}
</script>

<style lang="scss" scoped>
    .btn{
        border: 1px solid gray;
        border-radius: 5px;
        color: unset;
        background: white;
        padding: 3px 7px;
        &.active{
            background: #E50113;
            color: white;
            border-color:  #E50113
        }
    }
</style>>
