<template>
<div class="bg-white mt-2">
    <div class="px-2">
        <ku-tab-line v-if="menu_visitor.length" :list='menu_visitor' :activeTab.sync="activeTab" :activeTabBarWidth=40 activeTabBarColor="bg-blue-2" _key='category_id' @change="handleTabChange" class="border-bottom"></ku-tab-line>
    </div>
    <div class="p-2">

        <div v-if="activeTab==74">
            <div class="pr-2 mb-1">
                <el-select v-model="exhibition_id" placeholder="Select" class="container-input-bg-dark9 container-input-border-no w-100 rounded overflow-hidden" @change="handleOldExpoChange">
                    <el-option v-for="item in (gsv(['old_expos'], expo_content) || [])" :key="item.id" :label="gsv([$i18n.locale], item.name)" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <el-collapse v-model="activeCollapse" accordion @change="handleChangeCollase" :key="e_key">
                <el-collapse-item :title="$t('expo.about')" name="506" old_name="expo_overview">
                    <div class="pr-2 pb-2 rounded bg-white" v-if="reviews['506']" v-html="reviews['506']"></div>
                    <no-data v-else></no-data>
                </el-collapse-item>

                <el-collapse-item :title="$t('expo.visitor_comment')" name="507" old-name="seller_comment">
                    <div class="pr-2 pb-2 rounded bg-white" v-if="reviews['507']" v-html="reviews['507']"></div>
                    <no-data v-else></no-data>
                </el-collapse-item>

                <el-collapse-item :title="$t('expo.buyer_comment')" name="508"  old-name="buy_comment">
                    <div class="pr-2 pb-2 rounded bg-white" v-if="reviews['508']" v-html="reviews['508']"></div>
                    <no-data v-else></no-data>
                </el-collapse-item>

                <el-collapse-item :title="$t('expo.visitor_concurrent')" name="activity">
                    <div class="card-container-2col mt-1 pr-2" v-if="reviews.activity.length">
                        <div v-for="ii in Math.min(reviews.activity.length, 4)" :key="ii" class="bg-white rounded mb-2" @click="goActivity(reviews.activity[ii-1]['id'])">
                            <div class="">
                                <img :src="getImg1(reviews.activity[ii-1].covers) " alt=" " class="rounded w-100 border" style="height: 30vw">
                            </div>
                            <div class="px-2 pb-2">
                                <h4 class="text-line-1 font-11">{{reviews.activity[ii-1].title[$i18n.locale]}}</h4>
                                <p class="text-dark9 font-09">{{parseTime(reviews.activity[ii-1].created_at, '{y}-{m}-{d}') }}</p>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>

                <el-collapse-item :title="$t('expo.pic')" name="picture">
                    <div class="d-flex flex-wrap justify-content-between pr-2">
                        <!-- <img v-for="(item, ii) in reviews.picture" :key="item.id" :src="item.url" alt="" class="rounded mb-2 fit-cover" :class="ii%5==0 ? 'w-100' : 'review-img'"> -->
                        <el-image v-for="(item, ii) in reviews.picture" :key="item.id"
                            :src="item.url"
                            :class="ii%5==0 ? 'w-100 mb-2' : 'review-img mb-2'"
                            fit="cover" lazy></el-image>
                    </div>
                </el-collapse-item>
                <el-collapse-item :title="$t('expo.video')" name="video">
                    <div class="card-container-2col mt-1"  v-if="reviews.video.length">
                        <div v-for="vi in reviews.video" :key="vi.id">
                            <card-video-c :title="gsv(['name', $i18n.locale], vi.source)" subTitle="" :poster="vi.poster" @click="handleVideoPlay(vi)"></card-video-c>
                        </div>
                    </div>
                    <no-data v-else></no-data>
                </el-collapse-item>

                <el-collapse-item :title="$t('expo.v_layout')" name="509" old-name="map">
                    <div class="pr-2 pb-2 rounded bg-white" v-html="reviews['509']"></div>
                    <no-data v-if="!reviews['509']"></no-data>
                </el-collapse-item>

            </el-collapse>
        </div>
        <div v-else-if="activeTab==75" class="overflow-hidden">
            <card-r v-for="item in activity" :key="item.id" :poster="getImg1(item.covers)" :title="gsv([$i18n.locale], item.title)" :subTitle="parseTime(item.created_at)" @click.native="goActivity(item.id)"></card-r>
        </div>
        <template v-else>
            <div v-html="gsv([activeTab, lang_key], expo_content)" :key="key_content"  class="v-html"></div>
            <div v-if="url_external">
                <div class="p-4">
                    <div class="bg-blue-2 btn-sm border p-2 text-center text-white" @click="goExternal">
                        {{$t(btn_link)}}
                    </div>
                </div>
            </div>
        </template>
    </div>

    <client-only>
        <light-box ref="lightbox" :showLightBox='false' :media="media" :showThumbs='false' :disableScroll='false' :key="video_key"></light-box>
    </client-only>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getContent, getExpo } from '@/api/expo'
