<template>
<div class="mt-2">
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" class="bg-white p-2">

        <el-form-item prop="name_zh">
            <el-input v-model="info.name_zh" class="text-right" :placeholder="$t('form.input')">
                <template slot="prepend">{{$t('cate.name')}}（{{$t('lang.zh')}}）</template>
            </el-input>
        </el-form-item>

        <el-form-item prop="name_en">
            <el-input v-model="info.name_en" class="text-right" :placeholder="$t('form.input')">
                <template slot="prepend">{{$t('cate.name')}}（{{$t('lang.en')}}）</template>
            </el-input>
        </el-form-item>

        <div class="text-center pt-2 my-3">
            <el-button type="primary" @click="handleSubmit" class="w-50" round="">{{$t(btn_title)}}</el-button>
        </div>
    </el-form>
    <ku-title-line class="px-2">{{$t('cate.custom_list')}}</ku-title-line>
    <div class="bg-white px-2 pt-1">
        <!-- <no-data v-if="!category_me.length"></no-data> -->
        <div class="mt-2" v-for="(item, ii) in category_me" :key="item.id">
            <div class="d-flex justify-content-between">
                <div class="flex-1">
                    <h3>{{item.name[$i18n.locale]}}</h3>
                    <p class="text-dark9  mt-1">{{$t('product')}}{{$t('quantity')}}：{{item.product_count}}</p>
                </div>
                <el-button type="text" @click="handleEdit(item)" class="p-2 font-11 text-dark9">
                    <svg-icon name="edit-1"></svg-icon>
                </el-button>
                <el-button type="text" @click="handleDelete(item.id, ii)" 
                :disabled="!!item.product_count" 
                :icon="item.product_count ? 'el-icon-delete p-2 font-11 text-darkC' : 'el-icon-delete p-2 font-11 text-dark9'"></el-button>
            </div>
            <ku-line />
        </div>
        <no-data v-if="!category_me.length" />
    </div>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { myCateAdd, myCateDel, myCateUpdate } from '@/api/product'
export default {
    middleware: ['authenticated', 'member_2'],
    name: "ProductCateManage",
    components: {},
    data() {
        return {
            info: {
                id: null,
                name_en: '',
                name_zh: '',
            },
            btn_title: "cate.custom_add",
            rules: {
                name_zh: [{ required: true, message: this.$t('valid.required', [this.$t('name')]), trigger: ['blur', 'change'] }, ],
                name_en: [{ required: true, message: this.$t('valid.required', [this.$t('name')]), trigger: ['blur', 'change'] }, ],
            }
        }
    },
    computed: {
        ...mapState('common', { category_me: state => state.list.product_custom_categories }),

    },
    methods: {
        ...mapActions('common', ['getUnitsList']),
        handleSelect() {

        },
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    if (this.btn_title == "cate.custom_add") {
                        delete this.info.id
                        myCateAdd(this.info).then(res => {
                            this.$notify({
                                title: this.$t('success'),
                                message: this.$t('success.add'),
                                type: 'success'
                            });
                            this.info.name_zh = ""
                            this.info.name_en = ""
                            this.getUnitsList(['product_custom_categories'])
                            this.$refs["dataForm"].resetFields();
                        })
                    } else {
                        myCateUpdate(this.info).then(res => {
                            this.$notify({
                                title: this.$t('success'),
                                message: this.$t('success.updated'),
                                type: 'success'
                            });
                        }).finally(() => {
                            delete this.info.id
                            this.info.name_zh = ""
                            this.info.name_en = ""
                            this.btn_title = 'cate.custom_add'
                            this.getUnitsList(['product_custom_categories'])
                            this.$refs["dataForm"].resetFields();
                        })

                    }

                } else {
                    return false;
                }
            });
        },
        handleEdit(item) {
            this.info.id = item.id
            this.info.name_zh = item.name.zh
            this.info.name_en = item.name.en
            this.btn_title = "cate.custom_update"
        },
        handleDelete(id, index) {
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
                myCateDel(id).then(re => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'

                    });
                    this.getUnitsList(['product_custom_categories'])
                })
            }).catch(() => {})
        }

    },
    mounted() {
        this.getUnitsList(['product_custom_categories'])
    }
}
</script>

<style lang="scss" scoped>

</style>
