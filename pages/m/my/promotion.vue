<template>
<div>
    <kuc-page-header :title="$t('promotion.my')" to="/my" class="border-bottom"></kuc-page-header>

    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0">
        <div class="bg-white px-2">
            <div class="py-input text-center">
                <strong class="text-danger">{{$t('msg.promotion', [promotion_invitation_money])}}</strong>
            </div>
            <ku-line />

            <!-- mode (0:SMS, 1:email) -->
            <div class="d-flex align-items-center">
                <p>{{$t('invite_way')}}</p>
                <el-select v-model="info.sendmode" placeholder="邀请方式" class="flex-1 text-right" @change="info.contact=['']">
                    <el-option v-for="item in [{id:'0', name: $t('invite_sms')}, {id: 1, name:$t('invite_email')}]" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </div>
            <ku-line />

            <!-- 手机  -->
            <div class="d-flex">
                <p class="text-nowrap pr-2 py-input">{{$t("invite_person")}}</p>
                <div class="flex-1">
                    <div v-for="ii in info.contact.length" :key="ii">
                        <div class="d-flex align-items-center" :class="{'border-bottom': ii!=info.contact.length}">
                            <el-input v-model="info.contact[ii-1]" 
                            :placeholder="info.sendmode!=1 ? $t('form.input_mobile') : $t('form.input_email')" 
                            :type="info.sendmode==1 ? 'text' : 'number'"
                            :class="{'text-del': list_failed.includes(info.contact[ii-1])}"
                            >
                            </el-input>
                            <p class="text-nowrap py-input text-danger" v-if="ii==info.contact.length" @click="handleAddSingup(ii)">{{$t("add")}}</p>
                            <p class="text-nowrap py-input text-danger" v-else @click="handleRemoveSingup(ii-1)">
                                <i class="el-icon-close"></i>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="el-form-item__error" v-if="error.contact">{{error.contact}}</div>
            <ku-line />

            <!-- lang -->
            <!-- <div class="d-flex align-items-center">
                <p>{{$t('invite_content')}}</p>
                <el-select v-model="info.lang" placeholder="邀请信息" class="flex-1 text-right">
                    <el-option v-for="item in [{id:'zh', name: $t('lang.zh')}, {id: 'en', name:$t('lang.en')}]" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </div>
            <ku-line /> -->

            <!-- content -->
            <!-- <el-form-item prop="content" class="ku-no-after">
                <el-input v-model="info.content" type="textarea" :placeholder="$t('msg.invite_friend', [gsv(['name', $i18n.locale], $store.state.auth)])" class="mt-2"></el-input>
            </el-form-item> -->

            <div class="text-center">
                <div class="pb-3 pt-3">
                    <el-button type="primary" @click="handleSubmit" class="w-50" round>{{$t('invite_now')}}</el-button>
                </div>
            </div>

        </div>
        <div class="d-flex justify-conent-between align-items-end">
            <ku-title-line class="px-2 flex-1">{{$t('history.promotion')}} ({{total}})</ku-title-line>
            <p class="px-2">奖励合计: <strong class="text-danger font-11">{{total_price}}元</strong> </p>
        </div>
        <div class="bg-white px-2">
            <div v-for="item in list" :key="item.id">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <div>
                        <h4>{{gsv(['name', $i18n.locale], item.contact_user) || $t('name')}}, {{item.contact}}</h4>
                        <p class="text-dark9 font-09 mt-2">{{parseTime(item.created_at)}}</p>
                    </div>
                    <p v-if="item.status==0">{{$t('status.on')}}</p>
                    <p v-else-if="item.status==1" class="text-danger">{{$t('status.registered_but_not_verified')}}</p>
                    <p v-else-if="item.status==2" class="text-danger">{{$t('status.verified')}}</p>
                </div>
                <ku-line />
            </div>
            <ku-loading-no-data :active="isLoading" :total="total"></ku-loading-no-data>
        </div>

    </el-form>
</div>
</template>

