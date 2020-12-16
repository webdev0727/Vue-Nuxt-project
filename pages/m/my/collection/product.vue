<template>
<div>
    <div class="bg-white p-2">
        <template v-for="(item, index) in my_collects">
            <card-video-r 
            :key='item.id'
            v-if="index>=(page-1)*limit && index<page*limit" 
            :id='item.id' 
            :poster="getImg1(gsv(['assets'], item.source)  || '/images/ant404.png')" 
            :bigIMG="false" 
            :showPlayIcon="false" 
            @show="goDetail(item.source_id)" 
            @delete="handleDelete">
                <h4 slot="title" class="text-line-2" @click="goDetail(item.source_id)">{{gsv(['name', $i18n.locale], item.source)}}</h4>
                <strong slot="subTitle" class="text-danger font-09 mb-1" @click="goDetail(item.source_id)">￥{{gsv(['price'], item.source)}}</strong>
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
const tag = 'product'
export default {
    scrollToTop: true,
    name: 'Collection_Products',
    components: {},
    data() {
        return {
            is_loading: true,
            page: 1,
            limit: 7
        }
    },
    computed: {
        ...mapState('product', ['my_collects']),
    },
    methods: {
        ...mapActions('product', ['getMyProductCollects', 'delMyProductCollect']),

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
                this.delMyProductCollect(id).then(re => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'
                    });
                    this.page = Math.min(parseInt(this.my_collects.length / this.limit) + 1, this.page)
                })
            }).catch(() => {})
        },
        goDetail(id) {
            this.$router.push({ path: `/product/${id}` })
        },
        handleFilter(){
            st.scrollTo(0)
        }
    },
    mounted() {
        this.is_loading = true
        this.getMyProductCollects().finally(() => {
            this.is_loading = false
        })
    }
}
</script>
