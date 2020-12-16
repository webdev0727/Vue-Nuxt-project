<template>
<div class="container">
    <kuc-page-header :title="$t('article.detail')"></kuc-page-header>
    <div class="bg-white p-2 mb-2" v-if="info.id">
        <h2>{{info.title || $t('title')}}</h2>
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex text-dark9 my-2">
                <img :src="gsv(['writer', 'avatar', 'url'], info.user) || gsv(['avatar', 'url'], info.user) || '/files/avatar.png'" class="rounded-circle mr-2 user-avatar" style="object-fit:cover" alt="">
                <div class="d-flex flex-wrap align-items-center ">
                    <template v-if="gsv(['name', $i18n.locale], info.user)">
                        <p class="text-nowrap">{{gsv(['name', $i18n.locale], info.user)}}</p>
                        <p class="mx-1">⋅</p>
                    </template>
                    <p class="text-nowrap">{{info.comments}}{{$t('comment')}}</p>
                    <p class="mx-1">⋅</p>
                    <p class="font-09">{{formatTime(info.created_at)}}</p>
                    <p class="mx-1">⋅</p>
                    <p class="text-nowrap">{{info.tag == 'discover'? $t('discovery'): $t('headline')}}</p>
                    <template v-if="info.category_id">
                        <p class="mx-1">⋅</p>
                        <p>{{gsv(['name', $i18n.locale], info.category)}}</p>
                    </template>
                </div>
            </div>
            <p class="ml-2 text-dark9 text-nowrap">
                <svg-icon name='eye-open' width='20' height='20'></svg-icon>
                <span>{{info.views}}</span>
            </p>
        </div>
        <client-only>
            <VueReadMoreSmooth :lines='20' :text="$t('more_see')" :open.sync="open" no-less>
                <div v-html="info.content" class="v-html"></div>
                <div>
                    <img :src="item.url" alt="" v-for="item in info.covers" :key="item.id" class="w-100">
                </div>
                <template v-slot:more="value">
                    <div @click.stop="handleShowMore(value)" class="text-center text-dark9" v-if="!open">
                        {{$t('more_see')}}
                    </div>
                </template>
            </VueReadMoreSmooth>
        </client-only>

        <!-- like + collect -->
        <div class="text-center my-3 px-4 d-flex justify-content-center">
            <div class="w-50 px-3">
                <el-button plain class="w-100" size="medium" round @click="handleLike" :disabled="is_mine">
                    <svg-icon v-if="info.my_like" name="like" width='20' height='20'></svg-icon>
                    <svg-icon v-else name="like-o" width='20' height='20'></svg-icon>
                    {{$t('like')}} {{info.likes}}
                </el-button>
            </div>
            <div class="w-50 px-3">
                <el-button :type="info.my_collect ? 'primary' : ''" class="w-100" size="medium" round @click="handleShoucang" :disabled="is_mine">
                    <svg-icon v-if="info.my_collect" name="star" color='white' width='16' height='16'></svg-icon>
                    <svg-icon v-else name="star-o" width='16' height='16'></svg-icon>
                    {{$t('collect')}} {{info.collects}}
                </el-button>
            </div>
        </div>

        <!-- Share -->
        <!-- <div class="d-flex justify-content-center align-items-center px-2 mb-4">
            <p class="mx-2">{{$t('share_to')}}</p>
            <el-button type="success" circle class="mx-2">
                <svg-icon name="wechat" width='25' height='25'></svg-icon>
            </el-button>
            <el-button type="success" circle style="background-color:#DF4D69; border-color:#DF4D69" class="mx-2">
                <svg-icon name="sina" width='25' height='25'></svg-icon>
            </el-button>
            <el-button type="success" circle style="background-color:#2AAFFE; border-color:#2AAFFE" class="mx-2">
                <svg-icon name="twiter" width='25' height='25'></svg-icon>
            </el-button>
        </div> -->
    </div>

    <!-- Writer Profile -->
    <div class="bg-white p-2" v-if="info.id && info.tag=='article' && gsv(['writer'], info.user)">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
            <nuxt-link class="d-flex flex-1" :to="'/writer/' + info.user_id">
                <img :src="gsv(['writer', 'avatar', 'url'], info.user) || gsv(['avatar', 'url'], info.user) || '/files/avatar.png'" class="rounded-circle mr-2 user-avatar" style="object-fit:cover" alt="">
                <div class="mr-2">
                    <p>{{gsv(['name', $i18n.locale], info.user)}}</p>
                    <p class="font-08 text-dark9">擅长：海外最新资讯分享，英国本土分享</p>
                </div>
            </nuxt-link>
            <div>
                <el-button type="primary" size="medium" @click="handleFollowUser" round :disabled="is_mine"> {{gsv(['writer', 'my_follow'], info.user) ? '已关注' : '+关注' }} </el-button>
            </div>

        </div>
        <div class="d-flex justify-content-around mt-2">
            <div class="text-center">
                <!-- <p>{{gsv(['writer', "articles_count"], info.user)}}</p> -->
                <p>{{gsv(['writer', "submissions"], info.user) || 0}}</p>
                <p class="font-08 text-dark9">{{$t('article.i')}}</p>
            </div>
            <div class="text-center">
                <p>{{gsv(['writer', "likes"], info.user) || 0}}</p>
                <p class="font-08 text-dark9">{{$t('like')}}</p>
            </div>
            <div class="text-center">
                <p>{{gsv(['writer', "articles_count"], info.user) || 0}}</p>
                <p class="font-08 text-dark9">{{$t('comment')}}</p>
            </div>

        </div>
    </div>
    <div class="bg-white my-2 pb-2" v-if="info.id">
        <el-form ref="dataForm" :rules="rules" :model="new_comment" label-position="left" label-width="0" class="bg-white p-2">
            <h3 class="mb-2">{{$t('comment.all')}} <span class="text-danger font-09">{{info.comments}}{{$t('comment.quantity')}}</span> </h3>
            <!-- content -->
            <el-form-item prop="comment" class="ku-no-after mt-2">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 9}" maxlength="500" show-word-limit v-model="new_comment.comment" :placeholder="$t('form.say')"></el-input>
            </el-form-item>

            <div class="d-flex justify-content-between align-items-center my-2">
                <el-checkbox v-model="new_comment.to_writer" label="">{{$t('msg.Leave_a_message_to_the_author')}}</el-checkbox>
                <el-button type="primary" @click="handleNewComment" round size="medium" :disabled="!!info.my_comment || is_mine">{{$t('comment.post')}}</el-button>
            </div>
        </el-form>
        <div class="comment-container pl-2">
            <ku-line />
            <div v-for="item in comments" :key="item.id" class="d-flex border-bottom py-1 mb-2">
                <img :src="gsv(['avatar', 'url'], item.user) || '/files/avatar.png'" alt=" " class="rounded-circle mr-2" style="object-fit:cover">
                <div class="flex-1 pr-2">
                    <div class="d-flex justify-content-between">
                        <p>{{gsv(['name', $i18n.locale], item.user)}}</p>
                        <div class="d-flex mr-2 text-dark9">
                            <p @click="handleLikeComments(item)">
                                <svg-icon :name="item.my_like ? 'like': 'like-o'" width='20' height='20'></svg-icon>
                                <span>{{item.likes}}</span>
                            </p>
                            <p class="ml-2">
                                <svg-icon name='comment'></svg-icon>
                                <span>{{item.comments}}</span>
                            </p>
                        </div>
                    </div>
                    <p class="text-dark text-line-1">{{item.comment}}</p>
                </div>
            </div>

            <infinite-loading spinner="spiral" :identifier='infiniteId' @infinite="handleInfinite" class="m-3"> </infinite-loading>

        </div>
        <!-- <p class="text-center mb-2">
            <el-button type="text" class="p-2 text-dark9" @click="handleMoreComments">{{$t('more')}}</el-button>
        </p> -->
    </div>