<script lang="zh">
import { mapState, mapActions, mapGetters } from 'vuex'
import { add, getList, validUnique } from "@/api/promotion"
export default {
    middleware: 'authenticated',
    name: 'MyPromotion',
    head() {
        return{
            title: this.$t('promotion.my')      
        }
    },
    data() {
        return {
            info: {
                sendmode: '0',
                contact: [''],
                lang: this.$i18n.locale,
                // content: '',
            },
            rules: {
                // content: [{ required: true, message: this.$t('valid.required', [this.$t('content.i')]), trigger: ['blur'] }, ],
            },
            isLoading: true,
            total: 0,
            list: [],
            error: {
                contact: false
            },
            list_failed: [],
            verify_tried: false
        }
    },
    computed:{
        ...mapState('common', ['promotion_invitation_money']),
        total_price: function () {
            const real_price_list = this.list.filter(rr=>rr.status==2)
            return real_price_list.length * this.promotion_invitation_money
        }
    },
    methods: {
        getList() {
            this.isLoading = true
            getList().then(res => {
                this.total = res.total
                this.list = res.items
                this.$store.commit('common/SET_PRICE_INVITE', res.promotion_invitation_money)
            }).finally(()=>{
                this.isLoading = false
            })
        },
        removeEmptyContact() {
            const kk = this.info.contact.filter(rr => rr != '' && !this.list_failed.includes(rr))
            let new_data = []
            kk.forEach(el => {
                let f_exist = false
                const el_t = el.trim()
                this.list.forEach(li => {
                    if (el_t == li.contact) {
                        f_exist = true
                    }
                });
                if (!f_exist && !new_data.includes(el_t)) new_data.push(el_t)

            });
            this.info.contact = new_data.length ? new_data : ['']
        },
        validContact(remove = true) {
            if (remove)
                this.removeEmptyContact()
            let real_v = this.info.contact.filter(rr => rr != '')
            if (!real_v.length) {
                this.error.contact = this.$t('valid.required', [this.$t('invite_person')])
                this.verify_tried = false
                return false
            } else {
                this.error.contact = false
                if (this.info.sendmode == 1){
                    this.info.contact.forEach(el => {
                        const valid_email = this.validEmail(el)
                        if (!valid_email) this.error.contact = this.$t('valid.email', [el])
                    });
                }else{
                    this.info.contact.forEach(el => {
                        if (el.length<11) this.error.contact = this.$t('valid.min.string', [el, 11])
                    });
                }
                if (this.error.contact) return false
            }
            return true
        },
        handleRemoveSingup(ind) {
            // delete this.info.signup_names[ind]
            let new_arr = []
            this.info.contact.forEach((element, ii) => {
                if (ii != ind)
                    new_arr.push(element)
            });
            if (new_arr.length==1 && this.error.contact) this.verify_tried = false
            this.info.contact = new_arr
        },
        handleAddSingup(ii) {
            if (this.info.contact[ii-1] && this.validContact(false)){
                this.info.contact.push('')
                if (!this.list_failed.includes(this.info.contact[ii-1])){
                    this.verify_tried = true

                    let f_exist = false
                    const el_t = this.info.contact[ii-1].trim()
                    this.list.forEach(li => {
                        if (el_t == li.contact) {
                            f_exist = true
                            this.list_failed.push(this.info.contact[ii-1])
                        }
                    });
                    if (!f_exist){
                        validUnique(this.info.contact[ii-1]).then(res=>{
                            if(res.already_exist) this.list_failed.push(this.info.contact[ii-1])
                        })
                    }
                }
            }
        },
        handleDelete() {

        },
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid && this.validContact()) {
                    if (!this.verify_tried) {
                        validUnique(this.info.contact[0]).then(res=>{
                            if(res.already_exist) this.list_failed.push(this.info.contact[0])
                            return false
                        })
                    }
                    this.$store.dispatch("common/setLoading")
                    add(this.info).then(() => {
                        this.getList()
                        this.info.contact = ['']
                    }).finally(() => {
                        this.$store.dispatch("common/setLoading", false)
                    })
                }
            });
        },

    },
    mounted() {
        this.getList()
    }
}
</script>

<style lang="scss" scoped>

</style>>
