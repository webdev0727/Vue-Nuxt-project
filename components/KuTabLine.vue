<template>
<div class="ku-tabs__nav-scroll" ref="scroller">
    <!-- :style="`transform: translateX(${active_div_offset}px);`" -->
    <div class="ku-tabs__nav" ref="div_con">
        <div class="ku-tabs__active-bar" :class="`background-color: ${activeTabBarColor}`" :style="`width: ${activeTabBarWidth}px; transform: translateX(${active_bar_offset}px);`"></div>
        <div v-for="(item, kk) in cList" :key="kk" class="ku-tabs__item" :class="getCss(item[_key])" :ref="'tab_'+kk" :style="style" @click='clickItem(kk)'>{{typeof item.name == 'object' ? item.name[$i18n.locale] : item.name}}</div>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: "KuTabLine",
    props: {
        list: {
            type: Array,
            required: true
        },
        activeTab: {
            type: [String, Number],
            required: true
        },
        activeTabBarWidth: {
            type: Number,
            default: 50
        },
        activeTabBarColor: {
            type: String,
            default: ' bg-danger'
        },
        tabPadding: {
            type: Number,
            default: 10
        },
        bigFont: {
            type: Boolean,
            default: false
        },
        _key: {
            type: String,
            default: 'id'
        },

    },
    data() {
        return {
            active_bar_offset: 0,
            // actived: this.activeTab,
            // old_kk: 0
        }
    },
    computed: {
        ...mapState(['lang']),
        style: function () {
            return {
                padding: `0 ${this.tabPadding}px`
            }
        },
        cList: function () {
            if (typeof this.list[0] == 'object') return this.list
            else {
                var new_arr = []
                this.list.forEach(el => {
                    let obj = {
                        name: el
                    }
                    obj[this._key] = el
                    new_arr.push(obj)
                });
                return new_arr
            }
        }
    },
    methods: {
        getCss(item) {
            var newCss = ""
            if (item == this.activeTab) newCss = 'active'
            if (this.bigFont) newCss += ' ku-big-font'
            return newCss
        },
        handleUnderlineBar(kk) {
            var l_offset = 0
            var css = this.bigFont ? 'ku-tabs__item ku-big-font ' : 'ku-tabs__item '
            for (let ii = 0; ii < this.list.length; ii++) {
                var keyy = 'tab_' + ii
                this.$refs[keyy][0].setAttribute('class', css)
            }
            this.$refs['tab_' + kk][0].setAttribute('class', css + 'active')

            for (let ii = 0; ii < kk; ii++) {
                var keyy = 'tab_' + ii
                l_offset += this.$refs[keyy][0]['clientWidth']
            }
            if (kk > 0) l_offset += this.tabPadding
            this.active_bar_offset = l_offset

            const w_screen = this.$refs.scroller['clientWidth']
            const w_t_divs = this.$refs.div_con['clientWidth']
            const w_active_item = this.$refs['tab_' + kk][0]['clientWidth']
            const w_left_scroll = this.$refs.scroller.scrollLeft
            var el_w_left = l_offset - w_left_scroll
            var el_w_left1 = l_offset + w_active_item - w_left_scroll
            if (el_w_left < 0) {
                this.$refs.scroller.scrollLeft = w_left_scroll + el_w_left
            }

            if (el_w_left1 > w_screen) {
                // console.log("right")
                this.$refs.scroller.scrollLeft = w_left_scroll + el_w_left1 - w_screen
            }
        },
        clickItem(kk) {
            // console.log(kk)
            this.handleUnderlineBar(kk)
            this.$emit('click', this.cList[kk])
            if (this.activeTab != this.cList[kk][this._key]) {
                this.$emit('update:activeTab', this.cList[kk][this._key])
                this.$emit('change', this.cList[kk][this._key])
            }
        },
        init() {
            let active_tab = this.activeTab
            if (active_tab == null || active_tab == undefined || active_tab == '') {
                active_tab = this.cList[0][this._key]
                this.$emit('update:activeTab', active_tab)
            }
            let t_index = this.cList.findIndex(x => x[this._key] == active_tab)
            this.handleUnderlineBar(t_index)
        }
    },
    mounted() {
        this.init()

    },
    watch: {
        activeTab: {
            immediate: true,
            deep: true,
            handler: function (newVal, oldVal) {
                if (oldVal != null && oldVal != undefined) {
                    let t_index = this.cList.findIndex(x => x[this._key] == newVal)
                    this.handleUnderlineBar(t_index)
                }
            }
        },
        list(to) {

        },
        lang(to, from) {
            setTimeout(() => {
                this.init()
            }, 1);
        }
    }

}
</script>
