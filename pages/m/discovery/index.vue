<template>
<div class="container">
    <!-- Top part -->
    <div class="bg-white">
        <kuc-page-header :title="$t('discovery')">
            <nuxt-link to="/discovery/create" class="text-danger">{{$t("want.post")}}</nuxt-link>
        </kuc-page-header>

        <div class="p-2 container-input-bg-dark9">
            <el-input :placeholder="$t('search')" v-model="listQuery.keyword" class="search-rounded" @change="handleFilter">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
        </div>
    </div>

    <div class="px-2 mb-5 mt-2">
        <!-- 发现 discovery  -->
        <div class="bg-white rounded py-2 pl-2">
            <div class="mt-1">
                <CardBigDiscover v-for="item in list" :key="item.id" :da="item" />
            </div>
            <infinite-loading spinner="spiral" :identifier="infiniteId" @infinite="handleInfinite" class="m-3">
            </infinite-loading>
        </div>
    </div>
    <br />
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

import CardBigDiscover from "~/components/Card/CardBigDiscover.vue";

export default {
    // middleware: 'authenticated',
    name: "Discovery",
    layout: "main",
    components: {
        CardBigDiscover,
    },
    head() {
        return {
            title: this.$t("discovery"),
        };
    },
    data() {
        return {
            // list: [],
            // total: 0,
            listQuery: {
                page: 1,
                keyword: "",
                limit: 10,
            },
            activeTabName: "news",
            infiniteId: +new Date(),
            is_loading: false,
        };
    },
    async asyncData({ store }) {
        if (!store.state.common.seo)
            await store.dispatch("common/downloadSeo").catch((err) => {
                console.log("seo_err");
            });
    },
    computed: {
        ...mapState("discovery", {
            list: (state) => state.items,
            total: (state) => state.total,
        }),
        seo_path: function () {
            return this.$i18n.locale == "en" ? "/en/discover" : "/discover";
        },
    },
    head() {
        return {
            title: this.gsv(["www", this.seo_path, "title"], this.$store.state.common.seo) || this.$t("discovery"),
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
        ...mapActions("discovery", ["getDiscovery", "clearDiscovery"]),
        getList() {
            this.is_loading = true;
            this.getDiscovery(this.listQuery)
                .then((res) => {
                    if (res.items) {
                        this.listQuery.page += 1;
                    }
                })
                .finally(() => {
                    this.is_loading = false;
                    this.infiniteId += 1;
                });
        },
        handleFilter() {
            this.listQuery.page = 1;
            this.clearDiscovery();
            this.infiniteId += 1;
        },
        handleInfinite($state) {
            if (!this.is_loading) {
                this.is_loading = true;
                this.getDiscovery(this.listQuery)
                    .then((res) => {
                        if (res.items.length) {
                            this.listQuery.page += 1;
                            $state.loaded();
                            if (this.list.length >= this.total) {
                                $state.complete();
                            }
                        } else {
                            $state.complete();
                        }
                    })
                    .finally(() => {
                        this.is_loading = false;
                    });
            }
        },
    },
    mounted() {
        if (this.list.length) this.getList();
    },
};
</script>
