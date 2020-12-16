<template>
<div>
    <div class="bg-white p-3">
        <ProcessBar3 :status='2' :items='process_items' />
    </div>

    <div class="bg-white p-2 mb-2" v-for="surveytag in step_buyer.surveytags" :key="surveytag.id">
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

    <div class="text-center pt-2 mt-2 mb-5">
        <el-button type="primary" @click="handleSubmit" class="w-75" round="">{{this.$t('next')}}</el-button>
    </div>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import ProcessBar3 from "@/components/ProcessBar3"
import { applyStep } from "@/api/expo"

export default {
    scrollToTop: true,
    name: "BuyParticipate_Step2",
    components: { ProcessBar3 },
    data() {
        return {
            process_items: [this.$t('step.info'), this.$t('investigation'), this.$t('step.auditing'), this.$t('badge_apply')],
            activeIndex: '1',

            info: {
                expo_applicant_buyer_id: '',
                survey_ids: [],
                surveytags: [],
                survey_name_custom: [],
            },
        }
    },
    computed: {
        ...mapState('expo', ["step_buyer"]),
    },

    methods: {
        ...mapActions('expo', ['getBuyerStatus']),

        handleSubmit() {
            // info save api  
            this.info.expo_applicant_buyer_id = this.step_buyer.expo_applicant_buyer.id
            this.info.surveytags = []
            this.step_buyer.surveytags.forEach((el, ind) => {
                let kk = Object.assign({}, el)
                kk['surveys'] = el.childs.filter(kk => this.info.survey_ids.includes(kk.id))
                this.info.surveytags.push(kk)
            });
            applyStep('buyer', 1, this.info).then(async (re) => {
                await this.getBuyerStatus(this.$route.params.id)
                this.$router.push({ path: '/my/buy/participate/' + this.$route.params.id + '/step3' })
            })
        },
    }
}
</script>
