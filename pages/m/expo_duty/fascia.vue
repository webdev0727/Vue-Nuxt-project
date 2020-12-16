<template>
<div>
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0">
        <div class="bg-white px-2 pt-2">
            <h3 class="mb-1">{{$t('expo.m_fascia')}}</h3>
            <p>标准展位基本配置：</p>
            <ol class="ml-n3 mb-3">
                <li>9平方标准展位，规格：3米（长）×3米（宽）×2.5米（高）；配置：3面围板（双开口展位为2面）、1条中英文相板连展位号（双开口展位为2条）、 2盖射灯、1张长条桌、2把折椅、1个纸篓、1个电源插座（所配为220V插座，不能负荷加接的电源插板）、展览专用地毯。</li>
                <li>12平方标准展位，规格：4米（长）×3米（宽）×2.5米（高）；配置：3面围板（双开口展位为2面）、1条中英文相板连展位号（双开口展位为2条）、 3盏射灯、1张长条桌、3把折椅、1个纸篓、1个电源插座（所配为220V插座，不能负荷加接的电源插板）、展览专用地毯。</li>
                <li>如在产品进馆时需用叉车，请展前联系主办方。</li>
                <li>有关展位所需特殊设备要求，请于7月6日之前书面通知主办方。并支付相关费用。 注意：展台内不允许残留永久性、不易清除的物品。 标准展位由主办方统一搭建和拆除，楣板统一制作，请您正确填写</li>
            </ol>
            <ku-line />

            <el-form-item prop="description_zh">
                <el-input v-model="info.description_zh" class="text-right" placeholder="内容内容">
                    <template slot="prepend">{{$t('lang.zh')}}</template>
                </el-input>
            </el-form-item>

            <el-form-item prop="description_en">
                <el-input v-model="info.description_en" class="text-right" placeholder="内容内容">
                    <template slot="prepend">{{$t('lang.en')}}</template>
                </el-input>
            </el-form-item>

            <el-form-item prop="quantity" class="ku-no-after">
                <el-input v-model.number="info.quantity" class="text-right" placeholder="3123" type="number">
                    <template slot="prepend">{{$t('quantity')}}</template>
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
import { myExpoOffice, AddExpoFascia } from "~/api/expo"
export default {
    name: "ExpoDuty_Fascia",
    components: {},
    data() {
        return {
            info: {
                expo_id: '',
                description_en: '',
                description_hz: '',
                quantity: '',
            },
            rules: {
                description_hz: [{ required: true, message: this.$t('valid.required', [this.$t('desc')]), trigger: ['blur', 'change'] }, ],
                description_en: [{ required: true, message: this.$t('valid.required', [this.$t('desc')]), trigger: ['blur', 'change'] }, ],
                quantity: [{ required: true, message: this.$t('valid.required', [this.$t('quantity')]), trigger: ['blur', 'change'] },
                    { type: "number", message: this.$t('valid.numeric', [this.$t('quantity')]), trigger: ['blur'] },
                    // { min: 1, max: 100, message: this.$t('valid.min.numeric', ["quantity", 1]), trigger: ['blur'] }
                ],

            },
        }
    },
    computed: {
        ...mapState('expo', ["my_expo_office_id"])
    },
    methods: {
        getList() {
            // this.isLoading = true
            myExpoOffice(5, this.my_expo_office_id).then(res => {
                if (res.item) {
                    let kk = res.item
                    this.info.id = kk.id
                    this.info.expo_id = kk.expo_id
                    this.info.description_en = kk.description.en
                    this.info.description_zh = kk.description.zh
                }
            }).finally(() => {
                // this.isLoading = false
            })
        },
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    let ddd = Object.assign({}, this.info)
                    ddd.expo_id = this.my_expo_office_id
                    AddExpoFascia(ddd).then(() => {
                        this.$notify({
                            title: this.$t('success'),
                            message: this.$t('success.msg'),
                            type: 'success'
                        });
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