<template>
<div>
    <!-- header -->
    <kuc-page-header :title="$t('event.detail')" />

    <!-- carousel height="min(40vw, 400px)"-->
    <div class="conatiner-carousel mh-400">
        <el-carousel height="40vw">
            <el-carousel-item v-for="item in info.covers" :key="item.id">
                <div class="banner-container-div" :style="`background-image:url(${item.url})`"></div>
            </el-carousel-item>
        </el-carousel>
    </div>

    <div class="bg-white p-2 mb-2" v-if="info.id">
        <h3>
            <span v-if="info.subtag=='online'" class="text-white  px-2 py-1 bg-dark font-08 rounded">{{$t('status.online')}}</span>
            <span v-else class="text-white bg-danger px-2 py-1 font-08 rounded">{{$t('status.offline')}}</span>
            {{gsv([$i18n.locale], info.title)}}
        </h3>
        <div class="d-flex align-items-start justify-content-between mt-2">
            <div>
                <p>{{$t('event.time')}}: {{ parseTime(info.startdate, '{y}年{m}月{d}日') }}至{{ parseTime(info.enddate, '{m}月{d}日')}}</p>

                <p>{{$t('deadline')}}: {{info.signupdate}}</p>
                <p>{{$t('event.ob')}}: {{memberType}}</p>
            </div>
            <el-button v-if="info.my_signup" type="info" size="small" round disabled>{{$t('status.baoming')}}</el-button>
            <el-button v-else-if="getIsDissable(info.enddate)" type="info" size="small" round disabled>{{$t('status.close')}}</el-button>
            <el-button v-else type="primary" :disabled="!userLevel" @click="handleJoin(info.id)" size="small" round>{{$t('btn.sign_up')}}</el-button>
        </div>

        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center text-dark9 my-2">
                <img :src="gsv(['avatar', 'url'], info.user) || '/files/avatar.png'" class="rounded-circle mr-2 user-avatar" style="object-fit:cover" alt="">
                <p class="text-nowrap">{{gsv(['name', $i18n.locale], info.user)}}</p>
                <p class="mx-1">⋅</p>
                <p class="text-nowrap">{{info.comments}}{{$t('comment')}}</p>
                <p class="mx-1">⋅</p>
                <p>{{formatTime(info.created_at)}}</p>
                <!-- <p class="mx-1">⋅</p> -->
                <!-- <p>{{$t('headline')}}</p> -->
            </div>
            <p class="ml-2 text-dark9">
                <svg-icon name='eye-open' width='20' height='20'></svg-icon>
                <span>{{info.views}}</span>
            </p>
        </div>

        <div v-html="info.content" class="post-content v-html"></div>

        <div class="text-center my-3 px-4 d-flex justify-content-center">
            <div class="w-50 px-3">
                <el-button plain class="w-100" size="medium" round @click="handleLike" :disabled="is_mine">
                    <svg-icon v-if="info.my_like" name="like" width='20' height='20'></svg-icon>
                    <svg-icon v-else name="like-o" width='20' height='20'></svg-icon>
                    {{$t('like')}} {{info.likes}}
                </el-button>
            </div>
            <div class="w-50 px-3">
                <el-button plain class="w-100" size="medium" round @click="handleShoucang" :disabled="is_mine">
                    <svg-icon v-if="info.my_collect" name="star" color='red' width='16' height='16'></svg-icon>
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

    <!-- <div class="bg-white p-2 mb-2" v-if="info.id">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
            <nuxt-link class="d-flex flex-1" :to="'/writer/'+info.user_id">
                <img :src="gsv(['avatar', 'url'], info.user) || '/files/avatar.png'" class="rounded-circle mr-2 user-avatar" style="object-fit:cover" alt="">
                <div class="mr-2">
                    <p>{{gsv(['name', $i18n.locale], info.user)}}</p>
                    <p class="font-08 text-dark9">擅长：海外最新资讯分享，英国本土分享</p>
                </div>
            </nuxt-link>
            <div>
                <el-button type="primary" size="medium" @click="handleFollowUser" round :disabled="!info.user_id || !userLevel"> {{gsv(['writer', 'my_follow'], info.user) ? $t('follow.done') : $t('follow.do') }} </el-button>
            </div>

        </div>
        <div class="d-flex justify-content-around mt-2">
            <div class="text-center">
                <p>{{gsv(['writer', "articles_count"], info.user) || 0}}</p>
                <p class="font-08 text-dark9">{{$t('article.i')}}</p>
            </div>
            <div class="text-center">
                <p>{{gsv(['writer', "likes"], info.user) || 0}}</p>
                <p class="font-08 text-dark9">{{$t('like')}}</p>
            </div>
            <div class="text-center">
                <p>{{gsv(['writer', "comments"], info.user) || 0}}</p>
                <p class="font-08 text-dark9">{{$t('comment')}}</p>
            </div>

        </div>
    </div> -->

    <div class="bg-white p-2" v-if="info.id">
        <!-- <div class="px-2 border-bottom">
            <ku-tab-line :list='tab_items' :activeTab.sync="activeTab" :activeTabBarWidth=30 @change="handleTabChange"></ku-tab-line>
        </div> -->
        <ku-title-left>{{$t('status.baoming')}} <span class="font-1 text-danger">（{{signups.length}}<span v-if="$i18n.locale=='zh'">人</span>）</span></ku-title-left>
        <div class=" d-flex flex-wrap shoucang-users">
            <div v-for="ii in user_list_cur" :key="ii" :to="'/writer/' + signups[ii-1]['user_id']">
                <img :src="gsv(['avatar', 'url'], signups[ii-1]['user']) || '/files/avatar.png'" alt="" class="rounded-circle fit-cover p-1">
            </div>
            <el-button type="text" @click="handleUserReadMore" v-if="user_list_cur<signups.length">
                <i class="el-icon-more text-dark9 font-13"></i>
            </el-button>

        </div>

        <no-data v-if="!signups.length"></no-data>
    </div>

    <!-- comment -->
    <div class="bg-white my-2 pb-2" v-if="info.id">
        <el-form ref="dataForm" :rules="rules" :model="new_comment" label-position="left" label-width="0" class="bg-white p-2">
            <h3 class="mb-2">{{$t('comment.all')}} <span class="text-danger font-09">{{info.comments}}{{$t('comment.quantity')}}</span> </h3>
            <el-form-item prop="comment" class="ku-no-after mt-2">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 9}" maxlength="500" show-word-limit v-model="new_comment.comment" :placeholder="$t('form.say')"></el-input>
            </el-form-item>

            <div class="text-right mb-2">
                <el-button type="primary" @click="handleNewComment" round size="medium" :disabled="info.my_comment || !userLevel">{{$t('comment.post')}}</el-button>
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
import { mapState, mapActions, mapGetters } from 'vuex'
import { getDetail, action } from "@/api/discovery"
import { actionWriter } from "@/api/writer"
import { getComments, toggleLike } from '@/api/comment'
const INIT_BAOMIN_USER_COUNT = 10

