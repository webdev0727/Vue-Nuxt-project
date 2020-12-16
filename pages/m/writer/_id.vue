<template>
<div>
    <kuc-page-header title="个人专栏"></kuc-page-header>
    <div class="avatar-div p-2">
        <div class="d-flex justify-content-between">
            <img :src="gsv(['avatar', 'url'], writer) || '/files/avatar.png'" alt=" " class="rounded-circle fit-cover" style="width:4rem; height:4rem;">
            <div class="flex-1 ml-2 d-flex flex-column justify-content-between py-1">
                <h2>{{gsv(['name', $i18n.locale], writer) || gsv([$i18n.locale], user.name)}} &nbsp; <span class="font-1 font-weight-normal">{{gsv(['country', 'name'], user.company)}} {{gsv(['region', 'name'], user.company)}}</span> </h2>
                <el-row class="font-09">
                    <el-col :span="12">{{$t('article.post')}}：{{gsv(['submissions'], writer) || 0}}</el-col>
                    <el-col :span="12">总访问数：{{gsv(['visits'], writer) || 0}}</el-col>
                </el-row>
            </div>
        </div>
        <p class="mt-2">
            {{gsv(['summary', $i18n.locale], writer)}}
        </p>
    </div>
    <!-- list -->
    <div class="p-2">
        <div class="bg-white px-2 rounded overflow-hidden">
            <div v-for="item in articles" :key="item.id">
                <nuxt-link :to="'/article/'+item.id">
                    <card-r :poster="getImg1(item.covers)" :title="item.title">
                        <p class="text-right pr-2 text-line-1 text-dark9 font-09">
                            <svg-icon name="comment" width="14" height="14"></svg-icon> {{item.comments}} &nbsp;
                            <svg-icon name="like-o"></svg-icon> {{item.likes}}
                        </p>
                    </card-r>
                </nuxt-link>
            </div>
            <ku-loading-no-data :active="isLoading" :total="articles.length" />
        </div>
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getInfo } from '@/api/user'
import { getDetail } from '@/api/writer'
export default {
    middleware: 'authenticated',
    head() {
        return {
            title: '个人专栏'
        }
    },
    data() {
        return {
            user: {},
            writer: {},
            articles: [],
            isLoading: true
        }
    },
    computed: {
    },
    methods: {
        handleDetail(id) {
            console.log(id)
        }
    },    
    mounted() {
        getDetail(this.$route.params.id).then(res => {
            this.articles = res.articles
            this.writer = res.writer
        }).catch(err => {
            this.goBack()
        }).finally(() => {
            this.isLoading = false
        })
        getInfo(this.$route.params.id).then(res => {
            this.user = res.user || {}
        })
    },
}
</script>

<style lang="scss" scoped>
.avatar-div {
    background-image: url('/images/bg_user.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    color: white;
}
</style>
