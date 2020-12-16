<template>
<div>
    <kuc-page-header :title="$t('msg.i')" to="/my"></kuc-page-header>
    <div class="px-2 bg-white">
        <ku-tab-line :list='tab_items' :activeTab.sync="activeTab" @change="handleTabChange" :activeTabBarWidth=30></ku-tab-line>
    </div>
    <!-- <nuxt-child></nuxt-child> -->

    <!-- filter for recieve -->
    <div v-if="activeTab=='recieve' || activeTab=='star'" class="bg-white d-flex justify-content-between filter-box-2">
        <el-select v-model="listQuery.tag" placeholder="" @change="handleFilter" v-if="activeTab=='recieve'">
            <el-option v-for="item in options_tag_recieve" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
        <div v-else> &nbsp;</div>
        <el-select v-model="listQuery.group_id" placeholder="" @change="handleFilter">
            <el-option key="group-all" :label="$t('group.i')" value=''>{{$t('all')}}</el-option>
            <el-option v-for="item in group" :key="item.id" :label="item.name" :value="item.id">{{item.name}} ({{item.contacts}})</el-option>
        </el-select>
    </div>
    <!-- filter for sent -->
    <div v-if="activeTab=='sent'" class="bg-white d-flex justify-content-between filter-box-2 px-2">
        <el-select v-model="listQuery.tag" placeholder="" @change="handleFilter">
            <el-option v-for="item in options_tag_sent" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>

        <div>
            <el-button type="primary" @click="handleNew" size="small">{{$t('msg.send')}}</el-button>
        </div>
    </div>

    <div>
        <!-- list -->
        <div class="mt-2 px-2 pt-2 bg-white">
            <el-checkbox-group v-model="checked" class="check-box-label-div" @change="handleCheckedChange">
                <div v-for="item in list" :key="item.id">
                    <el-checkbox :label="item.id">
                        <div class="d-flex align-items-center">
                            <div class="flex-1">
                                <div class="d-flex align-items-center">
                                    <div class="d-flex align-items-center mr-2 flex-1">
                                        <svg-icon :name="item.is_star ? 'star' : 'star-o'" color="#E50113" @click.prevent="handleStar(item.id)"></svg-icon>
                                        <h3 class="text-line-1 ml-2 text-dark28 flex-1" @click.prevent="handleDetail(item)">{{item.title}}</h3>
                                    </div>
                                    <template v-if="replied(item.answers)">
                                        <svg-icon name="message_f2" color="#D4D4D4"></svg-icon>
                                    </template>
                                    <template v-else>
                                        <svg-icon v-if="item.is_read" name="message_f1" color="#D4D4D4"></svg-icon>
                                        <svg-icon v-else name="message_f1" color="#E50113"></svg-icon>
                                    </template>

                                    <!-- 
                                    <h3 class="text-line-1 ml-2 text-dark28 flex-1" @click="handleDetail(item.id)">{{item.name}}</h3>
                                    <span v-if="item.status==1" class="text-white bg-danger py-1 px-2 rounded font-08">{{$t('reply')}}</span>
                                    <svg-icon v-else-if="item.status==2" name="message_f2" color="#D4D4D4"></svg-icon>
                                    <svg-icon v-else-if="item.status==3" name="message_f1" color="#D4D4D4"></svg-icon>
                                    <svg-icon v-else-if="item.status==4" name="message_f1" color="#DA1212"></svg-icon> -->

                                </div>
                                <p class="text-dark9 font-09 mt-1" @click.prevent="handleDetail(item)">{{$store.state.auth.id == item.sender_id ? gsv(['name', $i18n.locale], item.receiver) : (gsv(['name', $i18n.locale], item.sender) || gsv(['user_name'], item.sender))}} &nbsp;&nbsp;&nbsp;&nbsp;{{parseTime(item.created_at, '{y}-{m}-{d} {h}:{i}')}}</p>
                            </div>
                            <div class="btn-setting-group">
                                <el-button type="text" v-if="activeTab!='trash' && $store.state.auth.id != item.sender_id " @click.prevent="handleGroupShow(item)" icon="el-icon-setting p-2 font-11 text-dark9"></el-button>
                                <el-button type="text" @click.prevent="handleDelete([item.id])" icon="el-icon-delete p-2 font-11 text-dark9"></el-button>
                            </div>
                        </div>
                    </el-checkbox>
                    <ku-line></ku-line>
                </div>
            </el-checkbox-group>

            <ku-loading-no-data :active="isLoading" :total="total" push />

        </div>

        <!-- pagination -->
        <div class="text-center pagination-kuc mt-2 pb-5">
            <el-pagination background layout="prev, pager, next" :total="total" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size="listQuery.limit" :current-page.sync="listQuery.page" @current-change="getList" :hide-on-single-page='true'></el-pagination>
        </div>

        <!-- bottom -->
        <div class="fixed-bottom a-m-900 px-2 py-1 bg-white">
            <div class="d-flex justify-content-between align-items-center">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{$t('select.all')}}</el-checkbox>
                <el-button type="text" @click="handleDelete(checked)" :class=" !checked.length ? `ml-3 text-dark6` : 'ml-3 text-dark28'" :disabled="!checked.length">{{$t('del_multi')}}</el-button>
                <p class="text-dark6">{{$t('page.total')}}<span class="text-danger">{{total}}</span>{{$t('page.item_msg')}}</p>
            </div>
        </div>
    </div>

    <!-- dlg group-setting  -->
    <el-dialog title="Country" :visible.sync="dialogVisible" width="100%" class="full-modal-container-z" :show-close="false">

        <div slot="title" class="position-fixed w-100" style="z-index:999">
            <kuc-page-header :title="$t('group.set')" disabled @back="dialogVisible = false" />
            <div class="bg-darkF7" style="height:6px"></div>
        </div>

        <div class="py-5">
            <div class="mt-2 bg-white">
                <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" class="bg-white">

                    <div class="align-items-center py-1 d-flex">
                        <p class="text-nowrap mr-2">{{$t('group.sel')}}</p>
                        <el-select v-model="info.group_id" :placeholder="$t('select')" class="w-100 text-right" :key="dialogVisible" :disabled="!!info.group_name">
                            <el-option v-for="item in group" :key="'setting_'+ item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </div>
                    <ku-line />

                    <el-form-item>
                        <el-input v-model="info.group_name" class="text-right" :placeholder="$t('group.input')">
                            <template slot="prepend">{{$t('group.add_new')}}</template>
                        </el-input>
                    </el-form-item>

                </el-form>
                <el-row :gutter="20" class="px-3 mt-5">
                    <el-col :span="12">
                        <el-button type="primary" @click="handleGroupOK" class="w-100" round :disabled="!info.group_name && !info.group_id">{{$t('confirm.ok')}}</el-button>
                    </el-col>
                    <el-col :span="12">
                        <el-button type="primary" @click="dialogVisible = false" class="w-100" round plain>{{$t('confirm.cancle')}}</el-button>
                    </el-col>
                </el-row>
            </div>
        </div>

    </el-dialog>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getList, toggleStar, del, setGroup } from "~/api/message"
