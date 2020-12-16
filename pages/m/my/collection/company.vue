<template>
<div>
    <div class="bg-white p-2">
        <template v-for="(item, index) in my_collects">
            <card-video-r  
            :key='item.id'
            v-if="index>=(page-1)*limit && index<page*limit" 
            :id='item.id' :poster="gsv(['logo', 'url'], item.source) || '/images/ant404.png'" 
            :title="item.source.name[$i18n.locale]" :bigIMG="false" :showPlayIcon="false" 
            @show="goDetail(item.source_id)"
            @delete="handleDelete" >
                <div slot="subTitle" class="d-flex align-items-center text-dark9 font-09">
                    <img src="/icons/my_member.png" height="17" class="mr-2" />
                    <p>展贸通会员</p>
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

const tag = 'company'
export default {
    scrollToTop: true,
    name: 'Collection_Company',
    components: {},
    data() {
        return {
            is_loading: true,
            page: 1,
            limit: 7
        }
    },
    computed: {
        ...mapState('company', ['my_collects']),
    },
    methods: {
        ...mapActions('company', ['getMyCompanyCollects', 'delMyCompanyCollect']),        
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
                this.delMyCompanyCollect(id).then(re => {
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
            this.$router.push({path: `/company/${id}`})
        },
        handleFilter(){
            st.scrollTo(0)
        }
    },
    mounted() {
        this.is_loading = true
        this.getMyCompanyCollects().finally(() => {
            this.is_loading = false
        })
    }
}
</script>
