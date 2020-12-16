<template>
<div>
    <div class="bg-white">
        <kuc-page-header :title="$t('my_supplier')" to="/my/buy"></kuc-page-header>
        <div class="px-2">
            <el-select v-model="expo_id" placeholder="" @change="getList" class="w-100">
                <el-option key="cate-all" label="选择展览" :value="-1">{{$t('all')}}</el-option>
                <el-option v-for="item in expos" :key="item.id" :label="gsv([$i18n.locale], item.name) " :value="item.id"> </el-option>
            </el-select>
        </div>
    </div>
    <!-- list -->
    <div class="mt-2 px-2 pt-2 bg-white">
        <div v-for="(item, ii) in list" :key="item.id">            
            <div class="d-flex py-2 justify-content-between">
                <div class="d-flex" @click="goCompany(item.company)">
                    <el-image :src="gsv(['logo', 'url'], item.company)" style="width: 17vw; height: 17vw; max-height: 10rem; max-width:10rem" fit="cover" lazy>
                        <div slot="error" class="image-slot">
                            <img src="/files/avatar.png" alt="" class="w-100 fit-cover">
                        </div>
                    </el-image>
                    <div class="d-flex flex-column justify-content-between flex-1 ml-2">
                        <h3 class="text-line-2">{{gsv(['name', $i18n.locale], item.company)}}</h3>
                        <div class="font-09 mt-2">
                            <div class="d-flex text-dark9">
                                <p class="text-nowrap mr-1">{{$t('main.product')}}: </p>
                                <p class="text-line-1"> {{getNames(gsv(['categories'],item.company)) }}</p>
                            </div>
                            <p class="text-dark9">{{$t('expo.no_')}}：{{getPosition(item.company)}} </p>
                        </div>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <p class="p-2 text-dark9 font-12" @click="handleDelete(item.id, ii)"><i class="el-icon-delete"></i></p>
                </div>
            </div>
            <ku-line v-if="ii < (list.length-1)"/>
        </div>
        <ku-loading-no-data :active="is_loading" :total="list.length" />
    </div>

</div>
</template>

<script>
import { getBuyerExpoList } from "~/api/expo"
import { getVisitList, delVisitList } from "~/api/company"

export default {
    middleware: 'authenticated',
    head() {
        return {
            title: this.$t('my_supplier')
        }
    },
    data() {
        return {
            is_loading: true,
            total: 0,
            list: [],
            expo_id: -1,
            listQuery: {
                page: 1,
                limit: 10
            },
            expos: []
        }
    },
    computed: {
        langkey: function () {
            return "logo_mobile_" + this.$i18n.locale
        },
    },
    methods: {
        getList() {
            let params = Object.assign({}, this.listQuery)
            const expo_id = this.expo_id || -1
            if (!this.expos.length) params.with_expos = true
            getVisitList(params, expo_id).then(res => {
                this.list = res.items
                this.total = res.total
                if (res.expos) this.expos = res.expos
                this.expo_id = parseInt(res.expo_id)
            }).finally(() => {
                this.is_loading = false
            })
        },
        handleDelete(id, index) {
            console.log(id, index)
            delVisitList(id).then(() => {
                this.list.splice(index, 1)
                this.$notify({
                    title: this.$t('success'),
                    message: this.$t('success.del'),
                    type: 'success'
                });
            })
            // this.$router.push({ path: "/my/inquiry/" + id })
        },
        goCompany(item) {
            this.$router.push({ path: this.getSeoCompany(item) })
        },
        getPosition(company) {
            const halls = this.gsv(['cur_expos', 0, 'halls'], company) || []
            return halls.join(', ')
        }
    },
    mounted() {
        // getBuyerExpoList().then(res => {
        //     this.expos = res.expos
        // })
        this.getList()
    }
}
</script>
