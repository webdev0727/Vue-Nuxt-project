<template>
<div class="container pb-3" id='top'>
    <!-- Top part -->
    <div class="kuc-page-header bg-white">
        <kuc-page-header :title="$t('enterprise')" to="/company">
            <p class="p-1 container-input-bg-dark9 header-search-bar">
                <el-input :placeholder="$t('search')" size="medium" v-model="listQuery.filter_text" class="search-rounded" @keyup.enter.native="handleFilter">
                    <i slot="prefix" class="el-input__icon el-icon-search" @click="handleFilter"></i>
                </el-input>
            </p>
        </kuc-page-header>
    </div>
    <template v-if="!info_404">
        <div class="bg-white">

            <div v-if="company.id">
                <!-- <template v-if="vrUrl">
                <client-only>
                    <v-pannellum class="h-100" :src="vrUrl" preview="/images/ant404.png" showFullscreen :hfov="100"></v-pannellum>
                </client-only>
            </template> -->
                <!-- <img v-else :src="getImg1(company.banner) " width="100%" :alt="$t('enterprise')" class="h-100 fit-cover"> -->
                <!-- carousel -->
                <div class="conatiner-carousel mh-400" style="height: 40vw; background-color: black;" v-if="hasBanner">
                    <el-carousel height="40vw">
                        <el-carousel-item v-for="item in company.banner" :key="item.id">
                            <div class="banner-container-div" :style="`background-image:url(${item.url})`"></div>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>

            <div class="px-2 d-flex justify-content-between pb-2" v-if="company.id" :class="{'mt-n4': hasBanner}">
                <img :src="gsv(['url'], company.logo)  || '/files/avatar.png'" alt="" style="width:5rem; height:5rem; object-fit:cover; z-index:2; " class="rounded">
                <div class="pl-1 flex-1 mb-n1" :class="{'mt-4': hasBanner}">
                    <div class="d-flex align-items-center mb-1">
                        <h2 class="pr-2">{{gsv([$i18n.locale], company.name) }}
                            <svg-icon name="diamond" width="14" color="red" />
                        </h2>

                    </div>
                    <div class="d-flex justify-content-between text-dark9 font-09" :class="{'mt-2': !hasBanner}">
                        <!-- <p>{{$t('status.expo_done')}}</p> -->
                        <p class="flex-1 text-line-2">{{$t('expo.no_')}}：{{expoPositions}}</p>
                        <p @click="goSvgMap">
                            <!-- <svg-icon name="search"></svg-icon> -->
                            <i class="el-icon-search"></i>
                            {{$t('view.layout')}}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!--  Contents  -->
        <div class="pb-5" v-if="company.id">
            <div class="px-2 border-bottom bg-white mb-2">
                <ku-tab-line :list='tab_items' :activeTab.sync="activeTab" :activeTabBarWidth=30 @change="handleTabChange"></ku-tab-line>
            </div>
            <!-- Tab contents -->
            <!-- <ku-loading-no-data :active="is_loading" :total="company.id" /> -->
            <div class="px-2" v-if="company.id">
                <!-- <nuxt-child></nuxt-child> -->
                <div v-if="activeTab=='home'">
                    <!-- recommend_products -->
                    <div class="mt-2">
                        <div class="d-flex justify-content-between">
                            <h2>{{$t('recom.product')}}</h2>
                            <p class="text-dark9" @click="goTab('product')">{{$t('more')}} <i class="el-icon-arrow-right"></i> </p>
                        </div>
                        <div class="bg-white p-2 rounded my-2">

                            <ku-loading-no-data :active="is_loading" :total="recommend_products.length" />

                            <div class="card-container-2col ">
                                <div v-for="li in recommend_products" :key="li.id">
                                    <card-video-c :title="gsv([$i18n.locale], li.name)" :poster="getImg1(li.assets)" :showPlayIcon="false" @click="goProductDetail(li)">
                                        <div slot="subTitle">
                                            <p class="text-danger">￥{{price_real(li)}}</p>
                                            <p class="text-line-1 text-dark9">{{$t('moq_min')}} {{li.min_quantity}} {{gsv(['name', $i18n.locale], li.unit)}}</p>
                                        </div>
                                    </card-video-c>
                                </div>
                            </div>

                        </div>
                    </div>
                    <!-- latest product -->
                    <div class="mt-2">
                        <div class="d-flex justify-content-between">
                            <h2>{{$t('product.latest')}}</h2>
                            <p class="text-dark9" @click="goTab('product')">{{$t('more')}} <i class="el-icon-arrow-right"></i> </p>
                        </div>
                        <div class="bg-white p-2 rounded my-2">

                            <ku-loading-no-data :active="is_loading" :total="latest_products.length" />

                            <div class="card-container-2col">
                                <div v-for="li in latest_products" :key="li.id">
                                    <card-video-c :title="gsv([$i18n.locale], li.name)" :poster="getImg1(li.assets)" :showPlayIcon="false" @click="goProductDetail(li)">
                                        <div slot="subTitle">
                                            <p class="text-danger">￥{{price_real(li)}}</p>
                                            <p class="text-line-1 text-dark9">{{$t('moq_min')}} {{li.min_quantity}} {{gsv(['name', $i18n.locale], li.unit)}}</p>
                                        </div>
                                    </card-video-c>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- 公司简介 company description -->
                    <div class="mt-2">
                        <h2>{{$t('company.profile')}}</h2>
                        <div class="bg-white rounded p-2 my-2">
                            <img :src="gsv(['url'], company.cover)" alt="" width="100%">
                            <div class="my-1" v-html="description_"></div>
                            <div class="font-09 mt-2  text-dark9">
                                <div class="d-flex my-2">
                                    <p class="text-nowrap mr-1">{{$t('main.product')}}: </p>
                                    <p class="text-line-2"> {{getNames(company.categories) }}</p>
                                </div>

                                <div class="d-flex my-2">
                                    <p class="text-nowrap mr-1">{{$t('business.mode')}}: </p>
                                    <p> {{gsv(['name', $i18n.locale],company.mgmodel)}}</p>
                                </div>

                                <div class="d-flex my-2">
                                    <p class="text-nowrap mr-1">{{$t('main.market')}}: </p>
                                    <p> {{getNames(company.market)}}</p>
                                </div>

                                <div class="d-flex my-2">
                                    <p class="text-nowrap mr-1">{{$t('company')}}{{$t('address')}}: </p>
                                    <p> {{gsv([$i18n.locale], company.address)}}</p>
                                </div>
                            </div>
                            <el-divider class="mb-2"></el-divider>
                            <p class="text-center">
                                <span class="px-2 text-dark" @click="goTab('intro')">{{$t('more')}}</span>
                            </p>
                        </div>
                    </div>

                    <!-- 历届参展 -->
                    <div class="my-2">
                        <div class="d-flex justify-content-between">
                            <h2>{{$t('expo.pre')}}</h2>
                            <p class="text-dark9" @click="goTab('history')">{{$t('more')}} <i class="el-icon-arrow-right"></i> </p>
                        </div>
                        <div class="scroll-container">
                            <div class="mt-1 scroll-x-img-container">
                                <div class="scroll-x-img " v-for="(item, ind) in expo_history" :key='item.id' :style="`background-image:url(${isImage(item.content_type) ? item.url : item.poster})`" @click="handleMedia(expo_history, ind)">
                                    <div>
                                        <div class="py-2">
                                            <p class="text-white text-line-1 text-center">{{gsv([$i18n.locale], item.description)}}</p>
                                        </div>
                                    </div>
                                    <!-- v-if="showPlayIcon" -->
                                    <div v-if="!isImage(item.content_type)" class="d-flex align-items-center justify-content-center w-100 h-100">
                                        <img src="/icons/player_icon.png" alt="" class="play-icon">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <no-data v-if="!expo_history.length" class="bg-white" />
                    </div>
                    <!-- 公司视频 -->
                    <div class="my-2">
                        <div class="d-flex justify-content-between">
                            <h2>{{$t('company.video')}}</h2>
                            <p class="text-dark9" @click="goTab('video')">{{$t('more')}} <i class="el-icon-arrow-right"></i> </p>
                        </div>
                        <div class="card-container-2col mt-1">
                            <div v-for="ii in Math.min(company_videos.length, 4)" :key="ii">
                                <card-video-c :title="company_videos[ii-1].description[$i18n.locale]" :subTitle="parseTime(company_videos[ii-1].created_at)" :poster="company_videos[ii-1]['poster']" @click="handleVideoPlay(company_videos[ii-1])"> </card-video-c>
                            </div>
                        </div>
                        <no-data v-if="!company_videos.length" class="bg-white" />
                    </div>
                </div>

                <div v-if="activeTab=='product'">
                    <div class="mb-2 bg-white p-2 rounded">
                        <div class="card-container-2col">
                            <div v-for="item in products" :key='item.id'>
                                <card-price :productDa="item" :price="price_real(item)"></card-price>
                            </div>
                            <template v-if="!products.length">
                                <div v-for="item in latest_products" :key='item.id'>
                                    <card-price :productDa="item" :price="price_real(item)"></card-price>
                                </div>
                            </template>
                        </div>
                        <ku-loading-no-data :active="is_loading" :total="total" push />
                    </div>
                    <div class="text-center pagination-kuc mb-3">
                        <el-pagination background layout="prev, pager, next" :total="total" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size="listQuery.limit" :current-page.sync="listQuery.page" @current-change="getList" hide-on-single-page></el-pagination>
                    </div>
                </div>

                <div v-if="activeTab=='intro'">
                    <!-- 公司介绍 -->
                    <div class="bg-white rounded p-2 mb-2">
                        <ku-title-left>{{$t('company.intro')}}</ku-title-left>
                        <div class="text-dark9 my-1" v-html="description_"></div>
                        <img :src="gsv(['url'], company.cover)" alt="" width="100%">
                    </div>
                    <!-- 工商信息 -->
                    <div class="bg-white rounded p-2 mb-2">
                        <ku-title-left>{{$t('business.info')}}</ku-title-left>
                        <p v-if="company_info.CheckDate && $i18n.locale=='zh'" class="text-dark9 font-08 text-center">(该信息于{{ parseTime(company_info.CheckDate, '{y}年{m}月{d}日')}}通过中诚信专业认证)</p>
                        <p v-if="company_info.CheckDate && $i18n.locale=='en'" class="text-dark9 font-08 text-center">(This information passed the professional certification of China Chengxin on {{ parseTime(company_info.CheckDate, '{y}-{m}-{d}')}})</p>
                        <div class="">
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('company.name')}}: </p>
                                <p>{{company_info.Name}}</p>
                            </div>
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t("legal_representative")}}: </p>
                                <p>{{company_info.OperName}}</p>
                            </div>
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('registered_cap')}}: </p>
                                <p> {{company_info.RegistCapi}}</p>
                            </div>
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('date.establish')}}: </p>
                                <p v-if="company_info.StartDate">{{ parseTime(company_info.StartDate, '{y}-{m}-{d}')}}</p>
                            </div>
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('u_s_code')}}: </p>
                                <p> {{company_info.CreditCode}}</p>
                            </div>
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('registered_addr')}}: </p>
                                <p> {{company_info.Address}}</p>
                            </div>
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('company.kind')}}: </p>
                                <p> {{company_info.EconKind}}</p>
                            </div>
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('registered_authority')}}: </p>
                                <p> {{company_info.BelongOrg}}</p>
                            </div>
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('duration.op')}}: </p>
                                <p v-if="company_info.StartDate">{{$t('duration.from_to', [parseTime(company_info.StartDate, '{y}-{m}-{d}'), !company_info.EndDate ? $t("long_term") : parseTime(company_info.EndDate, '{y}-{m}-{d}')])}}</p>
                            </div>
                            <!-- <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('time.annual')}}: </p>
                                <p class="text-danger"> 2019</p>
                            </div> -->
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('business.scope')}}: </p>
                                <p>{{company_info.Scope}}</p>
                            </div>

                        </div>
                    </div>
                    <!-- 生产情况 -->
                    <div class="bg-white rounded p-2 mb-2">
                        <ku-title-left>{{$t('product.cap')}}</ku-title-left>
                        <div class="">
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('company.prop')}}: </p>
                                <p> {{gsv(['name', $i18n.locale], company.mgmodel)}}</p>
                            </div>
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('main.product')}}: </p>
                                <p> {{getNames(company.categories) }}</p>
                            </div>
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('brand.main')}}: </p>
                                <p>{{gsv([$i18n.locale], company.major_brand)}}</p>
                            </div>
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('is_oem')}}: </p>
                                <p> {{company.avail_oem==1 ? 'ODM' : 'OEM'}}</p>
                            </div>
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('main.market')}}: </p>
                                <p> {{getNames(company.market)}}</p>
                            </div>
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('count.worker')}}: </p>
                                <p> {{company.staff_count}}人</p>
                            </div>
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('factory.area1')}}: </p>
                                <p> {{getWan(company.factory_area, 1)}}{{$t('m2')}}</p>
                            </div>
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('factory.addr')}}: </p>
                                <p> {{gsv([$i18n.locale], company.factory_addr)}}</p>
                            </div>
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('year.sale')}}: </p>
                                <p> {{getWan(company.annual_sale)}}万元</p>
                            </div>
                        </div>
                    </div>

                    <!-- 办公环境 Tab -->
                    <div class="bg-white rounded p-2 mb-2">
                        <ku-tab-line :list='p_tab_items' :activeTab.sync="p_activeTab" :activeTabBarWidth=30 @change="handlePTabChange"></ku-tab-line>
                        <div v-if="p_activeTab=='image1'">
                            <ku-loading-no-data :active="is_loading_in" :total="product_env_images.image1.length" />
                            <div class="card-container-2col my-2 bg-white rounded">
                                <div v-for="item in product_env_images.image1" :key="item.id" :style="`background-image:url(${item.url})`" class="mb-2 bg-img-gallery" @click="handleImagePlay(item)">
                                </div>
                            </div>
                        </div>

                        <div v-if="p_activeTab=='image2'">
                            <ku-loading-no-data :active="is_loading_in" :total="product_env_images.image2.length" />
                            <div class="card-container-2col my-2 bg-white rounded">
                                <div v-for="item in product_env_images.image2" :key="item.id" :style="`background-image:url(${item.url})`" class="mb-2 bg-img-gallery" @click="handleImagePlay(item)">
                                </div>
                            </div>
                        </div>

                        <div v-if="p_activeTab=='image3'">
                            <ku-loading-no-data :active="is_loading_in" :total="product_env_images.image3.length" />
                            <div class="card-container-2col my-2 bg-white rounded">
                                <div v-for="item in product_env_images.image3" :key="item.id" :style="`background-image:url(${item.url})`" class="mb-2 bg-img-gallery" @click="handleImagePlay(item)">
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 公司地图 -->
                    <div class="bg-white rounded p-2 mb-2">
                        <ku-title-left>{{$t('company.map')}}</ku-title-left>
                        <client-only>
                            <baidu-map :center="position" :zoom="zoom" style="height:40vw; max-height: 300px" @click="getClickInfo" :scroll-wheel-zoom='true'>
                                <bm-marker :position="position" animation="BMAP_ANIMATION_BOUNCE">
                                </bm-marker>
                            </baidu-map>
                        </client-only>
                    </div>
                </div>
                <div v-if="activeTab=='history'">
                    <div class="bg-white rounded mb-2">
                        <div class="ml-2 pr-2 border-bottom" v-if="expo_tab_items.length">
                            <ku-tab-line :list='expo_tab_items' :activeTab.sync="expo_activeTab" :activeTabBarWidth=50 @change="handleExpoTabChange"></ku-tab-line>
                        </div>

                        <div class="mt-2 p-2">
                            <div class="card-container-2col">
                                <div v-for="(item, kk) in pre_expo" :key="kk + item.id" class="video-img">
                                    <card-video-c :title="gsv([$i18n.locale], item.description)" :poster="isImage(item.content_type) ? item.url : item.poster" :showPlayIcon="!isImage(item.content_type)" @click.native="handleMedia(pre_expo, kk)">
                                    </card-video-c>
                                </div>
                            </div>
                            <ku-loading-no-data :active="false" :total="pre_expo.length" />
                            <!-- <div v-if="expo_activeTab==expo_tab_items[0]['id']">

                        </div>
                        <div v-if="expo_activeTab==expo_tab_items[1]['id']">
                            <div class="card-container-2col">
                                <div v-for="(item, kk) in expo_history" :key="kk + item.url" class="video-img">
                                    <card-video-c :title="item.title" :poster="item.poster" @click="handleVideoPlay(item)"> </card-video-c>
                                </div>
                            </div>
                        </div>
                        <div v-if="expo_activeTab==expo_tab_items[2]['id']">
                            <div class="card-container-2col">
                                <div v-for="(item, kk) in expo_history" :key="kk + item.url" class="video-img">
                                    <card-video-c :title="item.title" :poster="item.poster" @click="handleVideoPlay(item)"> </card-video-c>
                                </div>
                            </div>
                        </div> -->
                        </div>

                    </div>
                </div>
                <div v-if="activeTab=='video'">
                    <div class="p-2 bg-white rounded">
                        <ku-title-left>{{$t('video.center')}}</ku-title-left>
                        <div class="mt-1">
                            <no-data v-if="!company_videos.length" />
                            <div class="card-container-2col ">
                                <div v-for="item in company_videos" :key="item.id">
                                    <card-video-c :title="item.description[$i18n.locale]" :poster="item.poster" @click="handleVideoPlay(item)"> </card-video-c>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div v-if="activeTab=='contactus'">
                    <!-- 联系我们 -->
                    <div class="bg-white rounded p-2 mb-2">
                        <ku-title-left>{{$t('contact_us')}}</ku-title-left>

                        <client-only>
                            <baidu-map :center="position" :zoom="zoom" style="height:50vw; max-height: 400px" @click="getClickInfo" :scroll-wheel-zoom='true'>
                                <bm-marker :position="position" animation="BMAP_ANIMATION_BOUNCE">
                                </bm-marker>
                            </baidu-map>
                        </client-only>
                        <div class="d-flex align-items-center my-2">
                            <div class="d-flex flex-1">
                                <img :src="gsv(['avatar', 'url'], company.user) || '/files/avatar.png'" class="avatar rounded-circle mr-1" alt=" ">
                                <div class="d-flex flex-column justify-content-between">
                                    <h3 v-if="$i18n.locale=='zh'">{{gsv(['name', $i18n.locale], company.user)}} <span class="text-dark9 font-09">{{gender_txt}} {{gsv(['position', $i18n.locale], company.user)}}</span> </h3>
                                    <h3 v-else><span class="text-dark9 font-09">{{gender_txt}} </span>{{gsv(['name', $i18n.locale], company.user)}} </h3>
                                    <a v-if="userLevel>3" :href="'tel:'+ '+' + gsv(['phone_prefix'], company.user) + gsv(['phone'], company.user)" class="mb-1">(+{{(gsv(['phone_prefix'], company.user) || '')}}) {{gsv(['phone'], company.user)}}</a>
                                </div>
                            </div>
                            <div>
                                <el-button type="danger" @click="handleContact" round="" :disabled="userLevel<4">{{$t('msg.send_ta')}}</el-button>
                            </div>

                        </div>
                        <h3 class="mt-3 mb-2">{{gsv([$i18n.locale], company.name) }}</h3>
                        <div class="info-container">
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('country')+$t('region')}}: </p>
                                <p> {{gsv(["name"], company.country) }} {{gsv(["name"], company.region) }}</p>
                            </div>
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('company')}}{{$t('address')}}: </p>
                                <p> {{gsv([$i18n.locale], company.address) }}</p>
                            </div>
                            <div class="d-flex my-2">
                                <p class="text-nowrap mr-1 text-dark9">{{$t('postal_code')}}: </p>
                                <p> {{company.postal}}</p>
                            </div>

                            <template v-if="userLevel>3">

                                <div class="d-flex my-2">
                                    <p class="text-nowrap mr-1 text-dark9">{{$t('e_mail')}}: </p>
                                    <a :href="'mailto:'+ gsv(['email'], company.user)"> {{gsv(['email'], company.user)}}</a>
                                </div>
                                <div class="d-flex my-2">
                                    <p class="text-nowrap mr-1 text-dark9">{{$t('contact')}}{{$t('phone')}}: </p>
                                    <a :href="'tel:'+ company.phone"> {{company.phone}}</a>
                                </div>
                                <div class="d-flex my-2">
                                    <p class="text-nowrap mr-1 text-dark9">{{$t('fax')}}: </p>
                                    <p> {{company.fax}}</p>
                                </div>
                                <div class="d-flex my-2">
                                    <p class="text-nowrap mr-1 text-dark9">{{$t('company.www')}}: </p>
                                    <div>
                                        <p>
                                            <a :href="company.website" target='_blank'> {{company.website}}</a>
                                        </p>
                                        <p class="mt-2">
                                            <a :href="`http://${company.second_domain}.web.antway.cn`" target='_blank'>
                                                http://{{company.second_domain}}.web.antway.cn
                                            </a>
                                        </p>
                                    </div>
                                </div>

                            </template>
                        </div>

                        <!-- <ku-d-show v-else /> -->
                    </div>
                    <div class="my-2 p-2 text-center" v-if="userLevel<4">
                        <el-button type="primary" round size="default" @click="hCheckMoreContact" class="w-75">查看企业联系方式</el-button>
                        <p class="mt-4 text-dark9">仅限境内外注册采购商、采购代表查看</p>
                    </div>
                </div>

            </div>

        </div>
    </template>
    <no-data v-else />
    <client-only>
        <light-box ref="lightbox" :showLightBox='false' :media="media" :showThumbs='false' :disableScroll='false' :key="media_key"></light-box>
    </client-only>

    <!-- <FooterCompany @clickInquiry="goInquiry"/> -->
    <footer class="bg-white d-flex justify-content-between px-1">

        <div to='/' class="f-item" :class="{active: company.is_for_visit}" @click="handleVisitToggle">
            <svg-icon name='eye-open' width='25' height="20" :color="company.is_for_visit ? 'red' :  'gray'"></svg-icon>
            <p>{{$t('want.visit')}}</p>
        </div>

        <div to='/' class="f-item" :class="{active: !!my_collects.find(kk=>kk.source_id == company.id)}" @click="handleShoucangToggle">
            <svg-icon name='star-o' width='19' height="20" :color="my_collects.find(kk=>kk.source_id == company.id) ? 'red' :  'gray'"></svg-icon>
            <p>{{$t('collect')}}</p>
        </div>
        <div to='/' class="f-item" @click="goInquiry">
            <svg-icon name='message2' width='17' height="20" color="gray"></svg-icon>
            <p>{{$t('want.xunpan')}} </p>
        </div>
        <div to='/' class="f-item" @click="handleContact">
            <svg-icon name='message1' width='17' height="20" color="gray"></svg-icon>
            <p>{{$t('msg.s')}}</p>
        </div>
    </footer>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import CardPrice from '~/components/Card/CardPrice.vue'

