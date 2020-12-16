<template>
<div>
    <div class="d-flex py-2 card-big-container">
        <el-image :src="getImg1(da.covers)" 
        style="width: 32vw; height: 25vw; max-height: 160px; max-width:340px"
        fit="cover" lazy @click.native="goDetail(da.id)">
            <div slot="error" class="image-slot">
                <!-- <i class="el-icon-picture-outline"></i> -->
                <img src="/images/ant404.png" alt="" class="w-100 fit-cover">
            </div>            
        </el-image>
        <div class="pl-2 pb-1 d-flex justify-content-between flex-column flex-1">
            <h4 class="pr-2 text-dark text-line-3" @click="goDetail(da.id)">{{da.title}}</h4>
            <div class="text-dark9 d-flex justify-content-between align-items-center pr-2">
                <div :to="`/writer/${da.user_id}`" class="d-flex align-items-center mr-2">
                    <el-avatar :size="30" :src="gsv(['writer', 'avatar', 'url'], da.user) || gsv(['avatar', 'url'], da.user)">
                        <img src="/files/avatar.png"/>
                    </el-avatar>
                    <span class="pl-1 text-nowrap">{{gsv(['name', $i18n.locale], da.user)}}</span>
                </div>
                <div class="d-flex mr-2">
                    <p>
                        <svg-icon name='comment'></svg-icon>
                        <span>{{da.comments}}</span>
                    </p>
                    <p class="ml-2">
                        <svg-icon name='like-o' width='20' height='20'></svg-icon>
                        <span>{{da.likes}}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <ku-line />
</div>
</template>

<script>
export default {
    name: 'CardArticle',
    props: [
        'da'
    ],
    data() {
        return {
            
        }
    },
    computed: {},
    methods: {
        goDetail(id){
            this.$router.push({path: `/article/${id}`})
        }
    }
}
</script>

<style lang="scss" scoped>
.card-big-container {
    >img {
        object-fit: cover;
        width: 32vw;
        height: 25vw;
        max-height: 160px;
    }

    span {
        font-size: 0.9rem;
    }
}
</style>
