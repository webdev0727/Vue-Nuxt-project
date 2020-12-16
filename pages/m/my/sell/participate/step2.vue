<template>
<div>
    <ProcessBar3 :status='2' :items='process_items' class="p-2 bg-white mb-2" />
    <el-form ref="dataForm" :model="info" label-position="left" label-width="0" class="">

        <div class="bg-white p-2 mb-2" v-for="surveytag in seller_step.surveytags" :key="surveytag.id">
            <h3 class="py-2"><span class="text-danger"></span>
                {{gsv([$i18n.locale], surveytag.name)}}
            </h3>
            <div class="checkbox-button-container">
                <el-checkbox-group v-model="info.survey_ids" class="d-flex flex-wrap justify-content-between">
                    <el-checkbox-button v-for="survey in surveytag.childs" :label="survey.id" :key="survey.id">{{gsv([$i18n.locale], survey.name)}}</el-checkbox-button>
                    <div class="d-flex align-items-center px-2 flex-1 font-1 mb-2">
                        <p class="text-nowrap text-dark6">其他，请注明：</p>
                        <el-input v-model="info.survey_name_custom[surveytag.id]" class="px-1 border-bottom" style="min-width: 5rem" :placeholder="$t('form.input')">
                        </el-input>
                    </div>
                </el-checkbox-group>
            </div>
        </div>

        <div class="text-center my-3 px-2 d-flex justify-content-center">
            <div class="w-50 px-2">
                <el-button type="primary" @click="handlePre" class="w-100" round>{{$t('prev')}}</el-button>
            </div>
            <div class="w-50 px-2">
                <el-button type="primary" @click="handleSubmit" class="w-100" round>{{$t('next')}}</el-button>
            </div>
        </div>
    </el-form>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import ProcessBar3 from "@/components/ProcessBar3"
import { getStep, applyStep } from "@/api/expo"
export default {
    scrollToTop: true,
    name: "Participate_New_Step2",
    components: { ProcessBar3 },
    data() {
        return {            
            process_items: [this.$t('info.fill'), this.$t('investigation'), this.$t('submit.success')],
            activeIndex: '1',
            info: {
                expo_applicant_seller_id: '',
                survey_ids: [],
                surveytags: [],
                survey_name_custom: [],
            },
        }
    },
    computed: {
        ...mapState('expo', ["seller_step"]),

    },
    methods: {
        ...mapActions('expo', ['getSellerStatus']),
        initDa() {
            this.info.expo_applicant_seller_id = this.seller_step.expo_applicant_seller.id

            let selected_survey_ids = []
            this.seller_step.surveytags.forEach(el => {
                el.childs.forEach(kk => {
                    if (kk.is_selected) selected_survey_ids.push(kk.id)
                });
            });
            this.info.survey_ids = selected_survey_ids
        },
        
        handleRoute(step = 1) {
            let path = "/my/sell/participate/"

            if (this.seller_step.status) path = path + "step" + (parseInt(this.seller_step.status) + 1)
            
            if (this.seller_step.status == step) {
                this.initDa()
            } else {
                this.$router.replace({ path })
            }
        },

        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    // info save api  
                    this.info.surveytags = []
                    let surveytags_copy = this.seller_step.surveytags
                    surveytags_copy.forEach((el1, ii1) => {
                        el1.childs.forEach((el2, ii2) => {
                            if(this.info.survey_ids.includes(el2.id)) surveytags_copy[ii1]['childs'][ii2]['is_selected'] = 1
                        });
                    });
                    this.info.surveytags = surveytags_copy

                    this.$store.dispatch("common/setLoading")
                    applyStep('seller', 1, this.info).then(async (re) => {
                        const next_step = await this.getSellerStatus()
                        this.handleRoute()

                    }).finally(() => {
                        this.$store.dispatch("common/setLoading", false)
                    })

                } else {
                    return false;
                }
            });
        },

        handlePre() {
            const path = "/my/sell/participate"
            this.$router.replace({ path, query:{edit: 1} })
        }

    },
    async mounted() {
        if (this.seller_step.status == undefined) {
            await this.getSellerStatus()
        }
        this.handleRoute()
    }
}
</script>
