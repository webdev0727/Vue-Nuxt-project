<template>
<div>
    <kuc-page-header :title="$t('product.detail')">
        <div class="btn-container-m-s">
            <el-button round @click="handleShoucang" size="small" :type="my_collects.find(kk=>kk.source_id == info.id) ? 'primary' : 'default'" :disabled="is_mine">
                <svg-icon :name="my_collects.find(kk=>kk.source_id == info.id) ? 'star': 'star-o'" width="13" height="13"></svg-icon>
                {{$t('collect')}}
            </el-button>
        </div>
    </kuc-page-header>

    <div v-if="!info_404">

        <div v-if="info.id">
            <img :src="info.image" width="100%" alt="" style="display:inherit">
            <!-- carousel -->
            <div class="w-100">
                <el-carousel ref="carousel" height="65vmin" 
                :interval="5000" @change="handleChangeCarosel" 

                arrow="always" :autoplay="autoplay">
                    <template v-for="item in info.assets">
                        <el-carousel-item v-if="!isImage(item.content_type)" :key="item.id" @click.native="handleDetailView">
                            <video :poster="item.poster" class="w-100 h-100" controls ref="video" id="id_video" 
                            @play="autoplay = false"
                            @ended="autoplay = true"
                            >
                                <source :src="item.url" :type="item.content_type" />
                            </video>
                        </el-carousel-item>
                    </template>
                    <template v-for="item in info.assets">
                        <el-carousel-item v-if="isImage(item.content_type)" :key="item.id" @click.native="handleDetailView">
                            <div class="banner-container-div fit-cover" :style="`background-image:url(${item.url})`"></div>
                        </el-carousel-item>
                    </template>

                </el-carousel>
            </div>

            <div class="bg-white p-2 mb-2">
                <div class="d-flex justify-content-between align-items-center">
                    <h2 class="text-danger">￥{{price_real}}</h2>
                    <div class="btn-container-m-s">
                        <el-button round @click="handlePinDan" size="small" :disabled="is_mine">
                            <svg-icon name="user-add"></svg-icon> {{$t('want.pin')}}
                        </el-button>
                        <el-button round @click="handleInquire" size="small" type="primary" :disabled="is_mine">
                            <svg-icon name="message2"></svg-icon> {{$t('want.xunpan')}}
                        </el-button>
                    </div>
                </div>

                <h3 class="my-2" style="line-height:1.7rem">
                    <span class="text-white bg-danger px-2 py-1 font-08 rounded" v-if="info.is_pindan">{{$t('is.pin_yes')}}</span>
                    {{gsv([$i18n.locale], info.name)}}
                </h3>
                <div class="my-2 d-flex font-09">
                    <p class="border px-2 py-1 mr-2">{{gsv(['name', $i18n.locale], info.category)}}</p>
                    <p class="border px-2 py-1 mr-2">{{gsv([$i18n.locale], info.brand)}}</p>

                </div>
                <div class="d-flex">
                    <img :src="gsv(['company', 'logo', 'url'], info)" alt="" style="width: 5rem; height:5rem" class="mr-2">
                    <div class="d-flex align-items-center justify-content-between flex-1">
                        <div class="">
                            <!-- <p>{{gsv([$i18n.locale], info.description)}}</p> -->
                            <div class="d-flex">
                                <p class="label text-dark9">{{$t('sn')}}:</p>
                                <p>{{info.serial}}</p>
                            </div>
                            <div class="d-flex">
                                <p class="label text-dark9">{{$t('product.locatin')}}:</p>
                                <p>{{gsv(['country', 'name'], info.company)}} {{gsv(['region', 'name'], info.company)}}</p>
                            </div>
                            <div class="d-flex">
                                <p class="label text-dark9">{{$t('company')}}：</p>
                                <p>{{gsv(['name', $i18n.locale], info.company)}}</p>
                            </div>
                            <div class="d-flex">
                                <p class="label text-dark9">{{$t('moq')}}:</p>
                                <p>{{info.min_quantity}} {{gsv(['name', $i18n.locale], info.unit)}}</p>
                            </div>
                        </div>
                        <nuxt-link :to="'/company/'+info.company_id">
                            <p class="border px-2 py-1 ml-2 text-nowrap">{{$t('company.view')}}</p>
                        </nuxt-link>

                    </div>
                </div>
            </div>

            <div class="bg-white mb-2">
                <div class="p-2">
                    <ku-title-left>{{$t('info.basic')}}</ku-title-left>
                </div>
                <div class="text-dark6">
                    <div class="d-flex flex-wrap main-info">
                        <!-- <p>{{$t('sn')}}：{{info.serial}}</p> -->
                        <p>{{$t('brand')}}：{{gsv([$i18n.locale], info.brand)}}</p>
                        <p>{{$t('price')}}：{{price_real}}</p>
                        <p>{{$t('cate.product')}}：{{gsv(['name', $i18n.locale], info.category)}}</p>
                        <p>{{$t('cate.custom')}}: {{gsv(['name', $i18n.locale], info.custom_category)}}</p>
                        <p>{{$t('product')}}{{$t('unit')}}：{{gsv(['name', $i18n.locale], info.unit)}}</p>
                        <p>{{$t('moq_min')}}： {{info.min_quantity}}{{gsv(['name', $i18n.locale], info.unit)}}</p>
                        <p>{{$t('is.pin1')}}： {{info.is_pindan ? $t('yes') : $t('is.can_no')}} </p>
                        <p>{{$t('pin_count')}}： {{info.max_pindan}} </p>
                    </div>
                    <p class="px-2 pb-2">{{$t('is.is_only_buyer')}}：{{info.is_only_buyer ? $t('yes') : $t('is.can_no')}} </p>
                    <!-- <p class="p-2">{{$t('description')}}: {{gsv([$i18n.locale],info.description)}}</p> -->
                </div>
            </div>
        </div>

        <div class="bg-white mb-2" v-if="info.id">

            <div class="px-2">
                <ku-tab-line :list='tab_items' :activeTab.sync="activeTab" :activeTabBarWidth=30></ku-tab-line>
            </div>
            <!-- tab1 -->
            <div class="mb-2 p-2" v-if="activeTab=='info' && info">
                <!-- <img v-for="(item, kk) in info.assets" :key="kk+item.id" :src="item.url" alt=" " class="mb-2 w-100"> -->
                <div v-html="gsv([$i18n.locale], info.description)"></div>
                <div class="mt-2" v-if="userLevel > 3">
                    <p class="text-dark9">{{$t('address')}}: {{gsv(['region', 'name'], info.company)}} {{gsv(['address', $i18n.locale], info.company)}}</p>
                    <p class="text-dark9">{{$t('phone.contact')}}: {{gsv(['phone'], info.company)}}</p>
                    <p class="text-dark9">{{$t('company.www')}}: {{gsv(['website'], info.company)}}</p>
                </div>
            </div>

            <!-- tab2 === new comment & history-->
            <div class="bg-white my-2 pb-2">
                <el-form ref="dataForm" :rules="rules" :model="new_comment" label-position="left" label-width="0" class="bg-white p-2">
                    <h3 class="mb-2">{{$t('msg.q_a')}} <span class="text-danger font-09">{{info.comments_count}}{{$t('comment')}}</span> </h3>
                    <!-- content -->
                    <el-form-item prop="content" class="ku-no-after mt-2">
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 9}" maxlength="500" show-word-limit v-model="new_comment.content" :placeholder="$t('form.say')"></el-input>
                    </el-form-item>

                    <div class="d-flex justify-content-between align-items-center my-2">
                        <el-checkbox v-model="new_comment.is_only" label="">{{$t('only_supplier')}}</el-checkbox>
                        <el-button type="primary" @click="handleNewComment" round size="medium" :disabled="is_mine || !userLevel">{{$t('comment.post')}}</el-button>
                    </div>
                </el-form>
                <div class="comment-container pl-2">
                    <ku-line />
                    <div v-for="item in comments" :key="item.id" class="d-flex border-bottom py-1 mb-2">
                        <!-- <img :src="gsv(['avatar', 'url'], item.user) || '/files/avatar.png'" alt=" " class="rounded-circle mr-2" style="object-fit:cover"> -->
                        <el-avatar :size="50" :src="gsv(['avatar', 'url'], item.user)" class="mr-2">
                            <img src="/files/avatar.png" />
                        </el-avatar>
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
                            <p class="text-dark text-line-2">{{item.content}}</p>
                            <div class="bg-darkF7 mb-1 p-2" v-for="aaa in item.answers" :key="'answar'+aaa.id">
                                {{aaa.answer}}
                            </div>
                        </div>
                    </div>
                    <infinite-loading spinner="spiral" :identifier='infiniteId' @infinite="handleInfinite" class="m-3"> </infinite-loading>
                </div>
                <!-- <p class="text-center mb-2">
            <el-button type="text" class="p-2 text-dark9" @click="handleMoreComments">{{$t('more')}}</el-button>
        </p> -->
            </div>

        </div>
    </div>

    <no-data v-else />

    <client-only>
        <light-box ref="lightbox" :showLightBox='false' :media="media" :showThumbs='false' :disableScroll='false' :key="video_key"></light-box>
    </client-only>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getDetail, addComment } from '@/api/product'
