<template>
<div>
    <div class="bg-white">
        <kuc-page-header :title="$t('xunpan.my')"></kuc-page-header>
        <div class="d-flex justify-content-around filter-box-2">
            <el-select v-model="listQuery.mode" placeholder="" @change="handleFilter">
                <el-option v-for="item in options_mode" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
            <el-select v-model="listQuery.group" placeholder="" @change="handleFilter">
                <el-option key="group-all" :label="$t('group.i')" value="">{{$t('all')}}</el-option>
                <el-option v-for="item in group_for_buyer" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
            <el-select v-model="listQuery.date" placeholder="" @change="handleFilter">
                <el-option key="date_all" :label="$t('post.date')" value="">{{$t('all')}}</el-option>
                <el-option v-for="item in options_date" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </div>
    </div>
    <!-- list -->
    <div class="mt-2 px-2 pt-2 bg-white">
        <el-checkbox-group v-model="checked" class="check-box-label-div" @change="handleCheckedChange">
            <div v-for="item in list" :key="item.id">
                <el-checkbox :label="item.id">
                    <div class="d-flex align-items-center w-100">
                        <div class="flex-1">
                            <div class="d-flex align-items-center">
                                <div class="d-flex align-items-center mr-2">
                                    <svg-icon :name="item.isstarred ? 'star' : 'star-o'" color="#E50113" @click.prevent="handleStar(item.id)"></svg-icon>
                                    <h3 @click="handleEdit(item.id)" class="text-line-1 ml-2 text-dark28">{{item.title}}</h3>
                                </div>
                                <template v-if="item.thread.length">
                                    <svg-icon v-if="item.isviewed" name="message_f1" color="#D4D4D4"></svg-icon>
                                    <svg-icon v-else name="message_f1" color="#E50113"></svg-icon>
                                </template>
                            </div>
                            <p @click="handleEdit(item.id)" class="text-dark9 font-09 mt-1">{{gsv(['name', $i18n.locale], item.sender)}} &nbsp;&nbsp;&nbsp;&nbsp;{{parseTime(item.created_at, '{y}-{m}-{d} {h}:{i}')}}</p>
                        </div>
                        <el-button type="text" @click="handleGroupShow(item)" icon="el-icon-setting p-2 font-11 text-dark9"></el-button>

                        <el-button type="text" @click="handleDelete([item.id])" icon="el-icon-delete p-2 font-11 text-dark9"></el-button>
                    </div>
                </el-checkbox>
                <ku-line></ku-line>
            </div>
        </el-checkbox-group>

        <ku-loading-no-data :active="isLoading" :total="total" />

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
            <p class="text-dark6">{{$t('page.total')}}<span class="text-danger">{{total}}</span>{{$t('page.items')}}</p>
        </div>
    </div>

    <!-- dlg group-setting  -->
    <el-dialog title="Country" :visible.sync="dialogVisible" width="100%" class="full-modal-container-z" :show-close="false">

        <div slot="title" class="position-fixed w-100" style="z-index:999">
            <kuc-page-header :title="$t('group.edit')" disabled @back="dialogVisible = false" />
            <div class="bg-darkF7" style="height:6px"></div>
        </div>

        <div class="py-5">
            <div class="mt-2 bg-white">
                <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" class="bg-white">

                    <div class="align-items-center py-1 d-flex">
                        <p class="text-nowrap mr-2">{{$t('group.sel')}}</p>
                        <el-select v-model="info.opposite_group_id" :placeholder="$t('select')" class="w-100 text-right" :key="dialogVisible" :disabled="!!group_new.name">
                            <el-option v-for="item in group_for_buyer" :key="'setting_'+ item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </div>
                    <ku-line />

                    <el-form-item>
                        <el-input v-model="group_new.name" class="text-right" :placeholder="$t('group.input')">
                            <template slot="prepend">{{$t('group.add_new')}}</template>
                        </el-input>
                    </el-form-item>

                </el-form>
                <el-row :gutter="20" class="px-3 mt-5">
                    <el-col :span="12">
                        <el-button type="primary" @click="handleGroupOK" class="w-100" round :disabled="!group_new.name && !info.opposite_group_id">{{$t('confirm.ok')}}</el-button>
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
import { getList, del, toggleStar } from '@/api/inquire'
import { upsertGroup, add } from '@/api/opposite'

