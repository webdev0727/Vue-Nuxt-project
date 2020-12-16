<template>
<div style="position: relative;height: 100vh;" v-if="expo_id">
    <div class="h-100" :style="`background-color: ${bg_color}`">
        <img :src="bg_img" class="w-100" ref="img">
    </div>
    <div class="px-3" style="position: absolute; width: 100%; top: 0; height: 100vh; marign-top: 200px; overflow: auto;">
        <div class="p-2 bg-white trans-i" :style="`margin-top: ${mtt};`">
            <div class="text-center">
                <h3 class="py-2">{{gsv(['name', 'zh'], company)}}</h3>
                <p>{{gsv(['name', 'en'], company)}}</p>
                <img :src="gsv(['logo', 'url'], company)" alt=" " class="w-50 my-4">
                <p>我司将参加{{gsv(['name', 'zh'], expo)}}</p>
                <p>
                    我们诚邀您作为我司特邀观众莅临参观！
                </p>
                <div class="bg-darkF7 py-3">
                    <h2 class="text-danger">{{$t('expo.no_')}}：{{expoPositions}}</h2>
                    <p class="text-nowrap mt-2">{{gsv(['startdate'], expo)}} ~ {{gsv(['enddate'], expo)}}</p>
                    <p>{{gsv(['expo_type', 'description', 'en'], expo)}}</p>
                    <div class="py-3">
                        <el-button type="primary" @click="handleParticipate" class="w-50" round :disabled="disable_why_inviter_is_me">立即预登记</el-button>
                    </div>
                </div>
            </div>
            <!-- shoucang -->
            <div class="my-3">
                <p>关注人数 <span class="text-danger">{{followers.length}}</span>人</p>
                <div class=" d-flex flex-wrap shoucang-users">
                    <p v-for="item in Math.min(followers.length, max_aravar_show_init_count) " :key="item">
                        <img :src="followers[item-1].avatarurl" alt="" class="rounded-circle fit-cover p-1">
                    </p>
                    <el-button type="text" @click="max_aravar_show_init_count = followers.length" v-if="followers.length > Math.min(followers.length, max_aravar_show_init_count)">
                        <i class="el-icon-more text-dark9 font-13"></i>
                    </el-button>

                </div>
                <no-data v-if="!followers.length" />
            </div>

            <div>
                <ku-title-left blue>{{$t('about_us')}}</ku-title-left>
                <ku-read-more :text="gsv(['description', $i18n.locale], company) || ''" :maxChars="30" />
            </div>

            <div class="mt-2 pb-5">
                <ku-title-left blue>{{$t('recom.product')}}</ku-title-left>
                <div class="mb-3" v-for="info in recommend_products" :key="info.id">
                    <nuxt-link :to="'/product/' + info.id">
                        <img :src="getImg1(info.assets)" alt=" " class="w-100 fit-cover">
                    </nuxt-link>
                    <h4>{{gsv([$i18n.locale], info.name)}}</h4>
                    <ku-read-more :text="(gsv(['description', $i18n.locale], info) || '') | strippedContent" :maxChars="30" lessStr="Read Less" />
                </div>
                <no-data v-if="!recommend_products.length" />
            </div>
            <div class="py-5"></div>

        </div>
    </div>

    <!-- bottom -->
    <div class="fixed-bottom a-m-900">
        <div class="position-relative">
            <div class="bg-bottom"></div>
            <div class="button-edit">
                <el-button type="primary" @click="handleParticipate" round :disabled="disable_why_inviter_is_me">
                    <svg-icon name="edit_" color="white" width="30" height="25"></svg-icon>
                </el-button>

            </div>
        </div>
        <el-row>
            <el-col :span="12">
                <div class="text-center p-3 bg-white" @click="goSvgMap">{{$t('view.layout')}}</div>
            </el-col>
            <el-col :span="12">
                <div class="text-center p-3 bg-danger text-white" @click="handleVisitToggle">{{company.is_for_visit ? $t('want.visit1') : $t('want.visit')}}</div>
            </el-col>
        </el-row>
    </div>

