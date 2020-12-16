<template>
<div>
    <div class="bg-white p-2">
        <div v-for="item in list.items" :key='item.id'>
            <card-video-r :id='item.id' :poster="getImg1(item.source.covers)" :title="gsv([$i18n.locale], item.source.title)" :bigIMG="false" :showPlayIcon="false" @delete="handleDelete"  v-if="item.source">
                <div slot="subTitle" class="d-flex align-items-center text-dark9 font-09">
                    <img :src="gsv(['user','writer', 'avatar', 'url'], item.source) || '/files/avatar.png'" height="20" width="20" class="mr-2 rounded-circle fit-cover" />
                    <p>{{gsv(['user','name', $i18n.locale], item.source)}} ⋅ {{item.source.comments}}{{$t('comment')}} </p>
                </div>
            </card-video-r>
        </div>
        <ku-loading-no-data :active="is_loading" :total="list.total" />
    </div>

    <div class="text-center pagination-kuc mb-3">
        <el-pagination background layout="prev, pager, next" :total="list.total" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size="listQuery.limit" :current-page.sync="listQuery.page" @current-change="getList" hide-on-single-page></el-pagination>
    </div>
</div>
</template>

<script>
import { getCollection, delCollect } from "~/api/common"
const tag = 'activity'
export default {
    scrollToTop: true,
    name: 'Collection_Event',
    components: {},
    data() {
        return {
            is_loading: false,
            list: {
                items: [],
                total: 0
            },
            listQuery: {
                page: 1,
                limit: 10
            },
            activeTabName: 'all',
        }
    },
    methods: {
        getList() {
            this.is_loading = true
            getCollection(tag, this.listQuery).then(res => {
                this.list = res;
            }).finally(() => {
                this.is_loading = false
            })
        },
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
                delCollect(tag, id).then(re => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'
                    });
                    this.listQuery.page = 1
                    this.getList()
                })
            }).catch(() => {})
        },

    },
    mounted() {
        this.getList()
    }
}
</script>