export default {
    head() {
        return {
            title: this.$t('xunpan.my')
        }
    },
    data() {
        return {
            isLoading: true,
            options_mode: [
                { id: 0, name: this.$t('all') },
                { id: 1, name: this.$t('xunpan_sent') },
                { id: 2, name: this.$t('xunpan_replied') },
            ],
            options_date: [
                {
                    label: this.$t('duration.week'),
                    value: 'one_week'
                },
                {
                    label: this.$t('duration.month'),
                    value: 'one_month'
                },
                {
                    label: this.$t('duration.months', [3]),
                    value: 'three_months'
                },
            ],
            total: 0,
            list: [],
            listQuery: {
                mode: 0,
                group: '',
                date: '一月以内',
                page: 1,
                limit: 10
            },
            checked: [],
            checkAll: false,
            isIndeterminate: false,
            dialogVisible: false,
            info: {
                opposite_group_id: '',
                isbuyer: 0,
                opposite_id: '',
            },
            group_new: {
                name: '',
                isbuyer: 0,
            },
            info_old: {},
            rules: {
                name: [{ required: true, message: this.$t('valid.required', [this.$t('name')]), trigger: ['blur'] }, ],
            },
        }
    },
    computed: {
        ...mapState('opposite', ['group_for_buyer', 'my_sellers']),
        ...mapGetters('opposite', ['hasBuyerGroup']),
        title: function () {
            return this.type == "new" ? this.title_arr[0] : this.title_arr[1]
        }
    },
    methods: {
        ...mapActions('opposite', ['getBuyerGroup', 'getMySuppliers']),
        getList() {
            this.isLoading = true
            getList('buyer', this.listQuery).then(res => {
                this.list = res.items
                this.total = res.total
            }).finally(() => {
                this.isLoading = false
            })
        },
        handleFilter() {
            this.listQuery.page = 1;
            this.getList()
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
        handleEdit(id) {
            this.$router.push({ path: "/inquiry/detail/" + id })
        },
        handleStar(id) {
            toggleStar(id).then(({ inquery }) => {
                let index_target = this.list.findIndex(xx => xx.id == inquery.id)
                this.list[index_target]['isstarred'] = inquery['isstarred']
            })
        },

        handleDelete(ids) {
            // console.log(ids)
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
                del(ids).then(re => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'
                    });
                    this.getList()
                })
            }).catch(() => {})
        },
        handleGroupShow(item) {
            this.info.opposite_id = item.company_id
            this.info.opposite_group_id = ''
            this.group_new.name = ''

            const exist_ob = this.my_sellers.find(rr=>rr.opposite.id == item.company_id)
            if(exist_ob) {
                this.info.opposite_group_id = exist_ob.group.id
            }
            this.dialogVisible = true
        },
        setGroup() {

        },
        addNNN() {
            this.$store.dispatch("common/setLoading")
            let da = Object.assign({}, this.info)
            add(da).then(res => {
                this.$notify({
                    title: this.$t('success'),
                    message: this.$t('success.msg'),
                    type: 'success',
                    duration: 1000
                });
                this.getMySuppliers()
                this.dialogVisible = false
            }).finally(() => {
                this.$store.dispatch("common/setLoading", false)
            })
        },
        handleGroupOK() {
            if (this.group_new.name) {
                const exist_name = this.group_for_buyer.find(rr => rr.name == this.group_new.name)
                if (exist_name) {
                    this.info.opposite_group_id = exist_name.id
                    this.group_new.name = ''
                    this.addNNN()
                } else {
                    // upsertGroup(this.group_new).then(res=>{
                    //     this.setGroup()
                    // })
                    const da = {
                        name: this.group_new.name,
                        isbuyer: 0,
                    }
                    upsertGroup(da).then(res => {
                        this.getBuyerGroup().then(() => {
                            const exist_name1 = this.group_for_buyer.find(rr => rr.name == this.group_new.name)
                            this.info.opposite_group_id = exist_name1.id
                            this.addNNN()
                        })
                    })
                }
            }
            else{
                this.addNNN()
            }            
        }
    },

    mounted() {
        this.getList()
        if (!this.hasBuyerGroup) {
            this.getBuyerGroup()
        }
        if(!this.my_sellers.length) this.getMySuppliers()
    }
}
</script>
