<template>
<div>
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0">
        <div class="bg-white px-2 pt-2">
            <h3>{{$t('company')}}{{$t('info.basic')}}</h3>
            <div class="d-flex align-items-center">
                <p>{{$t('company')}}logo</p>
                <div class="py-2 ml-2">
                    <ku-upload-avatar :avatar_pre.sync="logo_pre" name="logo" :f_data.sync="logo_file" :rounded="false" />
                </div>
            </div>
            <ku-line />

            <el-form-item prop="company.zh">
                <el-input v-model="info.company.zh" class="text-right" placeholder=" ">
                    <template slot="prepend">{{$t('company.name')}}（{{$t('lang.zh')}}）</template>
                </el-input>
            </el-form-item>

            <el-form-item prop="company.en">
                <el-input v-model="info.company.en" class="text-right" placeholder=" ">
                    <template slot="prepend">{{$t('company.name')}}（{{$t('lang.en')}}）</template>
                </el-input>
            </el-form-item>

            <!-- 展位号 -->
            <div class="align-items-center py-1 d-flex">
                <p class="text-nowrap mr-2">{{$t('expo.no_')}}</p>
                <el-cascader v-model="info.hallname" :options="expo_halls" :props="hall_props" clearable class="flex-1" @change="validHall"></el-cascader>
            </div>
            <!-- <div class="el-form-item__error" v-if="error.hall">{{error.hall}}</div> -->
            <ku-line />

            <!-- description -->
            <el-form-item class="mt-1 ku-no-after">
                <p>{{$t('company.intro')}}（{{$t('lang.zh')}}）</p>
                <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 15}" maxlength="500" v-model="info.summary.zh" :placeholder="$t('form.say')"></el-input>
            </el-form-item>
            <el-form-item>
                <p>{{$t('company.intro')}}（{{$t('lang.en')}}）</p>
                <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 15}" maxlength="500" v-model="info.summary.en" :placeholder="$t('form.say')"></el-input>
            </el-form-item>
            <!-- cate -->

            <div class="align-items-center py-1 d-flex">
                <p class="text-nowrap mr-2">{{$t('expo.goods')}}（{{$t('lang.zh')}}）</p>
                <el-cascader v-model="selected_cate" :options="cate3" :props="cate1_props" clearable class="flex-1"></el-cascader>
            </div>
            <div class="el-form-item__error" v-if="error.cate">{{error.cate}}</div>
            <ku-line />
            <!-- <el-form-item label="" class="ku-no-after">
                <el-input v-model="info.product_en" class="text-right" placeholder="32">
                    <template slot="prepend">{{$t('expo.goods')}}（{{$t('lang.en')}}）</template>
                </el-input>
            </el-form-item> -->
        </div>
        <div class="bg-white mt-2 px-2 pt-2">
            <h3 class="mb-3">{{$t('company.contact_detail')}}</h3>
            <ku-line />
            <!-- 国家地区 -->
            <ku-input-location :country_id.sync="info.contact_country_id" :region_id.sync="info.contact_region_id" :city_id.sync="info.contact_city_id" />
            <ku-line />

            <!-- 地址（中文）  -->
            <el-form-item prop="contact_addr.zh">
                <el-input v-model="info.contact_addr.zh" class="text-right" placeholder="北京市朝阳区朝阳路58号">
                    <template slot="prepend">{{$t('address')}}（{{$t('lang.zh')}}）</template>
                </el-input>
            </el-form-item>

            <!-- 地址（英文）  -->
            <el-form-item prop="contact_addr.en">
                <el-input v-model="info.contact_addr.en" class="text-right" placeholder="beijing Zhoyang 58">
                    <template slot="prepend">{{$t('address')}}（{{$t('lang.en')}}）</template>
                </el-input>
            </el-form-item>

            <!-- 传真 fax -->
            <el-form-item label="">
                <ku-input-fax v-model="info.contact_fax"></ku-input-fax>
            </el-form-item>

            <!-- 手机  -->
            <el-form-item prop="contact_phone">
                <el-input v-model="info.contact_phone" class="text-right" placeholder="156-867-660660">
                    <ku-mobile slot="prepend" :mobile_code.sync="phone_prefix" />
                </el-input>
            </el-form-item>
            <!-- 邮箱  -->
            <el-form-item prop="contact_email">
                <el-input v-model="info.contact_email" class="text-right" placeholder="happy@sina.com">
                    <template slot="prepend">{{$t('email')}}</template>
                </el-input>
            </el-form-item>

            <!-- 公司网址  -->
            <el-form-item label="" class="ku-no-after">
                <el-input v-model="info.contact_website" class="text-right" :placeholder="$t('company.www')">
                    <template slot="prepend">{{$t('company.www')}}</template>
                </el-input>
            </el-form-item>
        </div>
    </el-form>

    <div class="text-center my-5">
        <el-button type="primary" @click="handleSubmit" class="w-75" round>{{$t('save')}}</el-button>
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { myExpoOffice, AddExpoProceedings } from "~/api/expo"
export default {
    name: "ExpoDuty_JonalInfo",
    components: {},
    data() {
        return {
            info: {
                expo_id: '',
                company: {
                    name: this.$store.state.auth.company.name
                },
                hallname: [],
                summary: {},
                contact_addr: {},
                contact_fax: '',
                contact_phone: this.$store.state.auth.phone,
                contact_email: this.$store.state.auth.email,
                contact_country_id: this.$store.state.auth.company.country_id,
                contact_region_id: this.$store.state.auth.company.region_id,
                contact_city_id: this.$store.state.auth.company.city_id,
                contact_website: this.$store.state.auth.company.website,
            },
            phone_prefix: "86",
            logo_pre: '',
            logo_file: {},
            hall_props: {
                multiple: true,
            },
            selected_cate: [],
            selected_cate_level: [],
            cate1_props: {
                multiple: true,
                value: 'id',
                // label: 'name',
                label: 'name_' + this.$i18n.locale,
                children: 'childs'
            },
            rules: {
                "company.en": [{ required: true, message: this.$t('valid.required', [this.$t('company.name')]), trigger: ['blur'] }, ],
                "company.zh": [{ required: true, message: this.$t('valid.required', [this.$t('company.name')]), trigger: ['blur'] }, ],
                "summary.zh": [{ required: true, message: this.$t('valid.required', ["summary"]), trigger: ['blur'] }, ],
                "summary.zh": [{ required: true, message: this.$t('valid.required', ["summary"]), trigger: ['blur'] }, ],
                "contact_addr.en": [{ required: true, message: this.$t('valid.required', [this.$t('address')]), trigger: ['blur'] }, ],
                "contact_addr.zh": [{ required: true, message: this.$t('valid.required', [this.$t('address')]), trigger: ['blur'] }, ],
                contact_phone: [{ required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur'] }, ],
                contact_email: [{ type: 'email', message: this.$t('valid.email', [this.$t('email')]), trigger: ['blur', 'change'] }, ],
            },
            error: {
                hall: false
            }
        }
    },
    computed: {
        ...mapState('expo', ["my_expo_list", "my_expo_office_id"]),
        ...mapGetters('common', ['cate2', 'cate3']),
        expo_halls: function () {
            let expo_hall_selelced = []
            let expo_hall_selelced1 = []
            if (this.$store.state.expo.my_expo_list.length && this.my_expo_office_id) {
                const t_expo = this.$store.state.expo.my_expo_list.find(xx => xx.expo_id == this.my_expo_office_id)
                t_expo['halls'].forEach(el => {
                    const kk = typeof el == 'object' ? el.en : el
                    expo_hall_selelced.push({ value: kk, label: kk })
                    expo_hall_selelced1.push([kk])
                })
            }
            // console.log(expo_hall_selelced1, "selelcted")
            this.info.hallname = expo_hall_selelced1
            return expo_hall_selelced
        },
    },
    methods: {
        ...mapActions('common', ['getUnitsList']),
        getList() {
            this.isLoading = true
            myExpoOffice(6, this.my_expo_office_id).then(res => {
                if (res.item) {
                    this.logo_pre = this.gsv(['url'], res.item.logo) || this.gsv(['logo', 'url'], res.expo_applicant_seller.company) || ''
                    this.info.company = res.item.company
                    this.info.summary = res.item.summary

                    this.selected_cate = []
                    res.item.categories.forEach(gg => {
                        this.selected_cate.push([gg.pid, gg.id])
                    });
                    this.info.contact_country_id = res.item.contact_country_id
                    this.info.contact_addr = res.item.contact_addr
                    this.info.contact_region_id = res.item.contact_region_id
                    this.info.contact_city_id = res.item.contact_city_id
                    this.info.contact_phone = res.item.contact_phone
                    this.info.contact_email = res.item.contact_email
                    this.info.contact_fax = res.item.contact_fax
                    this.info.contact_website = res.item.contact_website

                } else {
                    this.logo_pre = this.gsv(['logo', 'url'], res.expo_applicant_seller.company) || ''
                    this.info.company = res.expo_applicant_seller.company.name
                    this.info.summary = res.expo_applicant_seller.company.description || {}
                    this.info.contact_addr = res.expo_applicant_seller.company.address
                    this.info.contact_country_id = res.expo_applicant_seller.company.country.id
                    this.info.contact_region_id = res.expo_applicant_seller.company.region_id
                    this.info.contact_city_id = res.expo_applicant_seller.company.city_id
                    this.info.contact_fax = res.expo_applicant_seller.company.fax
                    this.info.contact_website = res.expo_applicant_seller.company.website
                    this.selected_cate_level = res.expo_applicant_seller.categories
                    this.setSelectedCateLevel1(this.selected_cate_level)
                    // this.selected_cate = []
                }
            }).finally(() => {
                this.isLoading = false
            })
        },
        setSelectedArr(last_cate) {
            // need to fix db, temporary fuction
            // //  only parent cate with last category_id             

            // case [1]
            let selected_cate = [last_cate.id]
            const pid = last_cate.pid
            if (pid != 0) {
                // case [1, 2]
                const lv0 = this.cate3.find(e0 => e0.id == pid)
                if (lv0) {
                    selected_cate.unshift(pid)
                    // this.selected_cate = selected_cate
                    // return selected_cate
                }
                // case [1,2,3]
                this.cate3.forEach(el => {
                    if (el.childs) {
                        const lv1 = el.childs.find(e1 => e1.id == pid)
                        if (lv1) {
                            selected_cate.unshift(pid)
                            selected_cate.unshift(el.id)
                            // this.selected_cate = selected_cate
                            // return selected_cate
                        }
                    }
                });

            } else {
                // case [1]
                // this.selected_cate = selected_cate
            }

            return selected_cate

        },
        setSelectedCateLevel1(categories) {
            // let selected_items = this.selected_cate.filter(rr => rr.length > 1)
            let cate_level1 = []
            categories.forEach(el => {
                const temp = this.setSelectedArr(el)
                console.log(el, temp)
                if (temp)
                    cate_level1.push(temp)
            });
            this.selected_cate = cate_level1
        },
        getSelectedCateLevel1() {
            // let selected_items = this.selected_cate.filter(rr => rr.length > 1)
            let cate_level1 = []
            this.selected_cate.forEach(el => {
                const last_index = el.length - 1
                cate_level1.push(el[last_index])
            });
            return cate_level1
        },

        validHall(halls) {
            let hall_ids_arr = []
            halls.forEach(ee => {
                hall_ids_arr.push(ee[0])
            });
            if (!hall_ids_arr.length) {
                this.error.hall = this.$t('valid.required', [this.$t('expo.no_')])
                return false
            } else {
                this.error.hall = false
                return hall_ids_arr.join(',')
            }
        },
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    let form_s = new FormData()
                    if (this.logo_file instanceof FormData) {
                        for (let pp of this.logo_file.entries()) {
                            form_s.append(pp[0], pp[1])
                        }
                    }
                    let kkk = Object.assign({}, this.info)
                    let ob = this.buildQuery(kkk)
                    let is_valid_hall = this.validHall(this.info.hallname)
                    delete ob.hallname
                    delete ob.company
                    delete ob.summary
                    delete ob.contact_addr
                    for (const key in ob) {
                        if (ob.hasOwnProperty(key)) {
                            const el = ob[key];
                            form_s.append(key, el)
                        }
                    }
                    let category_ids = this.getSelectedCateLevel1()
                    console.log(category_ids, JSON.stringify(category_ids))
                    category_ids.forEach(cc => {
                        form_s.append("categories[]", cc)
                    });
                    form_s.append("hallname", is_valid_hall)
                    form_s.append("expo_id", this.my_expo_office_id)
                    // for (let pp of form_s.entries()) {
                    //     console.log(pp[0], "--", pp[1])
                    // }

                    AddExpoProceedings(form_s).then(() => {
                            this.$notify({
                                title: this.$t('success'),
                                message: this.$t('success.add'),
                                type: 'success'
                            });
                            // this.$refs['dataForm'].resetFields();
                        })
                        .catch(error => {
                            this.error = error
                        })
                } else {
                    return false;
                }
            });
        },

    },
    mounted() {
        if (this.my_expo_office_id) {
            this.getList()
        }
        if (!this.cate2.length) {
            this.getUnitsList(['categories']).then(() => {
                this.setSelectedCateLevel1(this.selected_cate_level)
            })
        }
    },
    watch: {
        my_expo_office_id(to, from) {
            if (to) {
                this.getList()
            }
        }
    }
}
</script>