export default {
    layout: 'expo',
    name: "Expo_Visitor",
    data() {
        return {
            activeTab: "",
            key_content: "key_content",
            url_external: null,
            exhibition_id: '',
            activeCollapse: 'expo_overview',
            reviews: {
                expo_overview: null,
                seller_comment: null,
                buy_comment: null,
                activity: [],
                picture: [],
                video: [],
                map: null,
            },
            video_key: "ASDF",
            media: [{
                thumb: "",
                sources: [{
                    src: "",
                    type: ''
                }],
                type: 'video',
                width: '100%',
                height: 'auto',
                autoplay: true
            }],
            btn_link: "btn.apply",
            e_key : +new Date()
        }
    },
    computed: {
        ...mapState(['lang']),
        ...mapState('expo', ['expo_content', 'activity']),
        ...mapGetters('expo', ['menu_visitor']),
        lang_key: function () {
            return "pc_" + this.$i18n.locale
        },
        expo_id: function () {
            return this.expo_content['common']['id']
        }
    },
    methods: {
        ...mapActions('expo', ['getExpoContent', 'getExpoOld', 'getExpoType']),
        // Collapse
        handleChangeCollase(type_collapse) {
            // console.log(type_collapse)
            if (type_collapse) {
                if (this.exhibition_id) {
                    switch (type_collapse) {
                        case 'activity':
                            if (!this.reviews['activity'].length) {
                                this.$store.dispatch("common/setLoading")
                                getExpo(`activity/${this.exhibition_id}`).then(res => {
                                    if (res.items){
                                        this.reviews['activity'] = res.items
                                        this.e_key = +new Date()
                                    }
                                }).finally(() => {
                                    this.$store.dispatch("common/setLoading", false)
                                })
                            }
                            break;
                        case 'picture':
                        case 'video':
                            if (!this.reviews[type_collapse].length) {
                                this.$store.dispatch("common/setLoading")
                                getContent(`media/${this.exhibition_id}`, type_collapse).then(res => {
                                    if (res.items){
                                        this.reviews[type_collapse] = res.items
                                        this.e_key = +new Date()
                                    }
                                }).finally(() => {
                                    this.$store.dispatch("common/setLoading", false)
                                })
                            }
                            break;

                        default:
                            if (!this.reviews[type_collapse]) {
                                this.$store.dispatch("common/setLoading")
                                getContent(`id/${this.exhibition_id}`, type_collapse).then(res => {
                                    if (res.content)
                                        this.reviews[type_collapse] = res.content[this.lang_key]
                                        this.e_key = +new Date()
                                }).finally(() => {
                                    this.$store.dispatch("common/setLoading", false)
                                })
                            }
                            break;
                    }
                }
            }
        },
        // review
        handleOldExpoChange() {
            this.reviews = {
                    expo_overview: null,
                    seller_comment: null,
                    buy_comment: null,
                    activity: [],
                    picture: [],
                    video: [],
                    map: null,
                },
            this.handleChangeCollase(this.activeCollapse)
        },

        getContent(activeTab) {
            // console.log(activeTab)
            const cate_info = this.menu_visitor.find(rr => rr.category_id == activeTab)
            if (this.isExternal(cate_info.url_m)) {
                // console.log(cate_info.url_m)
                this.url_external = cate_info.url_m
                if (cate_info.id == 92)
                    this.btn_link = 'want.visit'
                else
                    this.btn_link = 'btn.apply'
            }
            const exponame = this.$route.params.exponame
            switch (activeTab) {
                case 'activity':
                    break;
                case 74:
                    if (!this.expo_content || !this.expo_content['old_expos']) {
                        this.getExpoOld(exponame).then(() => {
                            this.exhibition_id = this.gsv([0, 'id'], this.expo_content['old_expos'])
                            // this.handleChangeCollase(this.activeCollapse)
                        })
                    } else {
                        if (!this.exhibition_id) {
                            this.exhibition_id = this.gsv([0, 'id'], this.expo_content['old_expos'])
                            // this.handleChangeCollase(this.activeCollapse)
                        }
                    }
                    break;
                case 75:
                    this.getExpoType({ expoid: this.expo_id, type: 'activity' })
                    break;

                default:
                    if (!this.expo_content || !this.expo_content[activeTab]) {
                        this.getExpoContent({ exponame, expo_type: activeTab }).then(() => {
                            this.key_content = +new Date()
                        })
                    } else {
                        this.key_content = +new Date()
                    }
                    break;
            }

        },

        handleTabChange(activeTab) {
            this.url_external = null
            this.getContent(activeTab)
            if (this.$route.query.tab != activeTab) {
                this.$router.push({ name: this.$route.name, params: this.$route.params, query: { tab: activeTab } })
            }
        },
        goExternal() {
            const kkk = this.url_external.replace(/\{.*\}/g, this.expo_id)
            // console.log(this.url_external, kkk)
            window.open(kkk, '_blank')
        },
        goActivity(id) {
            window.open(`${process.env.M_URL}/events/${id}`, '_blank')
        },
        handleVideoPlay(item) {
            this.media[0]['sources'][0]["src"] = item['url']
            this.media[0]['sources'][0]["type"] = item['content_type']
            this.video_key = +new Date()
            setTimeout(() => {
                this.$refs.lightbox.showImage(0)
            }, 100)
        },

    },
    created() {
        this.activeTab = this.$route.query.tab ? parseInt(this.$route.query.tab) : ''
        if (this.menu_visitor.length) {
            this.activeTab = this.menu_visitor[0]['category_id']
            this.getContent(this.activeTab)
        }
    },
    watch: {
        menu_visitor(to) {
            if (to) {
                const cate_id = this.activeTab || to[0]['category_id']
                this.getContent(cate_id)
            }
        },        
    }
}
</script>
<style lang="scss" scoped>
.review-img {
    width: calc(50% - 0.25rem);
    height: 30vw
}
</style>