</div>
</template>

<script>
const permission_id = 6
import { mapState, mapActions, mapGetters } from 'vuex'
import { getDetail, action } from "@/api/discovery"
import { actionWriter } from "@/api/writer"
import { getComments, toggleLike } from '@/api/comment'
export default {
    name: "ArticleDetail",
    components: {},
    data() {
        return {
            commentQuery: {},
            commentChk: false,
            info: {},
            news_tag: [],
            comments: [],
            listQuery: {
                page: 1,
                limit: 5
            },
            total: 0,
            infiniteId: +new Date(),
            isLoading: true,
            new_comment: {
                comment: "",
                to_writer: 0,
            },
            rules: {
                comment: [{ required: true, message: this.$t('valid.required', [this.$t('content.i')]), trigger: ['blur', 'change'] },
                    { min: 5, message: this.$t('valid.min.string', [this.$t('content.i'), 5]), trigger: ['blur', 'change'] },
                ]
            },
            open: false
        }
    },
    head() {
        return {
            title: this.info.title,
            meta: [{
                hid: 'description',
                name: 'description',
                content: this.$options.filters.strippedContent(this.info.content || '').substring(0, 150)
            }]
        }
    },
    async asyncData({ params, route, redirect }) {
        let info = {}
        let news_tag = []
        const res = await getDetail(params.id)
        // console.log(res)
        if (res.item) {
            if (res.item.tag == 'activity') redirect(`/events/${params.id}`)
            info = res.item
            news_tag = res.news_tag
        } else {
            redirect(`/events`)
        }
        return {
            info,
            news_tag
        }
    },
    computed: {
        ...mapGetters(['userLevel']),
        is_mine: function () {
            return this.gsv(['id'], this.$store.state.auth) == this.info.user_id
        }
    },
    methods: {
        checkPermisson() {
            let ppp = false
            const lev = this.info.read_vip_lvl
            if (this.info.tag == 'discover') ppp = true
            else {
                if (this.userLevel >= lev) {
                    ppp = true
                } else {
                    if (+new Date(this.info.open_time) < new Date().getTime()) {
                        // this.open = true
                        ppp = true
                    } else {
                        if (this.$store.state.auth) {
                            this.$confirm("没权限使用该功能. 您是否要升级权限？", this.$t('warning'), {
                                confirmButtonText: this.$t('btn.apply'),
                                cancelButtonText: this.$t('confirm.cancle'),
                                showClose: false,                
                                showCancelButton: true,
                                confirmButtonClass: 'text-danger',
                                cancelButtonClass: 'border-right',
                                customClass: 'ku-confirm',
                                dangerouslyUseHTMLString: true,
                                center: true,
                            }).then(() => {
                                this.$router.push({ path: "/pricing", query: { lev, redirect: this.$route.path } })
                            }).catch(() => {})
                        } else {
                            this.$router.push({ path: `/login?redirect=${this.$route.path}` })
                        }
                    }
                }
            }
            return ppp
        },
        getList() {
            getDetail(this.$route.params.id).then(({ item, comments, news_tag }) => {
                    if (item.tag == 'activity') this.$router.replace({ path: `/events/${this.$route.params.id}` })
                    this.info = item
                    this.news_tag = news_tag
                }).catch(err => {
                    this.goBack()
                })
                .finally(() => {
                    this.isLoading = false
                })
        },
        handleInfinite($state) {
            getComments('article', this.$route.params.id, this.listQuery).then(res => {
                if (res.items.length) {
                    this.listQuery.page += 1;
                    this.comments.push(...res.items)
                    this.total = res.total
                    $state.loaded()
                    if (this.comments.length >= this.total) {
                        $state.complete();
                    }
                } else {
                    $state.complete();
                }
            })
        },
        handleLikeComments(item) {
            if (!this.userLevel) {
                this.$router.push({ path: `/login?redirect=${this.$route.path}` })
                return
            }
            if (!this.is_mine) {
                if (!this.checkPermisson()) return false
                toggleLike(3, item.id).then(res => {
                    const iii = this.comments.findIndex(rr => rr.id == item.id)
                    if (iii >= 0) {
                        this.comments[iii]['likes'] = res.likes
                        this.comments[iii]['my_like'] = res.my_like
                    }
                })
            }
        },
        handleShoucang() {
            if (!this.userLevel) {
                this.$router.push({ path: `/login?redirect=${this.$route.path}` })
                return
            }
            if (!this.is_mine) {
                if (!this.checkPermisson()) return false
                action('collect', this.$route.params.id).then(res => {
                    this.info.my_collect = !this.info.my_collect
                    this.info.collects = res.collects
                    if (this.info.my_collect) {
                        const path = this.info.tag == 'discover' ? "/my/collection/discovery" : "/my/collection/headline"
                        const view_path = `“${this.$t('mine')}- ${this.$t('collect.my')}”`
                        let content = ''
                        if (this.$i18n.locale == 'zh')
                            content = `<p class="font-11">可进入<span class="text-danger">${view_path}</span>查看</p>`
                        else
                            content = `<p class="font-11">Visit <span class="text-danger">${view_path}</span> to manage your favorites</p>`

                        this.$confirm(content, this.$t('collect.success'), {
                            confirmButtonText: this.$t('btn.go_to_view'),
                            cancelButtonText: this.$t('confirm.cancle'),
                            showClose: false,                
                            showCancelButton: true,
                            confirmButtonClass: 'text-danger',
                            cancelButtonClass: 'border-right',
                            customClass: 'ku-confirm',
                            dangerouslyUseHTMLString: true,
                            center: true,
                        }).then(() => {
                            this.$router.push({ path })
                        }).catch(() => {})
                    }
                })
            }
        },
        handleLike() {
            if (!this.userLevel) {
                this.$router.push({ path: `/login?redirect=${this.$route.path}` })
                return
            }
            if (!this.is_mine) {
                if (!this.checkPermisson()) return false
                action('like', this.$route.params.id).then(res => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.msg'),
                        type: 'success'
                    });
                    this.info.my_like = !this.info.my_like
                    const new_like_1 = res.likes - this.info.likes
                    this.info.likes = res.likes
                    this.info.user.writer.likes = this.info.user.writer.likes + new_like_1
                })
            }

        },
        handleFollowUser() {
            if (!this.userLevel) {
                this.$router.push({ path: `/login?redirect=${this.$route.path}` })
                return
            }
            if (!this.is_mine) {
                if (!this.checkPermisson()) return false
                actionWriter('follow', this.info.user_id).then(res => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.msg'),
                        type: 'success'
                    });
                    this.getList()
                })
            } else {
                this.$notify({
                    title: this.$t('error'),
                    message: "This writer is you",
                    type: 'error',
                    duration: 2000
                });
            }
        },
        handleNewComment() {
            if (!this.userLevel) {
                this.$router.push({ path: `/login?redirect=${this.$route.path}` })
                return
            }
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    if (!this.checkPermisson()) return false
                    action('comment', this.$route.params.id, this.new_comment).then(res => {
                        this.$notify({
                            title: this.$t('success'),
                            message: this.$t('success.msg'),
                            type: 'success'
                        });
                        this.getList()
                        this.comments = []
                        this.total = 0
                        this.listQuery.page = 1
                        this.infiniteId = +new Date()
                        // this.comments.push(...res.comments)
                        // this.new_comment.comment = ""
                        // this.$refs['dataForm'].resetFields();
                    })
                }
            });
        },
        handleMoreComments() {
            this.commentQuery.page += 1;
            getComments(this.commentQuery).then(res => {
                this.comments.items.push(...res.items)
            })
        },

        handleShowMore() {
            this.open = this.checkPermisson()
        }

    },
    mounted() {
        this.getList()
    },
}
</script>

<style lang="scss" scoped>
.comment-container img,
.user-avatar {
    width: 2.5rem;
    height: 2.5rem;
}
</style>
