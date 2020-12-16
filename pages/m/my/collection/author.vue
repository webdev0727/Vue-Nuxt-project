<template>
<div>
    <div class="bg-white p-2">        
        <div v-for="item in list.items" :key='item.id'>
            <card-video-r :id='item.id' :poster="item.url" :title="item.name" :bigIMG="false" :showPlayIcon="false" imgCircle @delete="handleDelete">
                <h3 slot="title">{{$t('author_name')}}</h3>
                <strong slot="subTitle" class="text-dark9 font-09 mb-1">{{$t('article.i')}}：200</strong>
            </card-video-r>
        </div>
        <ku-loading-no-data :active="is_loading" :total="list.total" />
    </div>
</div>
</template>

<script>
import { getCollection, delCollect } from "~/api/common"
const tag = 'writer'
export default {
    scrollToTop: true,
    name: 'Collection_Author',
    components: {},
    data() {
        return {
            is_loading: true,
            list: {
                items: [],
                total: 0
            },
            listQuery: {
                page: 1,
                limit: 10
            },
        }
    },
    // async asyncData({ params }) {
    //     const all_infos = await getCollection(params)
    //     return {
    //         list: all_infos,
    //     }
    // },
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