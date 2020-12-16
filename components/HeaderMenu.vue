<template>
<el-row justify="end" class="h-menu-container">
    <el-col :span="6" class="text-center">
        <div class="header-menu" @click="toggleLang">
            <svg-icon name='lang' width='24' height='25' color='#fff'></svg-icon>
            <p class="text-white text-center">中/英</p>
        </div>
    </el-col>
    <el-col :span="6" class="text-center">
        <div to="/my/buy" class="header-menu" @click="handleRoute('/my/buy')">
            <svg-icon name='cart' width='20' height='25' color='#fff'></svg-icon>
            <p class="text-white text-center">{{$t('want.buy')}}</p>
        </div>
    </el-col>
    <el-col :span="6" class="text-center">
        <div to="/my/sell" class="header-menu" @click="handleRoute('/my/sell')">
            <svg-icon name='seller' width='22' height='25' color='#fff'></svg-icon>
            <p class="text-white text-center">{{$t('want.sell')}}</p>
        </div>
    </el-col>
    <el-col :span="6" class="text-center">
        <div to="/message" class="header-menu" @click="handleRoute('/my/message')">
            <svg-icon name='message' width='22' height='25' color='#fff'></svg-icon>
            <p class="text-white text-center">{{$t('news')}}</p>
        </div>
    </el-col>
</el-row>
</template>

<script>
export default {
    name: "HeaderMenu",
    methods: {
        toggleLang() {
            // console.log(this.$i18n.locale)            
            var new_lang
            if (this.$i18n.locale == "en") new_lang = "zh"
            else new_lang = "en"
            this.$i18n.locale = new_lang
            this.$store.dispatch("setLanguage", new_lang)
        },
        handleRoute(route_path){
            if (window.location.hostname != process.env.DOMAIN){                
                location.replace(`${process.env.M_URL}${route_path}`)
            }else{
                this.$router.push({path: route_path})
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.h-menu-container{
    flex: 1;
    max-width: 22rem;
}
.header-menu {
    display: inline-block;
    svg {
        display: inherit;
        margin: 0 auto;
    }

    p {
        color: white;
        font-size: 0.8rem;
    }    
}
</style>
