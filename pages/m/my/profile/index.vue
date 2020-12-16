<template>
<div>
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0">
        <div class="bg-white px-2">
            <div class="d-flex align-items-center justify-content-between py-input avatar-div">
                <p>{{$t('update.avatar')}}</p>
                <ku-upload-avatar :avatar_pre.sync="avatar_pre" :f_data.sync="avatar" />
            </div>
            <ku-line />
            <!-- prop="name_cn" -->
            <el-form-item>
                <el-input v-model="info.name" class="text-right" placeholder="中国名字">
                    <template slot="prepend">{{$t('name')}}</template>
                </el-input>
            </el-form-item>            

            <!-- 性别 sex -->            
            <ku-sex v-model="info.gender"/>
            <ku-line />
            <!-- 手机  -->
            <el-form-item>
                <el-input v-model.number="info.phone" class="text-right" placeholder="156-867-660660" readonly type="number">
                    <ku-mobile slot="prepend" :mobile_code.sync="info.phone_prefix" />
                    <template slot="append"><span class="text-danger" @click="updateMobileEmail('phone')">{{$t('update')}}</span></template>
                </el-input>
            </el-form-item>
            <!-- 邮箱  -->
            <el-form-item>
                <el-input v-model="info.email" class="text-right" placeholder="happy@sina.com" readonly>
                    <template slot="prepend">{{$t('email')}}</template>
                    <template slot="append"><span class="text-danger" @click="updateMobileEmail('email')">{{$t('update')}}</span></template>

                </el-input>
            </el-form-item>

            <el-form-item label="">
                <el-input v-model="info.wechat" class="text-right" placeholder="happy@sina.com">
                    <template slot="prepend">{{$t('wechat')}}</template>
                </el-input>
            </el-form-item>
            <el-form-item label="" class="ku-no-after">
                <el-input v-model="info.qq" class="text-right" placeholder="happy@sina.com">
                    <template slot="prepend">QQ</template>
                </el-input>
            </el-form-item>            

        </div>        
        <div class="text-center">
            <div class="my-4">
                <el-button type="primary" @click="handleSubmit" class="w-75" round>{{$t('save.setting')}}</el-button>
            </div>
            <p v-if="$i18n.locale=='zh'">还没认证企业，<nuxt-link to="/pricing" class="text-danger">前去认证</nuxt-link></p>
            <p v-else>Not verified, <nuxt-link to="/pricing" class="text-danger">verify now.</nuxt-link></p>
            
        </div>

        <div class="text-center py-2">
            <nuxt-link to="/about-us" class="text-danger">关于蚂蚁街</nuxt-link>
        </div>

    </el-form>
    
</div>
</template>

<script>
import { getInfo, updateUser } from "@/api/user"
export default {
    name: 'Profile',
    middleware: ['authenticated'],
    components: {},
    data() {
        return {
            info: {
                name: this.gsv([this.$i18n.locale], this.$store.state.auth.name),
                // name_en: this.$store.state.auth.name.en,
                gender: this.$store.state.auth.gender || 0,
                phone_prefix: this.$store.state.auth.phone_prefix || '86',
                phone: this.$store.state.auth.phone ? parseInt(this.$store.state.auth.phone) : '',
                email: this.$store.state.auth.email || '',
                address: '',
                wechat: '',
                qq: ''
            },
            avatar: '',
            avatar_pre: this.$store.state.auth.avatar.url  || '/files/avatar.png',
            rules: {
                name: [{ required: true, message: this.$t('valid.required', [this.$t('name')]), trigger: ['blur', 'change'] }, ],
                email: [{ type: 'email', message: this.$t('valid.email', [this.$t('email')]), trigger: ['blur', 'change'] }, ],
                phone: [
                    { required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur', 'change'] }, 
                    ],
            },
        }
    },
    methods: {

        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    let ob = Object.assign({}, this.info)
                    delete ob.name
                    ob['name_'+this.$i18n.locale] = this.info.name
                    let form_s = new FormData()
                    if (this.avatar instanceof FormData) {
                        form_s = this.avatar
                    }
                    for (const key in ob) {
                        if (ob.hasOwnProperty(key)) {
                            const el = ob[key];
                            form_s.append(key, el)
                        }
                    }
                    this.$store.dispatch("common/setLoading")
                    updateUser(form_s).then(response => {
                        this.$store.dispatch('setUserAuth', response.user)
                        this.$notify({
                            title: this.$t('success'),
                            message: this.$t('success.msg'),
                            type: 'success'
                        });
                        this.goBack()
                    }).finally(()=>{
                        this.$store.dispatch("common/setLoading", false)
                    })
                } else {
                    return false;
                }
            });

        },
        updateMobileEmail(mobile_email){            
            this.$router.push({path: `/my/profile_update/${mobile_email}`})
        }
    },
    mounted() {
        getInfo(this.$store.state.auth.id).then(response => {
            this.avatar_pre = this.gsv(['avatar', 'url'], response.user) || ''
            this.info.wechat = response.user.wechat || ''
            this.info.qq = response.user.qq || ''
            this.$store.dispatch('setUserAuth', response.user)
        })
    }
}
</script>