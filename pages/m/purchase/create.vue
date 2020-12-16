<template>
<div class="">
    <kuc-page-header :title="$t('purchase.post')"></kuc-page-header>
    <div class="mt-2">
        <div class="bg-white px-2 pb-3">
            <el-form :model="info" class="" label-width="0" ref="form" :rules="rules">
                <el-row class="py-input px-1">
                    <el-col :span="12">
                        <el-radio v-model="info.urgent" :label="0" style="w-50">{{$t('source.post')}}</el-radio>

                    </el-col>
                    <el-col :span="12">
                        <el-radio v-model="info.urgent" :label="1">{{$t('source.urgent')}}</el-radio>
                    </el-col>
                </el-row>
                <ku-line />

                <!-- cate1  -->
                <div class="align-items-center py-1 d-flex">
                    <p class="text-nowrap mr-2">{{$t('cate.one')}}</p>
                    <el-select v-model="info.category_id" :placeholder="$t('select')" class="w-100 text-right" @change="info.cate2=''">
                        <el-option v-for="item in categories" :key="item.id" :label="gsv([$i18n.locale], item.name)" :value="item.id"></el-option>
                    </el-select>
                </div>
                <el-form-item class="ku-only-valid" prop="category_id">
                    <el-input v-model="info.category_id" type="hidden"></el-input>
                </el-form-item>

                <!-- cate2 -->                
                <div class="align-items-center py-1 d-flex">
                    <p class="text-nowrap mr-2">{{$t('cate.one')}}</p>
                    <el-select v-model="info.cate2" :placeholder="$t('select')" class="w-100 text-right" >
                        <el-option v-for="item in category2" :key="item.id" :label="gsv([$i18n.locale], item.name)" :value="item.id"></el-option>
                    </el-select>
                </div>
                <ku-line />

                <!-- title -->
                <el-form-item label="" prop="title">
                    <el-input v-model="info.title" class="text-right" :placeholder="$t('form.input1')">
                        <template slot="prepend">{{$t('purchase')}}{{$t('title')}}</template>
                    </el-input>
                </el-form-item>

                <!-- description -->
                <el-form-item class="mt-1" prop="description">
                    <p>{{$t('content.req')}}</p>
                    <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 15}" maxlength="500" v-model="info.description" show-word-limit :placeholder="$t('form.say')"></el-input>
                </el-form-item>

                <!-- Quantity -->
                <el-form-item label="" prop="quantity">
                    <div class="d-flex">
                        <el-input v-model.number="info.quantity" class="text-right" :placeholder="$t('form.input1')" type="number">
                            <template slot="prepend">{{$t('purchase')}}{{$t('quantity')}}</template>
                        </el-input>
                        <el-select v-model="info.unit_id" :placeholder="$t('select')" class="text-right" style="width:7rem">
                            <el-option v-for="item in units_product" :key="item.id" :label="gsv([$i18n.locale], item.name)" :value="item.id"></el-option>
                        </el-select>
                    </div>

                </el-form-item>

                <!-- 截止时间 deadline -->
                <el-form-item label="">
                    <!-- <el-input v-model="info.date" class="text-right" placeholder="2020-06-11">
                        <template slot="prepend">{{$t('date.i')}}</template>
                    </el-input> -->
                    <div class="d-flex align-items-center justify-content-between">
                        <span class="text-nowrap input-label">{{$t('deadline')}}</span>
                        <el-checkbox v-model="limit_no" @change="handleLimit">{{$t('source.long')}}</el-checkbox>
                        <div class="date-picker-text-right text-nowrap">
                            <el-date-picker v-model="info.delivery_date" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="yyyy-MM-dd" prefix-icon='ee' :editable="false" :picker-options="pickerOptions" :disabled="limit_no"></el-date-picker>
                            <span class=""><i class="el-icon-arrow-right"></i></span>
                        </div>
                    </div>
                </el-form-item>

                <div class="d-flex my-2">
                    <p class="mr-2 text-nowrap">{{$t('product')}}{{$t('image')}}</p>
                    <ku-upload :f_data.sync="img_data" name="files[]" :limit=5 />
                </div>

            </el-form>
        </div>

        <div class="mt-2">
            <div class="text-center p-2">
                <el-button type="danger" round class="my-3" style="width:40%" @click="handleCreate">{{$t('confirm.post')}}</el-button>
                <el-button type="danger" round class="my-3" style="width:40%" plain @click="goBack">{{$t('confirm.cancle')}}</el-button>
            </div>
        </div>

    </div>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { add } from '@/api/my_treasure'

