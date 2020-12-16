<template>
<div>
    <!-- header -->
    <div class="bg-white">
        <kuc-page-header :title="$t('my_supplier1')" class="border-bottom" style="border-bottom-color: #f7f7f7 !important"></kuc-page-header>
        <div class="d-flex justify-content-between align-items-center px-2">
            <el-select v-model="listQuery.filter_group_id" placeholder="" style="width: 7rem" @change="handleFilter">
                <el-option key="cate-all" :label="$t('group.i')" value="">{{$t('all')}}</el-option>
                <el-option v-for="item in group_for_buyer" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
            <div class="d-flex align-items-center">
                <nuxt-link to="/my/buy/supplier/new" class="btn-sm border py-1 px-2 rounded text-center border-danger text-white text-nowrap bg-danger mr-3">
                    {{$t('add')}}
                </nuxt-link>
                <nuxt-link to="/my/buy/supplier/group" class="btn-sm border border-danger text-center py-1 px-2 rounded text-nowrap text-danger">
                    {{$t('group.manage')}}
                </nuxt-link>
            </div>
        </div>

    </div>
    <div class="mt-2 bg-white px-2">
        <div v-for="item in list" :key="item.id">
            <div class="py-2">
                <h3 @click="goDetail(item.opposite.id)">{{gsv(['name', $i18n.locale], item.opposite)}}</h3>
                <div class="d-flex justify-content-between mt-2 text-dark9">
                    <p class="text-nowrap">{{gsv(['name'], item.group)}}</p>
                    <div class="d-flex align-items-center">
                        <div class="btn-sm border py-1 rounded text-center mr-2 px-2" @click="handleContact(item.opposite.user)">
                            {{$t('msg.send')}}
                        </div>
                        <div class="btn-sm border py-1 rounded text-center mr-2 px-2"  @click="handleEdit(item.id)">
                            {{$t('set')}}
                        </div>
                        <div class="btn-sm border py-1 rounded text-center border-danger text-white bg-danger" @click="handleDelete(item.id)">
                            {{$t('del')}}
                        </div>
                    </div>
                </div>
            </div>
            <ku-line />
        </div>
        <ku-loading-no-data :active="isLoading" :total="total" />
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getList, del } from '@/api/opposite'

export default {
    middleware: ['authenticated'],
    name: "Buyer",
    head() {
        return {
            title: this.$t('my_supplier1')
        }
    },
    data() {
        return {
            isLoading: true,
            total: 0,
            list: [],
            listQuery: {
                limit: 10,
                page: 1,
                filter_group_id: ''
            }
        }
    },
    computed: {
        ...mapState('opposite', ['group_for_buyer']),
        ...mapGetters('opposite', ['hasBuyerGroup']),
    },
    methods: {
        ...mapActions('opposite', ['getBuyerGroup']),
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
        handleEdit(id) {
            this.$router.push({ path: '/my/buy/supplier/' + id })
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
                del([id]).then(() => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'

                    });
                    const del_index = this.list.findIndex(xx => xx.id == id)
                    this.list.splice(del_index, 1)
                })
            }).catch(() => {})
        },
        goDetail(company_id){
            this.$router.push({path: '/company/'+company_id})
        },
        handleContact(user) {
            if (user) {                
                const to = user.email || user.phone
                const name = this.gsv(['name', this.$i18n.locale], user) || ''
                const uid = user.id
                
                this.$router.push({ path: `/message/new`, query: { uid, to, name } }) 
            }
        },
    },
    mounted() {
        if (!this.hasBuyerGroup) {
            this.getBuyerGroup()
        }
        this.getList()
    }
}
</script>

<style lang="scss" scoped>
.btn-sm {
    min-width: 5.5rem;
    width: max-content;
}
</style>