export default {
    middleware: 'authenticated',
    name: 'Layout_Notice',
    head() {
        return {
            title: this.$t('msg.i')
        }
    },
    data() {
        return {
            tab_items: [
                { id: 'recieve', name: this.$t('msg.in') },
                { id: 'sent', name: this.$t('msg.out') },
                { id: 'star', name: this.$t('msg.star') },
                { id: 'trash', name: this.$t('msg.trash') },
            ],
            activeTab: 'recieve',
            isLoading: true,
            options_tag_recieve: [
                { id: 'all', name: this.$t('all') },
                { id: "system", name: this.$t('msg.system') },
                { id: "user", name: this.$t('msg.user') },
            ],
            options_tag_sent: [
                { id: 'all', name: this.$t('all') },
                { id: "answer", name: this.$t('reply') },
                { id: "new", name: this.$t('msg.new') },
            ],
            listQuery: {
                datatype: "received",
                tag: 'all',
                group_id: '',
                limit: 10,
                page: 1
            },
            total: 0,
            list: [],
            checked: [],
            checkAll: false,
            isIndeterminate: false,
            dialogVisible: false,
            info: {
                group_id: '',
                group_name: '',
                user_id: ''
            },
            info_old: {},
            rules: {
                name: [{ required: true, message: this.$t('valid.required', [this.$t('name')]), trigger: ['blur'] }, ],
            },
        }
    },
    async asyncData({ params, route, redirect }) {
        const activeTab = route.query.tab || 'recieve'
        return {
            activeTab,
        }
    },    
    computed: {
        ...mapState('message', ['group'])
    },
    methods: {
        ...mapActions('message', ['getMessageGroup']),
        reset() {
            this.list = []
            // this.total = 0
            this.checked = []
            this.checkAll = false
            this.isIndeterminate = false

        },
        getList() {
            this.reset()
            this.isLoading = true
            getList(this.listQuery).then(res => {
                this.list = res.items
                this.total = res.total
            }).finally(() => {
                this.isLoading = false
            })
            // this.getMessage(this.listQuery)
        },
        handleFilter() {
            this.listQuery.page = 1;
            this.getList()
        },
        handleTabChange(activeTab) {
            if (activeTab != this.$route.query.tab)
                this.$router.push({ name: this.$route.name, query: { tab: activeTab } })
            switch (activeTab) {
                case "sent":
                    this.listQuery.datatype = "sent"
                    this.listQuery.tag = "all"
                    this.activeTab = "sent"
                    break;
                case "star":
                    this.listQuery.datatype = "starred"
                    this.listQuery.tag = "all"
                    this.activeTab = "star"
                    break;
                case "trash":
                    this.listQuery.datatype = "trash"
                    this.listQuery.tag = "all"
                    this.activeTab = "trash"
                    break;
                case "":
                case undefined:
                case "recieve":
                    this.listQuery.datatype = "received"
                    this.listQuery.tag = "all"
                    this.activeTab = "recieve"
                    break;
                default:
                    break;
            }
            this.listQuery.group_id = ''
            this.handleFilter()

        },
        handleCheckAllChange(val) {
            console.log(val)
            if (val) {
                var nn = []
                this.list.forEach(el => {
                    nn.push(el.id)
                });
                this.checked = nn
            } else {
                this.checked = []
            }
            this.isIndeterminate = false;
        },
        handleCheckedChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.list.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length;
        },

        handleStar(id) {
            toggleStar(id).then(() => {
                let index_target = this.list.findIndex(xx => xx.id == id)
                this.list[index_target]['is_star'] = !this.list[index_target]['is_star']
            })
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
                console.log(id)
                del(id).then(re => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'
                    });
                    // this.list.splice(index, 1)
                    this.handleFilter()
                })
            }).catch(() => {})
        },
        handleDetail(item) {
            if (this.activeTab == 'recieve')
                this.$router.push({ path: '/message/' + item.id })
            else
                this.$router.push({ path: "/message/" + item.id + "?pid=" + item.pid })
            // else

        },
        handleNew() {
            this.$router.push({ path: '/message/new' })
        },
        replied(replies) {
            if (replies.length) {
                return replies[replies.length - 1]['sender_id'] == this.$store.state.auth.id
            }
            return false
        },
        handleGroupShow(item) {
            this.info.group_id = this.gsv(['id'], item.group) || ''
            this.info.user_id = item.sender_id
            this.info.group_name = ''

            this.info_old = Object.assign({}, this.info)
            this.dialogVisible = true
        },
        handleGroupOK() {
            if (JSON.stringify(this.info_old) == JSON.stringify(this.info)) {
                this.dialogVisible = false
            } else {
                this.$store.dispatch("common/setLoading")
                let info = Object.assign({}, this.info)
                if (info.group_name) info.group_id = 0
                setGroup(info).then(() => {
                    this.dialogVisible = false
                    // if (info.group_name) {
                    //     this.getMessageGroup()
                    // }
                    this.handleFilter()
                    this.getMessageGroup()
                }).finally(() => {
                    this.$store.dispatch("common/setLoading", false)
                })
            }
        }
    },
    mounted() {
        this.handleTabChange(this.$route.query.tab)
        if (!this.group.length) this.getMessageGroup()
        // this.getList()
        // console.log(this.$route)
    }
}
</script>

<style lang="scss">

.btn-setting-group {
    min-width: 6rem;
    display: flex;
    justify-content: flex-end;
}
</style>
