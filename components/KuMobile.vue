<template>
<div class="d-flex justify-content-between align-items-center">
    <p class="mr-3 text-left" style="min-width:2.5rem;">{{$t(title)}}</p>
    <el-select v-model="temp.mobile_code" :placeholder="$t('country')" style="min-width: 6rem; width:6.8rem" :disabled="readonly" @change="hChangeCode" class="text-center">
        <el-option v-for="item in countries" :key="item.id" :label="`+ ${item.mobile_prefix}`" :value="item.mobile_prefix">{{item.name}} (+{{item.mobile_prefix}})
        </el-option>
    </el-select> 
</div>
</template>

<script>
// ku-mobile
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    name: "KuMobile",
    props: {
        title: {
            type: String,
            default: 'mobile'
        },
        mobile_code: {
            type: [String, Number],
            default: "86"
        },
        readonly: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            temp: {
                mobile_code: this.mobile_code,
            },
        }
    },

    computed: {
        ...mapState('world', ['countries', 'is_loading_c']),        
    },

    methods: {
        ...mapActions('world', ['getCountry']),        
        hChangeCode() {
            this.$emit('update:mobile_code', this.temp.mobile_code)            
        }
    },
    mounted() {        
        if (!this.countries.length && !this.is_loading_c)
            this.getCountry()        
    }
}
</script>
