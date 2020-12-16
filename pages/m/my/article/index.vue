<template>
<div>
    <kuc-page-header :title="$t('article.cont')" to="/my">
        <div class="text-danger" @click="handlePostNewArticle">{{$t('article.post')}}</div>
    </kuc-page-header>
    <!-- intro -->
    <div class="p-2 d-flex justify-content-between bg-white">
        <img :src="auth.writer_avatar || '/files/avatar.png'" alt=" " class="rounded-circle fit-cover avatar-img">
        <div class="flex-1 ml-2">
            <h2>{{gsv(['name', $i18n.locale], user.writer) || gsv([$i18n.locale], auth.name)}} &nbsp;<span class="font-09 text-dark9">{{$t('article.cont1')}} <span class="text-danger">{{total}}</span> </span> </h2>
            <div class="d-flex justify-content-between align-items-center mt-2">
                <p class="text-dark9 mr-2">{{gsv(["summary", $i18n.locale], user.writer)}}</p>
                <nuxt-link to="/my/article/writer">
                    <span class="border px-2 py-1 rounded text-nowrap">{{!auth.status_writer ? $t('member.apply'): $t('edit')}}</span>
                </nuxt-link>
            </div>
        </div>
    </div>
    <!-- title tab -->
    <div class="d-flex justify-content-between align-items-end mt-2">
        <div class="px-2 d-flex">
            <ku-title-line :active="activeLog" class="mr-4" @click="activeLogTab(0)">{{$t('article.my_cont')}} ({{total_submit}})</ku-title-line>
            <ku-title-line :active="!activeLog" @click="activeLogTab(1)">{{$t('msg.draft')}} ({{total_draft}})</ku-title-line>
        </div>
        <div class="filter-box-2 px-2" v-if="activeLog">
            <el-select v-model="listQuery.status" placeholder="" @change="handleFilter">
                <el-option v-for="item in options_status" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
        </div>
    </div>
    <!-- list -->
    <div class="px-2 bg-white">
        <div v-if="activeLog">
            <div v-for="(item, index) in list" :key="item.id">
                <div class="d-flex">
                    <div class="d-flex py-2 flex-1">
                        <el-image :src="getImg1(item.covers)" style="width: 32vw; height: 25vw; max-height: 160px; max-width:340px" fit="cover" lazy @click.native="goDetail(item.id)">
                            <div slot="error" class="image-slot">
                                <img src="/images/ant404.png" alt="" class="w-100 fit-cover">
                            </div>
                        </el-image>
                        <div class="pl-2 pb-2 d-flex justify-content-between flex-column flex-1">
                            <h3 class="pr-2 text-dark text-line-3" @click="goDetail(item.id)">{{item.title}}</h3>
                            <div class="text-dark9 font-08">
                                <p>{{$t('post.date')}}: {{parseTime(item.created_at, "{y}-{m}-{d} {h}:{i}")}}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <p class="my-2">IP: {{item.ip}} PV: {{item.pv}}</p>
                                    <span class="rounded p-1 bg-danger text-white">{{getSatusString(item.status)}}</span>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <p>{{gsv(['name', $i18n.locale], item.category)}}</p>
                                    <div class="d-flex">
                                        <p class="text-nowrap pr-3">
                                            <svg-icon name="comment"></svg-icon> {{item.comments}}
                                        </p>
                                        <p class="text-nowrap">
                                            <svg-icon name="like-o"></svg-icon> {{item.likes}}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center pl-3" @click="handleDelete(item.id)">
                        <p class="p-2 text-dark9 font-12"><i class="el-icon-delete"></i></p>
                    </div>
                </div>
                <ku-line v-if="index<list.length-1" />
            </div>
            <ku-loading-no-data :active="isLoading" :total="total_submit" push />
        </div>
        <div v-else>
            <div v-for="item in list" :key="'k'+item.id">
                <card-video-r :id='item.id' :poster="getImg1(item.covers)" :title="item.title" :subTitle="parseTime(item.created_at, '{y}-{m}-{d}')" :showPlayIcon="false" @delete="handleDelete">
                    <p slot="r" class="p-2 text-dark9 font-12" @click="goEdit(item.id)"><i class="el-icon-edit-outline"></i></p>
                </card-video-r>
            </div>
            <ku-loading-no-data :active="isLoading" :total="total_draft" push />
        </div>
    </div>

    <div class="text-center pagination-kuc my-3">
        <el-pagination background layout="prev, pager, next" :total="total_search" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size="listQuery.limit" :current-page.sync="listQuery.page" @current-change="getList" hide-on-single-page></el-pagination>
    </div>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getMyInfo, getInfo } from "@/api/user"
