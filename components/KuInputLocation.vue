<template>
<div class="d-flex justify-content-between align-items-center" style="padding: 0.25rem 0;">
    <p class="mr-3">{{$t(title)}}</p>
    <div class="flex-1 d-flex justify-content-between">
        <el-select v-model="temp[mode]" :placeholder="$t('country')" @change="handleCountry">
            <el-option v-for="item in countries" :key="item.id" :label="item.name" :value="item[mode]">{{item.name}}
            </el-option>
        </el-select>
        <el-select v-model="temp.region_id" :placeholder="$t('region')" :disabled="is_disable_rc" @change="handleRegion">
            <el-option v-for="item in CHN" :key="item.id" :label="item.name" :value="item.id">{{item.name}}
            </el-option>
        </el-select>
        <el-select v-model="temp.city_id" :placeholder="$t('city')" :disabled="is_disable_rc" @change="handleCity">
            <el-option v-for="item in cities" :key="item.id" :label="item.name" :value="item.id">{{item.name}}
            </el-option>
        </el-select>

    </div>
</div>
</template>

<script>
// 3 inputs (country_code, region_code, city_id)
import { mapState, mapActions, mapGetters } from 'vuex'
import { getRegionsById } from "@/api/world"
export default {
    name: "KuInputLocation",
    props: {
        country_code: {
            type: String,
            default: "CHN"
        },
        country_id: {
            type: [String, Number],
            default: 1
        },
        mode_code: {
            type: Boolean,
            default: false
        },
        region_id: {
            type: [String, Number],
            default: ""
        },
        city_id: {
            type: [String, Number],
            default: ""
        },
        title: {
            type: String,
            default: 'country_region'
        },
    },
    data() {
        return {
            temp: {
                id: this.country_id,
                code: this.country_code,
                region_id: this.region_id,
                city_id: this.city_id,
            },
            cities: []
        }
    },
    computed: {
        ...mapState('world', ['countries', 'CHN', 'is_loading_c', 'is_loading_p']),
        mode: function () {
            return this.mode_code ? 'code' : 'id'
        },
        is_disable_rc: function () {
            var kk = false
            if (this.mode_code) {
                if (this.temp.code != 'CHN') kk = true
            } else if (this.temp.id != 1) kk = true
            return kk
        }

    },
    methods: {
        ...mapActions('world', ['getCountry', 'getProvince']),
        handleCountry(e) {
            let temp_country = ''
            if (this.mode_code) {
                const kk = this.countries.find(rr => rr.code == e)
                if (kk) {
                    this.temp.id = kk.id
                }
                temp_country = this.temp.code
                this.$emit("update:country_code", this.temp.code)
            } else {
                temp_country = this.temp.id
                this.$emit("update:country_id", this.temp.id)
            }
            if (this.temp.id == 1) {
                if (!this.CHN.length) this.getProvince()
            }
            this.temp.region_id = ''
            this.temp.city_id = ''
            this.$emit("update:region_id", '')
            this.$emit("update:city_id", '')
            this.$emit("change_country", temp_country)
        },
        handleRegion(e) {
            getRegionsById(e).then(res => {
                this.cities = res.data
            })
            this.$emit("update:region_id", e)
            this.temp.city_id = ''
            this.$emit("update:city_id", '')
        },
        handleCity(e) {
            this.$emit("update:city_id", e)
        }
    },
    mounted() {
        if (!this.countries.length && !this.is_loading_c)
            this.getCountry()

        if ((this.country_code || this.country_id) && !this.is_loading_p) {
            if (!this.CHN.length)
                this.getProvince()
        }
        if (this.region_id) {
            getRegionsById(this.region_id).then(res => {
                this.cities = res.data
            })
        }
    },
    watch: {
        country_id(newValue) {
            if (newValue != this.temp.id) this.temp.id = newValue
        },
        country_code(newValue) {
            if (newValue != this.temp.code) this.temp.code = newValue
        },
        region_id(newValue) {
            if (newValue != this.temp.region_id) {
                this.temp.region_id = newValue
                getRegionsById(newValue).then(res => {
                    this.cities = res.data
                })
            }
        },
        city_id(newValue) {
            if (newValue != this.temp.city_id) this.temp.city_id = newValue
        },
    }
}
</script>
