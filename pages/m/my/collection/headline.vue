<template>
<div>
    <div class="bg-white p-2">
        <template v-for="(item, index) in my_collects" >
            <card-video-r 
            :key='item.id'
            :id='item.id' 
            v-if="index>=(page-1)*limit && index<page*limit && item.source" 
            :poster="getImg1(item.source.covers) || '/images/ant404.png'" :title="item.source.name || item.source.title || item.source.title_del" 
            :bigIMG="false" :showPlayIcon="false" 
            @show="goDetail(item.source_id)"
            @delete="handleDelete">
                <div slot="subTitle" class="d-flex align-items-center text-dark9 font-09">
                    <el-avatar :size="25" :src="gsv(['user','writer', 'avatar', 'url'], item.source) || '/files/avatar.png'" class="mr-2">
                        <img src="/files/avatar.png"/>
                    </el-avatar>
                    <p>{{gsv(['user','name', $i18n.locale], item.source)}} ⋅ {{item.source.comments}}{{$t('comment')}} </p>
                </div>
            </card-video-r>
        </template>
        <ku-loading-no-data :active="is_loading" :total="my_collects.length" />
    </div>

    <div class="text-center pagination-kuc mb-3">
        <el-pagination background layout="prev, pager, next" :total="my_collects.length" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size="limit" :current-page.sync="page" hide-on-single-page @current-change="handleFilter"></el-pagination>
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
const st = process.client ? require('@/utils/scroll-to') : undefined

export default {
    scrollToTop: true,
    name: 'Collection_Headline',
    components: {},
    data() {
        return {
            is_loading: false,            
            page: 1,
            limit: 7,            
        }
    },
    computed: {
        ...mapState('article', ['my_collects']),
    },
    methods: {
        ...mapActions('article', ['getMyArticleCollects', 'delMyArticleCollect']),
        handleDelete(id) {
            this.$confirm(this.$t('confirm.msg_del'), this.$t('warning'), {
                confirmButtonText: this.$t('confirm.ok'),
                cancelButtonText: this.$t('confirm.cancle'),
                type: 'warning',
                showClose: false,                
                showCancelButton: true,
                confirmButtonClass: 'text-danger',
                cancelButtonClass: 'border-right',
                customClass: 'ku-confirm',
                dangerouslyUseHTMLString: true,
                center: true,
            }).then(() => {
                this.delMyArticleCollect(id).then(re => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'
                    });
                    this.page = Math.min(parseInt(this.my_collects.length / this.limit) + 1, this.page)
                })
            }).catch(() => {})
        },
        goDetail(id){
            this.$router.push({path: `/article/${id}`})
        },
        handleFilter(){
            st.scrollTo(0)
        }

    },
    mounted() {
        this.is_loading = true
        this.getMyArticleCollects().finally(() => {
            this.is_loading = false
        })
    }
}
</script>