</div>
<div style="background:#00519B;position: relative;height: 100vh;" v-else>
    <div class="text-white pt-2">
        <div class="m-auto" style="width:30%">
            <img src="/images/INVITATION.png" alt=" " class="mt-4 w-100" style="max-width:6rem">
        </div>
    </div>
    <div class="p-3 text-white text-center">
        <h2 class="mt-3">Something's wrong</h2>
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import KuReadMore from "~/components/KuReadMore"
import { getDetail, toggleVisit } from '@/api/company'
import { getInviteData } from '@/api/user'
import { getExpo, getBuyerExpoList } from '@/api/expo'
export default {
    name: "Invite",
    components: { KuReadMore },
    data() {
        return {
            max_aravar_show_init_count: 13,
            expo: {},
            company: {},
            followers: [],
            bg_color: "#00519B",
            bg_img: '',
            expo_id: this.$route.query.expo_id,
            expo_name: this.$route.query.expo_name,
            inviter: this.$route.query.inviter,
            inviter_name: {},
            recommend_products: [],
            already_participated: false,
            mtt: '75vw'
        }
    },
    computed: {
        lang_key: function () {
            return "logo_mobile_" + this.$i18n.locale
        },
        disable_why_inviter_is_me: function () {
            let ddd = false
            if (this.$store.state.auth) {
                if (this.$store.state.auth.id == this.inviter) ddd = true
            }
            return ddd
        },
        expoPositions: function () {
            if (!this.company.cur_expos) return ''
            const kk = this.company.cur_expos.find(rr=>rr.prefix==this.expo.prefix) || {}
            if (kk.halls) return kk.halls.join(', ')            
        },     
    },
    head() {
        return {
            title: this.$t('invite'),
            meta: [{
                hid: 'description',
                name: 'description',
                content: `${this.expo.prefix} ${this.gsv(['name', this.$i18n.locale], this.company)}`
            }]
        }
    },
    async asyncData({ query }) {
        const expo_id = query.expo_id
        const inviter_id = query.inviter
        let bg_color = ''
        let bg_img = ''
        let expo = {}
        let company = {}
        let followers = []
        if (!expo_id || !inviter_id) return {}
        const res = await getInviteData(expo_id, inviter_id)
        if (res) {
            // console.log(res)
            expo = res.expo
            company = res.inviter.company
            followers = res.followers
            if (res.invite_card_setting) {
                bg_color = res.invite_card_setting.value || "#00519B"
                if (res.invite_card_setting.invite_card_bg) {
                    bg_img = res.invite_card_setting.invite_card_bg[0]['url'] || "http://img.antway.cn/setting/5f9f51148c862.jpg"
                }
            }
        }
        return {
            expo,
            company,
            followers,
            bg_color,
            bg_img
        }
    },
    methods: {
        validAuth() {
            if (!this.$store.state.auth) {
                this.$router.push({ path: `/login`, query: { redirect: this.$route.fullPath } })
            } else {
                return true
            }
            return false
        },
        handleParticipate() {
            const invite_da = {
                expo_id: this.expo_id,
                inviter_id:  this.inviter,
                inviter_name: this.inviter_name
            }
            localStorage.setItem('mAntway_invite', JSON.stringify(invite_da))
            if (this.validAuth()) {

                if (this.already_participated) {
                    this.$notify({
                        title: this.$t('error'),
                        message: this.$t('msg.apply_done'),
                        type: 'error'
                    });
                } else
                    this.$router.push({ path: `/my/buy/participate/${this.expo_id}/step1` })

            }
        },
        goSvgMap() {
            if (this.expo) {
                const expo_name = this.expo.prefix
                const cur_expo_data = this.company.cur_expos.find(rr=>rr.prefix==expo_name) || {}
                const hall_id = this.gsv(['hall_ids', 0], cur_expo_data)
                const position_id = this.gsv(['halls', 0], cur_expo_data)
                if (expo_name && hall_id && position_id) {
                    const map_url = `${process.env.M_EXPO_URL}${expo_name.toLowerCase()}/search?h=${hall_id}&p=${position_id}`
                    window.open(map_url, '_blank')
                }
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
        handleVisitToggle() {
            if (this.validAuth()) {
                if (this.$store.state.auth.id == this.inviter) {
                    this.$notify({
                        title: this.$t('error'),
                        message: this.$t('msg.can_not_invite_yourself'),
                        type: 'error'
                    });
                } else {
                    // 我要参观
                    if (this.company.is_for_visit) {
                        this.handleParticipate()
                    }
                    // 意向参观
                    else {
                        toggleVisit(this.company.id).then(() => {
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
                }
            }
        }, 
        init(){
            this.mtt = this.$refs.img.clientHeight + 'px'
        } 
    },
    mounted() {
        const expo_id = this.expo_id
        const inviter_id = this.inviter
        if (!expo_id || !inviter_id) return false
        getInviteData(expo_id, inviter_id).then(({ expo, followers, inviter, invite_card_setting }) => {
            this.expo = expo
            this.followers = followers
            this.company = inviter.company
            this.inviter_name = inviter.name
            this.bg_color = invite_card_setting.value || "#00519B"
            this.bg_img = this.gsv(['invite_card_bg', 0, 'url'], invite_card_setting) || "http://img.antway.cn/setting/5f9f51148c862.jpg"
            const query_data = { "lists": ["recommend_products"] }
            getDetail(this.company.id, query_data).then(res => {
                this.recommend_products = res.recommend_products
            })
        })
        if (this.$store.state.auth) {
            getBuyerExpoList().then(res => {
                const list_done = res.expo_applicant_buyers
                if (list_done)
                    this.already_participated = !!(list_done.find(rr => rr.expo_id == this.expo_id))
            })
        }
        console.log(this.$refs.img.clientHeight)
        setTimeout(() => {            
            this.mtt = this.$refs.img.clientHeight + 'px'
        }, 1);
        window.addEventListener("resize", this.init)
    }
}
</script>

<style lang="scss" scoped>
.shoucang-users {

    img,
    button {
        width: 12vw;
        height: 12vw;
    }
}

.bg-bottom {
    background-color: #033888;
    height: 6rem;
    clip-path: polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%);
}

.button-edit {
    position: absolute;
    width: 100%;
    text-align: center;
    top: 50%;
    transform: translateY(-50%);
}
.trans-i{
    transition: margin-top 0.5s;
}
</style>