import { getComments, toggleLike } from '@/api/comment'

export default {
    // middleware: 'authenticated',
    name: "ProductDetail",
    components: {},
    data() {
        return {
            info: {
                assets: []
            },
            info_404: false,
            activeTab: 'info',
            new_comment: {
                product_id: this.getId(this.$route.params.id),
                content: "",
                is_only: 0,
            },
            rules: {
                content: [{ required: true, message: this.$t('valid.required', [this.$t('content.i')]), trigger: ['blur', 'change'] },
                    { min: 5, message: this.$t('valid.min.string', [this.$t('content.i'), 5]), trigger: ['blur', 'change'] },
                ]
            },
            isLoading: true,
            video_key: 'video_key',
            infiniteId: +new Date(),
            listQuery: {
                page: 1,
                limit: 5
            },
            comments: [],
            total: 0,            
            autoplay: true
        }
    },
    head() {
        return {
            title: this.gsv([this.$i18n.locale], this.info.name),
            meta: [{
                hid: 'description',
                name: 'description',
                content: this.$options.filters.strippedContent(this.gsv([this.$i18n.locale], this.info.description) || '')
            }]
        }
    },
    async asyncData({ params }) {
        let info = {
            "assets": []
        }
        let info_404 = false

        const dd = params.id.split('.')
        const product_id = dd[0]
        // console.log(product_id, "product_id")
        if (/^\d+$/.test(product_id)) {
            const res = await getDetail(product_id)
            if (res) {
                info = res.product
            } else {
                // redirect('/product')
                info_404 = true
            }
        } else {
            console.log("product_id NO")
            info_404 = true
        }

        return {
            info,
            info_404
        }
    },
    computed: {
        ...mapGetters(['userLevel']),
        ...mapGetters('opposite', ['my_suppliers']),
        ...mapState('product', ['my_collects']),
        tab_items: function () {
            return [
                { id: 'info', name: this.$t('product.detail') },
                { id: 'qa', name: this.$t('msg.q_a_n', [this.info.comments_count]) }
            ]
        },
        media: function () {
            var mmm = []
            for (let index = 0; index < this.info.assets.length; index++) {
                const item = this.info.assets[index];
                if (this.isImage(item.content_type)) {
                    mmm.push({
                        src: item.url
                    })
                } else {
                    mmm.unshift({
                        sources: [{
                            src: item.url,
                            type: item.content_type
                        }],
                        type: 'video',
                        width: '100%',
                        height: 'auto',
                        autoplay: false
                    })
                }

            }
            return mmm.length ? mmm : [{}]
        },
        is_mine: function () {
            let is_m = false
            if (this.userLevel) {
                is_m = this.info.user_id == this.$store.state.auth.id
            }
            return is_m
        },
        price_real: function () {
            let ppp = 'xxx'
            if (this.userLevel) {
                if (this.info.is_only_buyer) {
                    if (this.my_suppliers.includes(this.info.user_id)) {
                        ppp = this.info.price
                    }
                } else {
                    ppp = this.info.price
                }
                if (this.info.user_id == this.$store.state.auth.id) ppp = this.info.price
            }
            return ppp
        }
    },
    methods: {
        ...mapActions('opposite', ['getMySuppliers']),
        ...mapActions('product', ['getMyProductCollects', 'delMyProductCollect', 'addMyProductCollect']),
        getList() {
            if (this.info_404) {
                setTimeout(() => {
                    this.goBack()
                }, 1000);
                return false
            }
            this.isLoading = true
            getDetail(this.new_comment.product_id).then(res => {
                let product = Object.assign({}, res.product)
                delete product.comments
                this.info = product
            }).catch(err => {
                this.info_404 = true
            }).finally(() => {
                this.isLoading = false

            })
        },
        handleInfinite($state) {
            getComments('product', this.new_comment.product_id, this.listQuery).then(res => {
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
                toggleLike(3, item.id).then(res => {
                    const iii = this.comments.findIndex(rr => rr.id == item.id)
                    if (iii >= 0) {
                        this.comments[iii]['likes'] = res.likes
                        this.comments[iii]['my_like'] = res.my_like
                    }
                })
            }
        },
        handlePinDan() {
            this.$router.push({ path: "/pindan/create/" + this.new_comment.product_id })
        },
        handleShoucang() {
            if (this.userLevel) {
                const collect_ = this.my_collects.find(kk => kk.source_id == this.info.id)
                if (collect_){                    
                    this.delMyProductCollect(collect_.id)
                } else {
                    this.addMyProductCollect(this.info.id)
                }
            } else {
                this.$router.push({ path: `/login?redirect=${this.$route.path}` })
            }
        },
        handleInquire() {
            this.$router.push({ path: "/inquiry/" + this.new_comment.product_id })
        },
        handleNewComment() {
            if (this.userLevel)
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.$store.dispatch('common/setLoading')
                        addComment(this.new_comment).then(res => {
                            this.$notify({
                                title: this.$t('success'),
                                message: this.$t('success.msg'),
                                type: 'success'
                            });

                            this.comments = []
                            this.total = 0
                            this.listQuery.page = 1
                            this.infiniteId = +new Date()

                            this.new_comment.content = ""
                            this.$refs['dataForm'].resetFields();

                        }).finally(() => {
                            this.$store.dispatch('common/setLoading', false)
                        })
                    }
                });
            else {
                this.$router.push({ path: `/login?redirect=${this.$route.path}` })
            }
        },
        handleChangeCarosel() {
            if (document.getElementById('id_video')) {
                document.getElementById('id_video').pause()
                this.autoplay = true
            }
        },
        handleDetailView() {
            // console.log("dlksjdf")
            this.$refs.lightbox.showImage(0)
        },        
    },
    mounted() {
        this.getList()
        if (this.userLevel) {
            if (!this.my_suppliers.length) this.getMySuppliers()
            if (!this.my_collects.length) this.getMyProductCollects()
        }
    },
}
</script>

<style lang="scss" scoped>
.main-info {
    p {
        width: 50%;
        padding-left: 0.5rem;
        padding-right: .5rem;
    }
}

.label {
    min-width: 3.5rem;
}
</style>