export default {
    // middleware: 'authenticated',
    scrollToTop: true,
    head() {
        return {
            title: this.$t('event.i')
        }
    },
    data() {
        return {
            info: {},
            signups: [],
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
            },
            user_list_cur: 0,
            rules: {
                comment: [{ required: true, message: this.$t('valid.required', [this.$t('content.i')]), trigger: ['blur', 'change'] },
                    { min: 5, message: this.$t('valid.min.string', [this.$t('content.i'), 5]), trigger: ['blur', 'change'] },
                ]
            },
            open: false
        }
    },
    async asyncData({ params, route, redirect }) {
        let info = {}
        let news_tag = []
        let signups, user_list_cur
        const res = await getDetail(params.id)
        // console.log(res)
        if (res.item) {
            if (res.item.tag == 'article') redirect(`/article/${params.id}`)
            info = res.item
            news_tag = res.news_tag
            signups = res.signups
            user_list_cur = Math.min(INIT_BAOMIN_USER_COUNT, signups.length)
        } else {
            redirect(`/article`)
        }
        return {
            info,
            news_tag,
            signups,
            user_list_cur
        }
    },
    computed: {
        ...mapGetters(['userLevel']),
        allowed: function () {
            let is_allowed = false
            const article_level = this.info.read_vip_lvl
            if (this.$store.state.auth) {
                // is_allowed = this.$store.state.auth_.includes(permission_id)
                is_allowed = this.userLevel >= article_level
            }
            return is_allowed
        },

        // 1-认证会员, 2-VIP, 3-文具通会员(展贸通)
        memberType: function () {
            let type = this.$t('all')
            switch (this.info.signup_user_type) {
                case 1:
                    type = this.$t('member.certified')
                    break;
                case 2:
                    type = this.$t('member.vip')
                    break;
                case 3:
                    type = this.$t('member.w')
                    break;
                default:
                    break;
            }
            return type
        },
        is_mine: function () {
            let is_m = false
            if (this.userLevel) {
                is_m = this.info.user_id == this.$store.state.auth.id
            }
            return is_m
        }
    },

    methods: {
        getList() {
            getDetail(this.$route.params.id).then(({ item, signups, comments, news_tag }) => {
                    if (item.tag == 'article') this.$router.replace({ path: `/article/${this.$route.params.id}` })
                    this.info = item
                    this.news_tag = news_tag,
                        this.signups = signups
                    this.user_list_cur = Math.min(INIT_BAOMIN_USER_COUNT, signups.length)
                }).catch(err => {
                    this.goBack()
                })
                .finally(() => {
                    this.isLoading = false
                })
        },
        handleInfinite($state) {
            getComments('activity', this.$route.params.id, this.listQuery).then(res => {
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
            if (!this.is_mine) {
                toggleLike(4, item.id).then(res => {
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
                action('collect', this.$route.params.id).then(res => {
                    this.info.my_collect = !this.info.my_collect
                    this.info.collects = res.collects
                    // this.dialogVisible = !this.info.my_collect
                    if (this.info.my_collect) {
                        const path = "/my/collection/event"
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
                action('like', this.$route.params.id).then(res => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.msg'),
                        type: 'success'
                    });
                    this.info.my_like = !this.info.my_like
                    this.info.likes = res.likes
                })
            }
        },
        getIsDissable(endTime) {
            var endTimeSecond = endTime
            if (this.validDate(endTime)) {
                endTimeSecond = endTime + ' 23:59:59'
            }
            if (new Date().getTime() > +new Date(endTimeSecond)) return true
            return false
        },
        handleUserReadMore() {
            this.user_list_cur = Math.min(this.user_list_cur + INIT_BAOMIN_USER_COUNT, this.signups.length)
        },
        handleJoin(id) {
            this.$router.push({ path: '/events/baoming/' + id })
        },
        handleNewComment() {
            if (!this.userLevel) {
                this.$router.push({ path: `/login?redirect=${this.$route.path}` })
                return
            }
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
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
                    })
                }
            });
        },
    },
    mounted() {
        this.getList()
    }
}
</script>

<style lang="scss" scoped>
.comment-container img,
.user-avatar {
    width: 2.5rem;
    height: 2.5rem;
}

.shoucang-users {

    img,
    button {
        width: 3.5rem;
        height: 3.5rem;
    }
}
</style>
