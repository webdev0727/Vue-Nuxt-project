<template>
<div class="container">
    <div class="bg-white mb-2">
        <kuc-page-header :title="$t('event.i')">
            <p class="container-input-bg-dark9 header-search-bar">
                <el-input :placeholder="$t('search')" size="medium" v-model="listQuery.search" class="search-rounded" @change="handleFilter">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </p>
        </kuc-page-header>
        <div class="px-2 border-bottom">
            <ku-tab-line :list="tab_items" :activeTab.sync="listQuery.tab" :activeTabBarWidth="30" @change="handleTabChange"></ku-tab-line>
        </div>
    </div>
    <div class="px-2">
        <ku-loading-no-data :active="isLoading" :total="total" />
        <div v-for="item in list" :key="item.id" class="rounded mb-2 card-container bg-white">
            <nuxt-link :to="'/events/' + item.id" :style="`background-image:url(${getImg1(item.covers)});`" class="card-image rounded">
                <span v-if="item.subtag == 'online'" class="py-1 px-2 text-white" style="background: rgba(0, 0, 0, 0.6)">{{ $t("status.online") }}</span>
                <span v-else class="py-1 px-2 text-white" style="background: rgba(229, 1, 19, 0.6)">{{ $t("status.offline") }}</span>
                <p class="py-1 px-2 rounded">{{ $t("status.baoming") }}{{ item.signups }}人</p>
            </nuxt-link>
            <div class="p-2">
                <nuxt-link :to="'/events/' + item.id">
                    <h3 class="mb-2">{{ gsv([$i18n.locale], item.title) }}</h3>
                </nuxt-link>
                <div class="text-dark6 font-09">
                    <p class="text-line-1" v-if="item.overview">
                        {{ $t("intro.event") }}: {{ item.overview }}
                    </p>
                    <p class="text-line-1" v-else>
                        {{ $t("intro.event") }}: {{ item.content | strippedContent }}
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <p>
                            {{ $t("date.event") }}:
                            {{ parseTime(item.startdate, "{y}年{m}月{d}日") }}至{{
                  parseTime(item.enddate, "{m}月{d}日")
                }}
                        </p>
                        <el-button v-if="item.my_signup" type="info" size="small" round disabled>{{
                $t("status.baoming")
              }}</el-button>
                        <el-button v-else-if="getIsDissable(item.enddate)" type="info" size="small" round disabled>{{ $t("status.close") }}</el-button>
                        <el-button v-else type="primary" @click="handleJoin(item)" size="small" round>{{ $t("btn.sign_up") }}</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="text-center pagination-kuc mt-2">
        <el-pagination background layout="prev, pager, next" :total="total" :pager-count="5" :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size="listQuery.limit" :current-page.sync="listQuery.page" @current-change="getList" hide-on-single-page></el-pagination>
    </div>
</div>
</template>

<script>
import { getList } from "@/api/activity";

export default {
    name: "Events",
    components: {},
    data() {
        return {
            list: [],
            total: 0,
            listQuery: {
                page: 1,
                limit: 10,
                search: "",
                tab: "0",
            },
            isLoading: true,
            tab_items: [
                { id: "0", name: this.$t("all") },
                { id: "1", name: this.$t("event.st1") },
                { id: "2", name: this.$t("event.st2") },
                { id: "3", name: this.$t("event.st3") },
            ],
        };
    },
    async asyncData({ store }) {
        if (!store.state.common.seo)
            await store.dispatch("common/downloadSeo").catch((err) => {
                console.log("seo_err");
            });
    },
    computed: {
        seo_path: function () {
            return this.$i18n.locale == "en" ? "/en/activities" : "/activities";
        },
    },
    head() {
        return {
            title: this.gsv(["www", this.seo_path, "title"], this.$store.state.common.seo) || this.$t("event.i"),
            meta: [{
                    hid: "description",
                    name: "description",
                    content: this.gsv(
                        ["www", this.seo_path, "description"],
                        this.$store.state.common.seo
                    ),
                },
                {
                    hid: "keywords",
                    name: "keywords",
                    content: this.gsv(
                        ["www", this.seo_path, "keywords"],
                        this.$store.state.common.seo
                    ),
                },
            ],
        };
    },
    methods: {
        reset() {
            this.list = [];
            this.total = 0;
            this.listQuery.page = 1;
        },
        getList() {
            this.isLoading = true;
            getList(this.listQuery)
                .then((res) => {
                    // this.list.push(...res.items)
                    this.list = res.items;
                    this.total = res.total;
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        handleFilter() {
            this.reset();
            this.listQuery.page = 1;
            this.getList();
        },
        handleJoin(item) {
            this.$router.push({ path: "/events/baoming/" + item.id });
        },
        getIsDissable(endTime) {
            var endTimeSecond = endTime;
            if (this.validDate(endTime)) {
                endTimeSecond = endTime + " 23:59:59";
            }
            if (new Date().getTime() > +new Date(endTimeSecond)) return true;
            return false;
        },
        handleTabChange(active_tab_name) {
            this.reset();
            this.getList();
        },
    },
    mounted() {
        this.getList();
    },
};
</script>

<style lang="scss" scoped>
.card-container {
    overflow: hidden;

    .card-image {
        position: relative;
        display: inline-block;
        width: 100%;
        height: 40vw;
        max-height: 400px;
        background-size: cover;
        background-position: center;
        overflow: hidden;

        span {
            position: absolute;
        }

        p {
            position: absolute;
            bottom: 0.25rem;
            right: 0.25rem;
            color: white;
            background-color: rgba(0, 0, 0, 0.6);
        }
    }
}
</style>
