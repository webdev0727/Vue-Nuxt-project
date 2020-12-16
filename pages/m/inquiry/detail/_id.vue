<template>
<div>
    <kuc-page-header :title="$t('xunpan.my')"></kuc-page-header>
    <el-form ref="dataForm" :rules="rules" :model="info_reply" label-position="left" label-width="0" v-if="info.id">
        <div class="bg-white mt-1 pb-2">
            <div class="p-2">
                <div class="p-2 d-flex" style="background-color:#F7F7F7;">
                    <ku-media-box v-if="gsv(['assets', 0], info.product)" :assets="gsv(['assets'], info.product)" :limit="1" key="laksjdflkasjdf"></ku-media-box>
                    <svg-icon name='no-data' width='100' height="50" v-else></svg-icon>
                    <div class="text-dark6 font-09 ml-1 flex-1 pr-3">
                        <div class="d-flex">
                            <p class="item-key text-nowrap">{{$t('product')}}{{$t('name1')}}：</p>
                            <p>{{gsv(['name', $i18n.locale], info.product)}}</p>
                        </div>
                        <div class="d-flex">
                            <p class="item-key">{{$t('company')}}：</p>
                            <p>{{gsv(['company', 'name', $i18n.locale], info.receiver)}}</p>
                        </div>
                        <div class="d-flex">
                            <p class="item-key">{{$t('recipient')}}：</p>
                            <p>{{gsv(['name', $i18n.locale], info.receiver)}}</p>
                        </div>
                    </div>
                </div>

                <div class="info-container font-09">
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('recipient')}}: </p>
                        <div class="d-flex align-items-start justify-content-between flex-1">
                            <p> {{gsv([_type, 'name', $i18n.locale], info)}} {{parseTime(info.created_at, '{y}-{m}-{d} {h}:{i}')}} </p>
                            <el-button type="primary" v-if="_type=='sender'" @click="handleAdd" :disabled="my_buyer.includes(info.sender.id)" size="small">{{$t('buyer.add')}}</el-button>
                            <el-button type="primary" v-else @click="handleAdd" size="small" :disabled="my_suppliers.includes(info.receiver.id)">{{$t('supplier.add')}}</el-button>

                        </div>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">收件公司: </p>
                        <p> {{gsv([_type, 'company', 'name', $i18n.locale], info)}}</p>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('contact')}}{{$t('phone')}}: </p>
                        <p> {{gsv([_type, 'company', 'phone'], info)}}</p>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('contact')}}{{$t('mobile')}}: </p>
                        <p>{{gsv([_type, 'phone'], info)}}</p>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('topic')}}: </p>
                        <p>{{info.title}} </p>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('want.i')}}: </p>
                        <p>{{tags}}</p>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('content.i')}}: </p>
                        <p>{{info.description}}</p>
                    </div>
                    <!-- <div class="d-flex my-2 align-items-center">
                        <p class="text-nowrap mr-1 text-dark9">{{$t('attachment')}}: </p>
                        <img src="info.product" alt=" " width="60" height="60" class="rounded">
                    </div> -->
                </div>

                <div class="mt-4" v-for="item in info.thread" :key="item.id">
                    <div class="d-flex justify-content-between">
                        <h3>{{item.user_id == $store.state.auth.id ? $t('my'): gsv(['user', 'name', $i18n.locale], item)}}{{$t('reply')}}</h3>
                        <p>{{parseTime(item.created_at)}}</p>
                    </div>
                    <div class="font-09">
                        <div class="d-flex my-2">
                            <p class="text-nowrap mr-1 text-dark9">{{$t('topic')}}: </p>
                            <p>{{item.title}} </p>
                        </div>
                        <div class="d-flex my-2">
                            <p class="text-nowrap mr-1 text-dark9">{{$t('content.i')}}: </p>
                            <p>{{item.content}}</p>
                        </div>
                        <div class="d-flex my-2 align-items-center" v-if="item.files.length">
                            <p class="text-nowrap mr-1 text-dark9">{{$t('attachment')}}: </p>
                            <ku-media-box :assets="item.files" :key="item.id"></ku-media-box>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div class="px-2 bg-white mt-2">
            <!-- 公司网址  -->
            <el-form-item prop="title">
                <el-input v-model="info_reply.title" class="text-right" placeholder="">
                    <template slot="prepend">{{$t('topic')}}</template>
                </el-input>
            </el-form-item>

            <!-- description -->
            <el-form-item class="ku-no-after" prop="content">
                <p>{{$t('content.i')}}</p>
                <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" maxlength="500" show-word-limit v-model="info_reply.content" :placeholder="$t('form.say')"></el-input>
            </el-form-item>

            <div>
                <p class="mt-2">{{$t('attachment')}}</p>
                <div class="py-2">
                    <ku-upload :f_data.sync="files1" name="files[]" ref="upload_gallery" :limit=5></ku-upload>
                </div>
            </div>

        </div>

    </el-form>
    <div class="text-center mt-3 mb-4" v-if="info.product">
        <el-button type="primary" @click="handleSubmit" class="w-75" round="">{{$t('reply')}}</el-button>
    </div>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getDetail, reply } from '@/api/inquire'
