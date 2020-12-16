<template>
<div>
    <div class="d-flex justify-content-between aling-items-center" @click="openModal()">
        <p class="text-nowrap">
            <span>{{checkedLevels}}</span>
            <i class="el-icon-arrow-down"></i>
        </p>
    </div>
    <!-- modal dialog -->
    <el-dialog :visible.sync="dialogVisible" width="100%" class="full-modal-container" :show-close="false">
        <div slot="title" class="position-fixed w-100 border-bottom" style="z-index:999">
            <kuc-page-header :title="$t('country.sel')" disabled @back="dialogVisible = false">
                <p @click="handleCountrySave">{{$t('save')}}</p>
            </kuc-page-header>
        </div>
        <div class="my-5">
            <div v-for="country in countries" :key='country.id'>
                <div class="d-flex justify-content-between py-2" @click="handleClick(country)">
                    <p>{{country.name}}</p>
                    <template>
                        <svg-icon v-if="country.code == temp.country_code || country.id == temp.id" name='checked' color="green"></svg-icon>
                    </template>

                </div>
                <ku-line />
            </div>
        </div>
    </el-dialog>

    <!-- modal dialog city -->
    <el-dialog :visible.sync="dialogVisibleC" width="100%" class="full-modal-container" :show-close="false">

        <div slot="title" class="position-fixed w-100 border-bottom" style="z-index:999">
            <kuc-page-header :title="$t('region.sel')" disabled @back="dialogVisibleC = false">
                <p @click="handleProvinceSave">{{$t('save')}}</p>
            </kuc-page-header>
        </div>
        <div class="my-5">
            <div key="pp0">
                <div class="d-flex justify-content-between py-2" @click="temp_region_id=''">
                    <p>{{$t('all')}}</p>
                    <svg-icon v-if="''==temp_region_id" name='checked' color="green"></svg-icon>
                </div>
                <ku-line />
            </div>
            <div v-for="province in CHN" :key="'pp'+province.id">
                <div class="d-flex justify-content-between py-2" @click="temp_region_id=province.id">
                    <p>{{province.name}}</p>
                    <svg-icon v-if="province.id==temp_region_id" name='checked' color="green"></svg-icon>
                </div>
                <ku-line />
            </div>
        </div>
    </el-dialog>

</div>
</template>

<script>
// ku-world
import { mapState, mapActions, mapGetters } from 'vuex'
import { getCity, getRegionsById } from "@/api/world"
export default {
    name: "KuWorld1",
    props: {
        mobile_code: {
            type: String,
            default: "86"
        },
        country_id: {
            type: [String, Number],
            default: 1
        },
        country_code: {
            type: String,
            default: "CHN"
        },
        region_id: {
            type: [String, Number],
            default: ""
        },
        mode2: {
            type: Boolean,
            default: true
        },
        showAllLevels: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: '手机'
        },
    },
    data() {
        return {
            // countries,
            dialogVisible: false,
            dialogVisibleC: false,
            temp: {
                id: this.country_id,
                mobile_code: '',
                country_code: this.country_code,
            },
            temp_region_id: ''
        }
    },

    computed: {
        ...mapState('world', ['countries', 'CHN', 'is_loading_c', 'is_loading_p']),
        checkedCountry: function () {
            let ccc
            if (this.country_code) {
                ccc = this.countries.filter(item => this.country_code == item.code)
            } else {
                ccc = this.countries.filter(item => this.country_id == item.id)
            }
            if (ccc.length) {
                return ccc[0]['name']
            }
            return ''
        },

        checkedCountryId: function () {
            if (this.country_id) return this.country_id
            else {
                let ccc = this.countries.filter(item => this.country_code == item.code)
                if (ccc.length) {
                    return ccc[0]['id']
                }
            }
            return false
        },

        checkedCity: function () {
            let ccc = this.CHN.filter(item => this.region_id == item.id)
            if (ccc.length) {
                return ccc[0]['name']
            }
            return ''
        },
        checkedLevels: function () {
            if (this.showAllLevels) {
                return this.checkedCountry + ' ' + this.checkedCity
            } else {
                if (this.checkedCity) return this.checkedCity
                else return this.checkedCountry
            }
        },
    },

    methods: {
        ...mapActions('world', ['getCountry', 'getProvince']),
        openCity() {
            if (this.temp.country_code || this.temp.id) {
                if (!this.CHN.length)
                    this.getProvince()
                if (this.temp.country_code == 'CHN' || this.temp.id == 1) {
                    this.temp_region_id = this.region_id
                    this.dialogVisibleC = true
                }
            }
        },
        openModal() {
            this.dialogVisible = true
            this.temp.mobile_code = this.mobile_code
            this.temp.country_code = this.country_code
            this.temp.id = this.country_id
        },
        handleClick(country) {
            // console.log(country)
            this.temp.id = country.id
            this.temp.mobile_code = country.mobile_prefix
            this.temp.country_code = country.code
        },
        handleCountrySave() {
            this.dialogVisible = false
            if (this.country_code != this.temp.country_code) {
                this.$emit('update:region_id', "")
            }
            this.$emit('update:mobile_code', this.temp.mobile_code)
            this.$emit('update:country_code', this.temp.country_code)
            this.$emit('update:country_id', this.temp.id)
            this.$emit('changeCountry', this.temp)
            if (this.mode2) {
                this.openCity()
            }
        },
        handleProvinceSave() {
            this.dialogVisibleC = false
            this.$emit('update:region_id', this.temp_region_id)
            this.$emit('changeCity', this.temp_region_id)
        }
    },
    created() {
        if (!this.countries.length && !this.is_loading_c)
            this.getCountry()

        if ((this.country_code || this.country_id) && !this.is_loading_p) {
            if (!this.CHN.length)
                this.getProvince()
        }
    }
}
</script>
