<template>
<div class="border-bottom py-2 card-big-container" @click="goDetail(da)">
    <div class="d-flex" v-if="da.covers.length==1">        
        <el-image :src="gsv(['url'], da.covers[0])" fit="cover" lazy style="width: 32vw; height: 25vw; max-height: 160px; max-width:340px">
            <div slot="error" class="image-slot">
                <img src="/images/ant404.png" alt="" class="w-100 fit-cover">
            </div>
        </el-image>
        <div class="pl-2 pb-2 d-flex justify-content-between flex-column flex-1">
            <h4 class="pr-2 text-dark text-line-3">{{gsv([$i18n.locale], da.title) || da.title || $t('title')}}</h4>
            <div class="text-dark9 d-flex justify-content-between align-items-center pr-2">
                <div class="d-flex align-items-center mr-2">
                    <el-avatar :size="30" :src="gsv(['writer', 'avatar', 'url'], da.user) || gsv(['avatar', 'url'], da.user) || '/files/avatar.png'" fit="cover">
                    </el-avatar>
                    <span class="pl-1 text-nowrap">{{gsv(['name', $i18n.locale], da.user)}}</span>
                </div>
                <div class="d-flex align-items-center">
                    <p>
                        <Timer :endTime="da.created_at" :key="da.id" /><span>·{{headline_type}}</span>
                    </p>
                    <p class="ml-2 text-nowrap">
                        <svg-icon name='comment'></svg-icon>
                        <span>{{da.comments}}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="">
        <h4 class="pr-2 text-dark mb-1">{{gsv([$i18n.locale], da.title) || da.title || $t('title')}}</h4>
        <div class="card-recomm-container ml-n1 pr-1">
            <div v-for="ii in Math.min(3, da.covers.length)" :key="da.id+'kk'+ii">
                <el-image :src="gsv(['url'], da.covers[ii-1])" fit="cover" lazy class="w-100 h-100">
                    <div slot="error" class="image-slot">
                        <img src="/images/ant404.png" alt="" class="w-100 fit-cover">
                    </div>
                </el-image>
            </div>
        </div>
        <div class="pl-2 pb-2 d-flex justify-content-between flex-column flex-1 mt-2">
            <div class="text-dark9 d-flex justify-content-between align-items-center pr-2">
                <div class="d-flex align-items-center mr-2">
                    <el-avatar :size="30" :src="gsv(['writer', 'avatar', 'url'], da.user) || gsv(['avatar', 'url'], da.user) || '/files/avatar.png'" fit="cover">
                    </el-avatar>
                    <span class="pl-1 text-nowrap">{{gsv(['name', $i18n.locale], da.user)}}</span>
                </div>
                <div class="d-flex align-items-center">
                    <p>
                        <Timer :endTime="da.created_at" :key="da.id" /><span>·{{headline_type}}</span>
                    </p>
                    <p class="ml-2 text-nowrap">
                        <svg-icon name='comment'></svg-icon>
                        <span>{{da.comments}}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Timer from '~/components/Timer.vue'
export default {
    name: 'CardBigDiscover',
    components: { Timer },
    props: [
        'da'
    ],
    data() {
        return {
            currentValue: this.value
        }
    },
    computed: {
        getDiffTime: function () {

        },
        headline_type: function () {
            let txt = ''
            switch (this.da.tag) {
                case 'discover':
                    txt = this.$t('discovery')
                    break;

                case 'activity':
                    txt = this.$t('event.i')
                    break;

                default:
                    txt = this.$t('headline')
                    break;
            }
            return txt
        }
    },
    methods: {
        goDetail(da) {
            if (da.tag == 'activity')
                this.$router.push({ path: `/events/${da.id}` })
            else if(da.tag == 'discover')
                this.$router.push({ path: `/discovery/${da.id}` })
            else 
                this.$router.push({ path: `/article/${da.id}` })
        },        
    }
}
</script>

<style lang="scss" scoped>
.card-big-container {
    span {
        font-size: 12px;
    }

    h4 {
        font-size: 15px;
    }
}

.product-img {
    object-fit: cover;
    width: 28vw;
    height: 25vw;
    max-height: 160px;
}

.card-recomm-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    >div {
        flex: 1;
        padding-left: 0.25rem;
        padding-right: 0.25rem;

        img {
            width: 100%;
            height: 100%;
            max-height: 35vw;
        }
    }
}
</style>