import { getDetail, getHistory, toggleVisit } from '@/api/company'
import { fileList } from '@/api/file'
import { getCompanyProductList } from '@/api/product'
// import { toggleCollect } from "~/api/common"

export default {
    // middleware: 'authenticated',
    name: 'CompanyDetails',
    components: {
        CardPrice,
    },
    data() {
        return {
            id: this.getId(this.$route.params.id),
            info_404: false,
            is_loading: false,
            is_loading_in: false,
            tab_items: [
                { id: 'home', name: this.$t('homepage') },
                { id: 'product', name: this.$t('product.disp') },
                { id: 'intro', name: this.$t('company.intro') },
                { id: 'history', name: this.$t('expo.pre') },
                { id: 'video', name: this.$t('video.center') },
                { id: 'contactus', name: this.$t('contact_us') },
            ],
            activeTab: 'home',

            // product display
            products: [],
            total: 0,
            listQuery: {
                company_id: this.getId(this.$route.params.id),
                limit: 10,
                page: 1,
                filter_text: ''
            },
            // factory env
            p_tab_items: [
                { id: "image1", name: this.$t('company.img_office') },
                { id: "image2", name: this.$t('company.img_factory') },
                { id: "image3", name: this.$t('company.img_certification') },
            ],
            p_activeTab: 'image1',
            product_env_images: {
                'image1': [],
                'image2': [],
                'image3': [],
            },
            // pre expo
            expo_tab_items: [],
            expo_activeTab: '',
            expo_histories: [],
            pre_expo: [],

            center: { lng: 109.45744048529967, lat: 36.49771311230842 },
            zoom: 13,

            media: [{
                thumb: "",
                sources: [{
                    src: "",
                    type: 'video/webm'
                }],
                type: 'video',
                width: '100%',
                height: 'auto',
                autoplay: true
            }],
            poster: "",
            company: {},
            company_info: {},
            recommend_products: [],
            latest_products: [],
            company_videos: [],
            expo_history: [],

            media_key: 'ddd',
            vr_url: null,
            // url1:"http://img.antway.cn/company/5f45271b91ee6.png",
        }
    },
    head() {
        return {
            title: this.gsv([this.$i18n.locale], this.company.name),
            meta: [{
                hid: 'description',
                name: 'description',
                content: this.$options.filters.strippedContent(this.gsv([this.$i18n.locale], this.company.description) || '')
            }]
        }
    },
    async asyncData({ params, store }) {
        const qq = {
            "lists": []
        }

        let company = {}
        let company_info = {}
        let info_404 = false
        let position = {
            "lng": 109.45744048529967,
            "lat": 36.49771311230842
        }
        let activeTab = ['product', 'intro', 'contactus', 'history', 'video'].includes(params.tab) ? params.tab : 'home'
        const dd = params.id.split('.')
        const id = dd[0]
        // console.log(company_id, "c_id")
        if (/^\d+$/.test(id)) {
            // await store.dispatch('company/getCompanyDetail', {id, qq})
            const res = await getDetail(id, qq)
            if (res) {
                company = res.company
                company_info = res.company_info || {}
                if (company.latitude && company.longitude) {
                    position = {
                        lat: company.latitude,
                        lng: company.longitude
                    }
                } else {
                    if (company.address)
                        position = company.address['zh']
                }
            } else {
                info_404 = true
            }
        } else {
            console.log("c_id NO")
            info_404 = true
        }

        return {
            company,
            company_info,
            position,
            info_404,
            activeTab
        }
    },
    computed: {
        ...mapGetters('opposite', ['my_suppliers']),
        ...mapGetters(['userLevel']),
        ...mapState('company', ['my_collects', 'detail']),

        vrUrl: function () {
            let path = null
            if (this.vr_url) {
                const url = new URL(this.vr_url)
                path = "/vr/" + url.pathname
            }
            return path
        },
        expoPositions: function () {
            var name_arr = []
            const array = this.company.cur_expos
            if (array) {
                if (typeof array == 'object') {
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index]['halls'];
                        if (element)
                            name_arr.push(...element)
                    }
                }
            }
            return name_arr.join(', ')
        },
        no_my_company: function () {
            let is_m = false
            if (this.userLevel) {
                is_m = this.listQuery.company_id == this.$store.state.auth.company_id
            }
            return !is_m
        },
        gender_txt: function () {
            const gender_id = this.gsv(['gender'], this.company.user) || 0
            return this.gsv([this.$i18n.locale, gender_id], this.GENDER)
        },
        hasBanner: function () {
            let kk = false
            if (this.company) {
                kk = !!this.company.banner.length
            }
            return kk
        },
        description_: function () {
            let kk = this.gsv([this.$i18n.locale], this.company.description)
            if (kk) {
                kk = kk.replace(/\n/g, '</br>')
            }
            return kk
        }
    },
    methods: {
        ...mapActions('company', ['getMyCompanyCollects', 'delMyCompanyCollect', 'addMyCompanyCollect']),
        ...mapActions('opposite', ['getMySuppliers']),
        getList() {
            this.is_loading = true
            getCompanyProductList(this.listQuery).then(res => {
                this.products = res.products;
                this.total = res.total;
            }).finally(() => {
                this.is_loading = false
            })
        },
        handleFilter() {
            this.activeTab = 'product'
            this.listQuery.page = 1
            this.getList()
            // this.$router.push({ path: `/company/search?keyword=${this.keyword}` })
        },

        handleContact() {
            const item = this.company
            if (this.no_my_company) {
                const to = this.gsv(['phone'], item.user) || this.gsv(['email'], item.user)
                const name = this.gsv(['name', this.$i18n.locale], item.user)
                this.$router.push({ path: `/message/new`, query: { uid: item.user_id, to, name } })
                
            }
        },
        // handler({ BMap, map }) {
        //     console.log(this.details.position)
        //     var point = new BMap.Point(this.details.position.lng, this.details.position.lat)
        //     map.centerAndZoom(point, 13)
        //     var marker = new BMap.Marker(point) // 创建标注
        //     map.addOverlay(marker) // 将标注添加到地图中
        //     var circle = new BMap.Circle(point, 6, { strokeColor: 'Red', strokeWeight: 6, strokeOpacity: 1, Color: 'Red', fillColor: '#f03' })
        //     map.addOverlay(circle)
        // },
        getClickInfo(e) {
            console.log(e.point.lng)
            console.log(e.point.lat)
            this.center.lng = e.point.lng
            this.center.lat = e.point.lat
        },
        handleVideoPlay(item) {
            this.media = [{
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
                this.media[0]['sources'][0]["src"] = item['url']
            this.media[0]['sources'][0]["type"] = item['content_type']
            this.media_key = +new Date()
            setTimeout(() => {
                this.$refs.lightbox.showImage(0)
            }, 100)
        },
        handleImagePlay(item) {
            var mmm = []
            var index = 0
            this.product_env_images[this.p_activeTab].forEach((el, ind) => {
                if (item.id == el.id) index = ind
                mmm.push({
                    src: el.url
                })
            });
            this.media = mmm
            this.media_key = +new Date()
            setTimeout(() => {
                this.$refs.lightbox.showImage(index)
            }, 100)
            // this.$refs.lightbox.showImage(index)

        },
        handleMedia(list, ind) {
            let mmm = []
            let cnt = 0
            list.forEach(element => {
                if (this.isImage(element.content_type)) {
                    mmm.push({
                        src: element.url
                    })
                } else {
                    mmm.push({
                        sources: [{
                            src: element.url,
                            type: element.content_type
                        }],
                        type: 'video',
                        width: '100%',
                        height: 'auto',
                        autoplay: true
                    })

                }

            });
            this.media = mmm
            this.media_key = +new Date()
            setTimeout(() => {
                this.$refs.lightbox.showImage(ind)
            }, 100)
        },

        // ------------------------------------
        handlePTabChange(active_tab_name) {
            console.log(active_tab_name)
            if (!this.product_env_images[active_tab_name].length) {
                this.is_loading_in = true
                fileList(this.listQuery.company_id, active_tab_name).then(({ files }) => {
                    this.product_env_images[active_tab_name] = files
                }).finally(() => {
                    this.is_loading_in = false
                })
            }
        },

        handleExpoTabChange(active_tab_id) {
            const kkk = this.expo_histories.find(rr => rr.id == active_tab_id)
            if (kkk && kkk.histories) {
                this.pre_expo = kkk.histories
            }
        },
        handleTabChange(active_tab_name) {
            switch (active_tab_name) {
                case 'product':
                    if (!this.products.length) {
                        this.listQuery.page = 1
                        this.getList()
                    }
                    break;
                case 'intro':
                    if (this.p_activeTab == 'image1') {
                        this.handlePTabChange('image1')
                    }
                    break;
                case 'history':
                    if (!this.expo_histories.length) {
                        getHistory(this.listQuery.company_id).then(res => {
                            this.expo_histories = res.old_sellers
                            let ttt = []
                            if (res.old_sellers.length) {
                                res.old_sellers.forEach(element => {
                                    ttt.push({
                                        id: element.id,
                                        name: element.expo.name
                                    })
                                });
                                this.expo_activeTab = res.old_sellers[0]['id']
                                this.expo_tab_items = ttt
                                this.handleExpoTabChange(this.expo_activeTab)
                            }
                        })
                    }
            }
            const tab = active_tab_name == 'home' ? '' : active_tab_name
            history.replaceState({}, null, '/company/'+ this.$route.params.id + '/' + tab)
        },

        goTab(tabName) {
            this.activeTab = tabName
            this.handleTabChange(tabName)
            window.scrollTo(0, 0)
        },

        goProductDetail(item) {
            // this.$router.push({ path: `/product/${p_id}` })
            this.$router.push({ path: this.getSeoProduct(item) })

        },
        goInquiry() {
            if (this.userLevel) {
                if (this.userLevel > 2) {
                    if (this.no_my_company) {
                        const company_name = this.gsv([this.$i18n.locale], this.company.name)
                        const company_user = this.gsv(['name', this.$i18n.locale], this.company.user)
                        this.$router.push({ path: `/inquiry/company/${this.listQuery.company_id}?c_n=${company_name}&c_u=${company_user}` })
                    }
                } else {
                    this.$confirm(this.$t('msg.permission_no'), this.$t('warning'), {
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
                        this.$router.push({ path: "/pricing", query: { redirect: this.$route.path } })
                    }).catch(() => {})
                }
            } else {
                this.$router.push({ path: `/login?redirect=${this.$route.path}` })
            }
        },

        // ==================================
        // shoucang , for visit
        // ==================================             
        getActive(tag, reverse = false) {
            const old_status = this.company[tag]
            if (reverse) this.company[tag] = !this.company[tag]
            return old_status
        },
        handleShoucangToggle() {
            if (this.$store.state.auth) {
                if (this.no_my_company) {
                    const collect_ = this.my_collects.find(kk => kk.source_id == this.listQuery.company_id)
                    if (collect_) {
                        this.delMyCompanyCollect(collect_.id)
                    } else {
                        this.addMyCompanyCollect(this.listQuery.company_id).then(() => {
                            const title = this.$t('msg.shoucang_thanks')
                            const view_path = `“${this.$t('mine')}- ${this.$t('collect.my')}”`
                            const path = '/my/collection/company'
                            let content = ''
                            if (this.$i18n.locale == 'zh')
                                content = `<p class="font-11">可进入<span class="text-danger">${view_path}</span>查看</p>`
                            else
                                content = `<p class="font-11">Visit <span class="text-danger">${view_path}</span> to manage your favorites</p>`

                            this.$confirm(content, title, {
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
                        })
                    }

                }
            } else {
                this.$router.replace({ path: '/login', query: { redirect: this.$route.path } })
            }
        },

        handleVisitToggle() {
            if (this.gsv([0], this.company.cur_expos)) {
                if (this.$store.state.auth) {
                    if (this.no_my_company) {
                        // const cur_status = this.getActive(id, 'is_for_visit')
                        // if (cur_status) return
                        toggleVisit(this.listQuery.company_id).then(() => {
                            const old_status = this.getActive('is_for_visit', true)
                            if (!old_status) {

                                const title = '感谢您的关注，已发送邀约，届时请莅临参观'
                                const view_path = `“${this.$t('mine')}-${this.$t('want.buy')}-${this.$t('my_exhibitor')}”`
                                const path = '/my/buy/company'
                                let content = ''
                                if (this.$i18n.locale == 'zh')
                                    content = `<p class="font-11">可进入<span class="text-danger">${view_path}</span>查看</p>`
                                else
                                    content = `<p class="font-11">Visit <span class="text-danger">${view_path}</span> to manage </p>`

                                this.$confirm(content, title, {
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
                } else {
                    this.$router.replace({ path: '/login', query: { redirect: this.$route.path } })
                }
            } else {
                this.$notify({
                    title: this.$t('error'),
                    message: this.$t('msg.company_no_visit'),
                    type: 'error'
                });
            }
        },
        goSvgMap() {
            const first_expo = this.gsv([0], this.company.cur_expos)
            if (first_expo) {
                const expo_name = this.gsv(['prefix'], first_expo)
                const hall_id = this.gsv(['hall_ids', 0], first_expo)
                const position_id = this.gsv(['halls', 0], first_expo)
                if (expo_name && hall_id && position_id) {
                    const map_url = `${process.env.M_EXPO_URL}${expo_name.toLowerCase()}/search?h=${hall_id}&p=${position_id}`
                    console.log(map_url)
                    window.open(map_url, '_blank')
                }
            }
        },
        price_real(info) {
            let ppp = 'xxx'
            if (this.userLevel) {
                if (info.is_only_buyer) {
                    if (this.my_suppliers.includes(info.user_id)) {
                        ppp = info.price
                    }
                } else {
                    ppp = info.price
                }
                if (info.user_id == this.$store.state.auth.id) ppp = info.price
            }
            return ppp
        },
        hCheckMoreContact() {
            if (this.$store.state.auth) {
                this.$confirm(this.$t('msg.permission_upgrade_vip_wen'), this.$t('warning'), {
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
                    this.$router.push({ path: "/pricing", query: { lev: 5 } })
                }).catch(() => {})
            } else {
                this.$router.replace({ path: '/login', query: { redirect: this.$route.path } })
            }
        }
    },
    mounted() {
        const data = {
            "lists": [
                "recommend_products",
                "latest_products",
                "expo_history",
                "company_videos"
            ],
            "qichacha": true
        }
        if (this.info_404) {
            setTimeout(() => {
                this.goBack()
            }, 1000);
            return false
        }
        this.is_loading = true
        getDetail(this.listQuery.company_id, data).then(({
            company,
            recommend_products,
            latest_products,
            expo_history,
            company_videos,
            company_info
        }) => {
            if (company) {
                this.company = company
                this.company_info = company_info || {}
                // // this.vr_url = this.gsv(['banner_vr', 'url'], company)
                this.recommend_products = recommend_products
                this.latest_products = latest_products
                this.company_videos = company_videos
                if (expo_history)
                    this.expo_history = expo_history
                this.position = this.gsv(['zh'], company.address)
            } else {}

        }).catch(err => {

        }).finally(() => {
            this.is_loading = false
        })
        if (this.userLevel) {
            if (!this.my_suppliers.length) this.getMySuppliers()
            if (!this.my_collects.length) this.getMyCompanyCollects()
        }
    },
}
</script>

<style lang="scss" scoped>
.company_bg {
    height: 40vw;
    object-fit: cover;
}

.avatar {
    width: 15vw;
    height: 15vw;
    max-width: 6rem;
    max-height: 6rem;
    object-fit: cover;
}

.info-container {
    >div p:first-child {
        min-width: 4.4rem;
    }
}

.video-show-container {
    background: white;
    position: absolute;
    z-index: 3;
    width: 100vw;
    top: 50%;
    transform: translateY(-50%);
}

.bg-img-gallery {
    height: 35vw;
    object-fit: contain;
    background-size: cover;
    background-position: center;
}

footer {
    position: fixed;
    bottom: 0;
    width: 100vw;
    z-index: 88;
    max-width: 768px;
    left: 50%;
    transform: translateX(-50%);

    .f-item {
        padding: 0.25rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        flex: 1;

        p {
            padding-top: 2px;
            color: #999999;
            font-size: 0.9rem;
        }
    }

    .f-item.active {
        p {
            color: #E50113;
        }
    }
}
</style>