import { getList, del } from "@/api/discovery"
export default {
    middleware: ['authenticated'],
    name: 'MyArticle',
    head() {
        return {
            title: this.$t('article.cont')
        }
    },
    data() {
        return {
            isLoading: true,
            options_status: [
                { id: 4, name: this.$t('all') },
                { id: 1, name: this.$t('status.on') },
                { id: 2, name: this.$t('status.approved') },
                { id: 3, name: this.$t('status.failed') },
            ],
            activeLog: true,
            listQuery: {
                tag: 'article',
                status: 4,
                user_id: this.$store.state.auth.id,
                limit: 5,
                page: 1
            },
            total: 0,
            total_submit: 0,
            total_draft: 0,
            total_search: 0,
            user: {},
            list: [],
        }
    },
    computed: {
        ...mapState(["auth"]),

    },
    methods: {
        ...mapActions(['setUserAuth']),
        getList() {
            this.isLoading = true
            // this.list = []
            // this.total_search = 0
            getList(this.listQuery).then(res => {
                this.list = res.items
                this.total_search = res.total
                if (this.activeLog) this.total_submit = res.total
                else this.total_draft = res.total
            }).finally(() => {
                this.isLoading = false
            })
        },
        handleFilter() {
            this.listQuery.page = 1
            this.getList()
        },
        activeLogTab(index) {
            if (!index) {
                this.activeLog = true
                this.listQuery.status = 4
            } else {
                this.activeLog = false
                this.listQuery.status = 0
            }
            this.listQuery.page = 1
            this.getList()
        },
        handleTab(aaa) {
            console.log(aaa)
        },
        getSatusString(status_id) {
            const obj = this.options_status.find(xx => xx.id == status_id)
            return obj ? obj.name : ''
        },
        handlePostNewArticle() {
            switch (this.user.status_writer) {
                case 0:
                    this.$router.push({ path: '/my/article/writer' })
                    break;

                case 1:
                    this.$alert(this.$t('msg.wait_writer_profile'), this.$t('warning'), {
                        confirmButtonText: this.$t('confirm.ok'),
                        callback: action => {}
                    });
                    break;
                case 2:
                    this.$router.push({ path: '/my/article/new' })
                    break;
            }
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
                del([id]).then(() => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'

                    });
                    this.total--;
                    this.getList()
                })
            }).catch(() => {})
        },
        goDetail(id) {
            this.$router.push({ path: `/article/${id}` })
            // this.$router.push({path: `/my/article/${id}`})
        },
        goEdit(id) {
            this.$router.push({ path: `/my/article/${id}` })
        }
    },
    mounted() {
        getInfo(this.auth.id).then(({ user }) => {
                this.setUserAuth(user)
                this.user = user
                this.total = this.gsv(['articles_count'], user.writer) || 0
                this.total_submit = this.gsv(['submissions'], user.writer) || 0
                this.total_draft = this.gsv(['drafts'], user.writer) || 0
            }),
            this.getList()
    }
}
</script>

<style lang="scss">
.el-input__inner {
    background: transparent;
}
</style>

<style lang="scss" scoped>
.avatar-img {
    width: 4rem;
    height: 4rem;
}
</style>