export default {
    name: 'ReleasePurchase',
    middleware: ['authenticated', 'member_0'],    
    data() {
        return {
            info: {
                title: '',
                category_id: '',
                cate2: '',
                description: '',
                urgent: 0,
                quantity: '',
                unit_id: '',
                delivery_date: '',
            },
            limit_no: false,
            pickerOptions: {
                disabledDate(time) {
                    const new_time = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()} 23:59:59`
                    return +new Date(new_time) < Date.now();
                },
            },
            rules: {
                category_id: [{ required: true, message: this.$t('valid.required', [this.$t('cate.one')]), trigger: ['change'] }, ],
                title: [{ required: true, message: this.$t('valid.required', [this.$t('title')]), trigger: ['blur', 'change'] }, ],
                description: [{ required: true, message: this.$t('valid.required', [this.$t('content.req')]), trigger: ['blur', 'change'] }, ],
                quantity: [
                    { required: true, message: this.$t('valid.required', [this.$t('quantity')]), trigger: ['blur', 'change'] },
                    { type: "number", message: this.$t('valid.numeric', [this.$t('quantity')]), trigger: ['blur', 'change'] },
                ]
            },
            img_data: {}
        }

    },
    async asyncData({store}){
        if (!store.state.common.seo)
            await store.dispatch('common/downloadSeo').catch(err=>{
                console.log('seo_err')
            })
    },
    computed: {
        ...mapState('common', {
            categories: state => state.list.categories,
            units_product: state => state.list.product_units
        }),
        category2: function(){
            const kk = this.categories.find(rr=>rr.id == this.info.category_id)
            return this.gsv(['childs'], kk) || []
        },
        seo_path: function(){
            return this.$i18n.locale=='en' ? '/en/purchase' : '/purchase'
        }
    },
    head() {
        return {
            title: this.gsv(['www', this.seo_path, 'title'], this.$store.state.common.seo),
            meta: [
                {
                hid: 'description',
                name: 'description',
                content: this.gsv(['www', this.seo_path, 'description'], this.$store.state.common.seo),
            },
                {
                hid: 'keywords',
                name: 'keywords',
                content: this.gsv(['www', this.seo_path, 'keywords'], this.$store.state.common.seo),
            },
            ]
        }
    }, 
    methods: {
        ...mapActions('common', ['getUnitsList']),
        handleLimit() {
            if (this.limit_no)
                this.info.delivery_date = ''
        },        
        handleCreate() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let ob = this.info
                    let form_s = new FormData()
                    if (this.img_data instanceof FormData) {
                        for (let pp of this.img_data.entries()) {
                            form_s.append(pp[0], pp[1])
                        }
                    }
                    for (const key in ob) {
                        if (ob.hasOwnProperty(key)) {
                            const el = ob[key];
                            form_s.append(key, el)
                        }
                    }
                    // for(let pp of form_s.entries())   
                    // {
                    //     console.log(pp[0], "--", pp[1])
                    // } 

                    add(form_s).then(() => {
                            this.$notify({
                                title: this.$t('success'),
                                message: this.$t('success.add'),
                                type: 'success'
                            });
                            this.goBack()
                        })
                        .catch(error => {
                            console.log("Api failed!", error)
                            this.error = error
                        })
                }
            });
            // this.$refs.upload.submit();
        },        

    },
    mounted() {
        let qq = []
        if (!this.categories.length) qq.push('categories')
        if (!this.units_product.length) qq.push('product_units')
        else this.info.unit_id = this.units_product[0]['id']
        if (qq.length)
            this.getUnitsList(qq).then(()=>{
                this.info.unit_id = this.units_product[0]['id']
            })
    }
}
</script>

<style lang="scss" scoped>
.input-label {
    min-width: 70px;
}
</style>