export default {
    middleware: ['authenticated', 'member_0'],
    name: "MyQuestionDetail",
    components: {},
    data() {
        return {
            info: {},
            info_reply: {
                inquery_id: this.$route.params.id,
                title: '',
                content: '',
            },
            temp: {},
            files1: '',
            rules: {
                title: [{ required: true, message: this.$t('valid.required', [this.$t('topic')]), trigger: ['blur', 'change'] }, ],
                content: [{ required: true, message: this.$t('valid.required', [this.$t('content.i')]), trigger: ['blur', 'change'] }, ],
            },
        }
    },
    computed: {
        ...mapGetters('opposite', ['my_buyer', 'my_suppliers']),
        tags: function () {
            let product_tags = this.info.inqueryitems || []
            let tags_arr = []
            product_tags.forEach(element => {
                tags_arr.push(element.name)
            });
            return tags_arr.join(', ')
        },
        /* 
            _type='sender': I want to sell
            _type='receiver': I want to buy
        */
        _type: function(){
            let is_m = 'sender'
            if (this.$store.state.auth.id == this.info.user_id) is_m = 'receiver'
            return is_m
        }
    },
    methods: {
        ...mapActions('opposite', ['getMyBuyers', 'getMySuppliers']),
        getList() {
            getDetail(this.$route.params.id).then(({ inquery }) => {
                if (inquery){
                    this.info = inquery
                    // if _typ==receiver
                    if (this.$store.state.auth.id == this.info.user_id){
                        // get my sellers
                        // if (!this.my_suppliers.length) 
                            this.getMySuppliers()
                    }else{
                        // get my buyers
                        // if (!this.my_buyer.length) 
                            this.getMyBuyers()
                    }
                }
                else
                    this.goBack()
            }).catch(()=>{
                this.goBack()
            })
        },
        resetInfo() {
            this.info_reply.title = ''
            this.info_reply.content = ''
            this.$refs.upload_gallery.clearFiles()
            this.$refs['dataForm'].resetFields();
        },
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    // info save api
                    let form_s = new FormData()
                    if (this.files1 instanceof FormData) {
                        for (let pp of this.files1.entries()) {
                            form_s.append(pp[0], pp[1])
                        }
                    }
                    let ob = Object.assign({}, this.info_reply)
                    for (const key in ob) {
                        if (ob.hasOwnProperty(key)) {
                            form_s.append(key, ob[key])
                        }
                    }
                    reply(form_s).then(res => {
                        this.getList()
                        this.$notify({
                            title: this.$t('success'),
                            message: this.$t('success.msg'),
                            type: 'success'
                        });
                        this.resetInfo()
                    })
                    // this.$router.push({ path: '/pricing/pay' })
                } else {
                    return false;
                }
            });

        },
        handleAdd() {
            if (this._type=='sender'){
                this.$router.push({ path: '/my/sell/buyer/new', query: {to: this.info.sender.id} })
            }else{
                this.$router.push({ path: '/my/buy/supplier/new', query: {to: this.info.receiver.company_id} })
            }
        }

    },
    mounted() {
        this.getList()
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
