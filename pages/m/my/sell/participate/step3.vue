<template>
<div class="bg-white p-2 min-vh-100">
    <ProcessBar3 :status='3' :items='process_items' class="mb-2" />
    <el-form ref="dataForm" label-position="left" label-width="0" v-if="seller_step.halls">
        <div class="px-2">
            <div class="search-rounded-group mb-2">
                <el-input :placeholder="$t('search')" suffix-icon="el-icon-search" v-model="keyword">
                    <div slot="prepend">
                        <el-select v-model="floor" placeholder="馆" @change="hChangeHall">
                            <el-option v-for="item in seller_step.halls" :key="item.id" :label="gsv([$i18n.locale], item.name) || item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </el-input>
            </div>
        </div>

        <!-- <div ref="svg" @click="mapChange" v-html="gsv([floorIndex, 'map'], seller_step.halls)"></div> -->
        <!-- <ku-svg-map-a :bg="map_bg" :raw_data="map_data" :checked.sync="info.halls"/> -->
        <div v-if="map_data" style="height:23rem">
            <ku-svg-map :zoom.sync="zoom" :map="map_data" v-model="selected_halls[floor]" :bg_url="bg_url" @change="handleMapSelect" />
        </div>
        <div class="el-form-item__error" v-if="error.seat">{{error.seat}}</div>

        <!-- <checkbox-svg-map :map="halls[0]['map']" v-model="selectedLocation" @change="handleMapSelect"></checkbox-svg-map> -->
        <div class="text-center">
            <h2 class="font-13">{{$t('expo.no_')}}: {{getPosition}}</h2>
            <div class="text-dark9 mt-2">
                <p>{{$t('expo.area')}}：{{total_area || total_areas_for_new_company}}{{$t('m2')}}</p>
                <p>{{$t('expo.price')}}：<span class="text-danger">￥{{total_price || total_price_for_new_company}}</span> </p>
            </div>
        </div>
        <div class="text-center pt-2 mt-2">
            <el-button type="primary" @click="handleSubmit" class="w-75" round="">{{$t('btn.book')}}</el-button>
        </div>
        <div class="text-center mt-4">
            <p>{{$t('msg.hello_booth_price')}}</p>
            <p class="my-2">{{$t('salesman')}}：张强 {{$t('content.mobile')}}：13999999999</p>
        </div>
    </el-form>

    <!-- modal dialog -->
    <el-dialog :visible.sync="dialogVisible" width="100%" class="full-modal-container" :show-close="false">

        <div slot="title" class="position-fixed w-100" style="z-index:999">
            <kuc-page-header :title="$t('expo.success')" disabled @back="dialogVisible = false"></kuc-page-header>
        </div>
        <div class="mt-5 text-center">
            <success-icon></success-icon>
        </div>
        <div class="text-dark9 text-center">
            <h2 class="px-3 text-dark28 mb-3">{{$t('msg.booth_success')}}</h2>
            <p>{{$t('msg.will_contact_pay')}}</p>
        </div>
        <div class="px-3 mt-5">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-button type="primary" @click="handleFinish" class="w-100" round>{{$t('confirm.ok')}}</el-button>
                </el-col>
                <el-col :span="12">
                    <el-button type="primary" @click="dialogVisible = false" class="w-100" round plain>{{$t('confirm.cancle')}}</el-button>
                </el-col>
            </el-row>
        </div>

    </el-dialog>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import ProcessBar3 from "@/components/ProcessBar3"
import SuccessIcon from "@/components/successIcon"
import KuSvgMap from "@/components/k-svg-map"

import { getStep, applyStep } from "@/api/expo"

