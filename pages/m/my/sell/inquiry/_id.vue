<template>
<div>
    <kuc-page-header :title="$t('xunpan.my')"></kuc-page-header>
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0">
        <div class="bg-white mt-1 pb-2">
            <div class="p-2">
                <div class="p-2 d-flex" style="background-color:#F7F7F7;">
                    <img :src="getImg1(product_info.assets)" alt=" " width="60" height="60" class="rounded bg-white">
                    <div class="text-dark6 font-09 ml-1 flex-1 pr-3">
                        <div class="d-flex">
                            <p class="item-key text-nowrap">{{$t('product')}}{{$t('name1')}}：</p>
                            <p>{{gsv([$i18n.locale], product_info.name)}}</p>
                        </div>
                        <div class="d-flex">
                            <p class="item-key">{{$t('company')}}：</p>
                            <p>{{gsv(['name', $i18n.locale], product_info.company)}}</p>
                        </div>
                        <div class="d-flex">
                            <p class="item-key">{{$t('recipient')}}：</p>
                            <p>{{gsv(['name', $i18n.locale], product_info.user)}}</p>
                        </div>
                    </div>
                </div>

                <div class="info-container font-09">
                    <div class="d-flex my-2 align-items-end">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('recipient')}}: </p>
                        <div class="d-flex align-items-end justify-content-between flex-1">
                            <p> 王小蒙 2020.05.26 11:24 </p>
                            <el-button type="primary" @click="handleAdd" size="small">{{$t('supplier.add')}}</el-button>

                        </div>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">收件公司: </p>
                        <p> 宁波中博有限责任公司</p>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('contact')}}{{$t('phone')}}: </p>
                        <p> 13502351563</p>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('contact')}}{{$t('mobile')}}: </p>
                        <p>13502351563</p>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('contact')}}{{$t('phone')}}: </p>
                        <p>询问有关DZ-700包装机</p>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('topic')}}: </p>
                        <p>冷面真空包装机 </p>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('want.i')}}: </p>
                        <p>型号内容</p>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('content.i')}}: </p>
                        <p>内容内容内容内容内容内容内容内容</p>
                    </div>
                    <div class="d-flex my-2 align-items-center">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('attachment')}}: </p>
                        <img :src="product_info.img" alt=" " width="60" height="60" class="rounded">
                    </div>
                </div>

                <div class="mt-4">
                    <div class="d-flex justify-content-between">
                        <h3>王小蒙{{$t('reply')}}</h3>
                        <p>2020.05.26 11:24</p>
                    </div>
                    <div class="font-09">
                        <div class="d-flex my-2">
                            <p class="text-nowrap mr-1 text-dark9">{{$t('topic')}}: </p>
                            <p>冷面真空包装机 </p>
                        </div>
                        <div class="d-flex my-2">
                            <p class="text-nowrap mr-1 text-dark9">{{$t('content.i')}}: </p>
                            <p>内容内容内容内容内容内容内容内容</p>
                        </div>
                        <div class="d-flex my-2 align-items-center">
                            <p class="text-nowrap mr-1 text-dark9">{{$t('attachment')}}: </p>
                            <img :src="product_info.img" alt=" " width="60" height="60" class="rounded">
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div class="px-2 bg-white mt-2">
            <!-- 公司网址  -->
            <el-form-item label="">
                <el-input v-model="info.name" class="text-right" placeholder="">
                    <template slot="prepend">{{$t('topic')}}</template>
                </el-input>
            </el-form-item>

            <!-- description -->
            <el-form-item class="ku-no-after">
                <p>{{$t('content.i')}}</p>
                <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" maxlength="500" show-word-limit v-model="info.desc" :placeholder="$t('form.say')"></el-input>
            </el-form-item>

            <div>
                <p class="mt-2">{{$t('attachment')}}</p>
                <div class="py-2">
                    <el-upload ref="upload_banner" action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :auto-upload="false" accept=".png, .jpg, .jpeg, .bmp, .svg">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </div>
            </div>

        </div>

    </el-form>
    <div class="text-center mt-3 mb-4">
        <el-button type="primary" @click="handleSubmit" class="w-75" round="">{{$t('reply')}}</el-button>
    </div>

</div>
</template>

<script>
import { getDetail } from '@/api/inquire'
import { treasureDetail } from '@/api/common'
export default {
    name: "MyQuestionDetail",
    head(){
        return {
            title: this.$t('xunpan.my')
        }
    },
    data() {
        return {
            product_info: {},
            info: {
                name: '',
                desc: '',
                gender: 0,
                company: '',
                landline: '',
                mobile: '',
                address: '',
                checkboxHopes: []
            },
            temp: {},
            rules: {
                name: [{ required: true, message: this.$t('valid.required', [this.$t('name')]), trigger: ['blur', 'change'] },
                    { min: 2, max: 15, message: this.$t('valid.between.string', [this.$t('name'), 2, 15]), trigger: ['blur', 'change'] },

                ],
                email: [{ type: 'email', message: this.$t('valid.email', [this.$t('email')]), trigger: ['blur', 'change'] }, ],
                mobile: [{ required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur', 'change'] },
                    { min: 11, max: 15, message: this.$t('valid.between.string', [this.$t('mobile'), 11, 15]), trigger: ['blur', 'change'] },
                ]
            },
        }
    },
    // async asyncData({ params }) {
    //     const r_details = await treasureDetail(params)
    //     return {
    //         product_info: r_details,
    //     }
    // },
    methods: {
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    // info save api                    
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.msg'),
                        type: 'success'
                    });
                    // this.$router.push({ path: '/pricing/pay' })
                } else {
                    return false;
                }
            });

        },
        handleAdd() {
            this.$router.push({ path: '/my/sell/inquiry/new_group' })
        }

    }

}
</script>

<style lang="scss" scoped>
.item-key {
    width: 5rem;
    text-align: right;
}

.info-container {
    >div p:first-child {
        min-width: 5.3rem;
        text-align: right;
    }
}
</style>
