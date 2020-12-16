<template>
<div>
    <kuc-page-header :title="$t('product.manage')" to="/my/sell"></kuc-page-header>
    <div class="">
        <div class="px-2 bg-white">
            <ku-tab-line :list='tab_items' :activeTab.sync="activeTabName" @change="handleTabChange"></ku-tab-line>
        </div>
        <nuxt-child />
    </div>
</div>
</template>

<script>

export default {
    middleware: 'authenticated',
    name: "ProductManageLayout",
    head() {
        return {
            title: this.$t('product.manage')
        }
    },
    data() {
        return {
            tab_items: [
                {id: "m-product_manage", name:this.$t('product.my')},
                {id: "m-product_manage-id", name:this.$t('product.post')},
                {id: "m-product_manage-cate", name:this.$t('cate.custom')},
            ],
            activeTabName: this.$route.name,
        }
    },    
    computed: {},
    methods: {
        handleTabChange(active_tab_name) {
            if (active_tab_name=="m-product_manage-id")
                this.$router.push({ path: "/product_manage/new" })
            else  
                this.$router.push({ name: active_tab_name })            
        }
    },
    watch:{
        $route(to, from){
            // console.log(to, from)
            this.activeTabName = to.name
        }
    }
}
</script>
