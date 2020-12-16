<template>
<!-- 国家区号  城市区号  电话号码  分机 -->
<div class="d-flex justify-content-between ku-pl-0">
    <p class="mr-3">{{$t(title)}}</p>
    <div class="flex-1 d-flex justify-content-between">
        <el-select v-model="temp_fax_arr[0]" :placeholder="$t('country')" style="min-width: 6rem">
            <el-option v-for="item in countries" :key="item.id" :label="`+ ${item.mobile_prefix}`" :value="item.mobile_prefix">{{item.name}} (+{{item.mobile_prefix}})
            </el-option>
        </el-select>
        <el-input v-model="temp_fax_arr[1]" @input="handleChange('input2')" class="text-center" type="number" :placeholder="title=='landline'?  '城市区号' : $t('form.input')" style="width: 7rem"></el-input>
        <span>-</span>
        <el-input v-model="temp_fax_arr[2]" @input="handleChange" ref="input2" class="text-center" type="number" :placeholder="title=='landline'?  '电话号码' : $t('form.input')"></el-input>
        <span>-</span>
        <el-input v-model="temp_fax_arr[3]" @input="handleChange" ref="input3" class="text-right" type="number" :placeholder="title=='landline'?  '分机' : ''" style="width: 5rem"></el-input>

    </div>
</div>
</template>

<script>
// 4 inputs (country_code, region_code, fax_number)
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
    name: "KuInputFax",
    props: {
        value: {
            type: String,
            default: "86"
        },
        title: {
            type: String,
            default: 'fax'
        },
    },
    data() {
        return {
            temp_fax_arr: this.value ? this.value.split('-') : ''
        }
    },
    model: {
        event: 'change',
    },
    computed: {
        ...mapState('world', ['countries', 'is_loading_c']),
    },

    methods: {
        ...mapActions('world', ['getCountry']),
        handleChange(target) {
            if (target == 'input2'){
                if (this.temp_fax_arr.length > 1) {
                    if (this.temp_fax_arr[1].length > 3) {
                        this.$refs['input2'].focus()
                    }
                }
            }
            const kk = this.temp_fax_arr.filter(rr => rr).join('-')
            this.$emit('change', kk)

        }
    },
    mounted() {

        if (!this.countries.length && !this.is_loading_c)
            this.getCountry()
        const kk = this.value ? this.value.replace('+', '') : ''
        this.temp_fax_arr = kk.split('-')
        if (!this.temp_fax_arr[0]) this.temp_fax_arr[0] = 86
    },
    watch: {        
        value(newValue) {
            if (newValue) {
                const kk = newValue.replace('+', '')
                const cur_fax = this.temp_fax_arr.filter(rr => rr).join('-')
                if (cur_fax != kk){
                    this.temp_fax_arr = kk.split('-')
                    if (!this.temp_fax_arr[0]) this.temp_fax_arr[0] = 86
                }
            }
        }
    }
}
</script>