export default {
    scrollToTop: true,
    name: "Participate_New_Step3_Seat",
    components: { ProcessBar3, SuccessIcon, KuSvgMap },
    data() {
        return {
            dialogVisible: false,
            floor: '',
            zoom: 1,
            info: {
                expo_applicant_seller_id: '',
                halls: []
            },
            selected_halls: {

            },
            total_price: 0,
            total_area: 0,
            total_price_for_new_company: 0,
            total_areas_for_new_company: 0,
            keyword: "",
            map_bg: '',
            bg_url: '',
            map_data: null,
            process_items: [this.$t('info.fill'), this.$t('investigation'), this.$t('expo.book'), this.$t('expo.pay')],
            error: {
                seat: false
            }
        }
    },

    computed: {
        ...mapState('expo', ["seller_step"]),

        getPosition: function () {
            return this.info.halls.join(', ')
        },
        floorIndex: function () {
            return this.seller_step.halls.findIndex(xx => xx.id == this.floor)
        },

    },
    methods: {
        ...mapActions('expo', ['getSellerStatus', "downloadExpoSVG", "getExpoHallDetail"]),
        async hChangeHall() {
            let hall_cur = this.seller_step.halls.find(xx => xx.id == this.floor)
            // console.log(hall_cur)
            if (hall_cur) {
                if (!hall_cur.svg) {
                    if (hall_cur.bg_url){
                        await this.downloadExpoSVG(hall_cur)
                        hall_cur = this.seller_step.halls.find(xx => xx.id == this.floor)
                    }
                }
                if (!hall_cur.children) {
                    this.getExpoHallDetail(hall_cur.id)
                    // hall_cur =  this.seller_step.halls.find(xx => xx.id == this.floor)
                }
                this.bg_url = hall_cur.bg_url
                this.map_data = hall_cur.svg
            }
        },
        handleSubmit() {
            if (!this.info.halls.length) {
                this.error.seat = this.$t('valid.required', ['seat'])
                return false
            } else {
                this.error.seat = false
                this.$store.dispatch("common/setLoading")
                applyStep('seller', 2, this.info).then(async (rr) => {
                    this.dialogVisible = true
                }).finally(() => {
                    this.$store.dispatch("common/setLoading", false)
                })
            }
        },
        handleMapSelect(selectedItems) {
            console.log(selectedItems)
            let price = 0,
                area = 0,
                halls = []
            // if (this.seller_step.halls[this.floorIndex]) {
            //     // this.seller_step.halls[this.floorIndex].children.forEach(room => {
            //     //     if (this.info.halls.includes(room.name)) price += room.price
            //     // });
            // }
            for (const key in this.selected_halls) {
                if (this.selected_halls.hasOwnProperty(key)) {
                    const selected_map_seat_ids = this.selected_halls[key] || [];
                    const hall_detail = this.seller_step.halls.find(xx => xx.id == key)
                    if (hall_detail) {
                        const seats = hall_detail.children
                        selected_map_seat_ids.forEach(selected_map_seat_id => {
                            halls.push(selected_map_seat_id)
                            if (seats) {
                                seats.forEach(seat => {
                                    if (seat.map_id == selected_map_seat_id) {
                                        price += seat.price
                                        area += seat.area
                                    }
                                });
                            }
                        });
                    }
                }
            }
            this.total_price = price
            this.total_area = area
            this.info.halls = halls
        },
        handleFinish() {
            this.getSellerStatus().then(() => {
                this.dialogVisible = false
                this.handleRoute()
            })
        },

        initDa() {
            if (this.seller_step.halls.length) {
                this.floor = this.seller_step.halls[0]['id']
                this.hChangeHall()
            }
            this.info.expo_applicant_seller_id = this.seller_step.expo_applicant_seller.id
            // for new company
            this.info.halls = this.seller_step.expo_applicant_seller.halls.map(rr => rr.en)
            this.total_price_for_new_company = this.seller_step.expo_applicant_seller.total
            this.total_areas_for_new_company = this.seller_step.expo_applicant_seller.areas
        },

        handleRoute(step = 2) {
            let path = "/my/sell/participate/"

            if (this.seller_step.status) path = path + "step" + (parseInt(this.seller_step.status) + 1)

            if (this.seller_step.status == step) {
                this.initDa()
            } else {
                this.$router.replace({ path })
            }
        },
    },
    async mounted() {

        if (this.seller_step.status == undefined) {
            await this.getSellerStatus()
        }
        this.handleRoute()
    }
}
</script>
