<template>
<div class="d-flex align-items-center py-1">
    <p class="mr-3" style="width:2.5rem; min-width:2.5rem;">{{$t('sex')}}</p>
    <el-select v-bind:value="value" :placeholder="$t('select')" class="w-100 text-right" :disabled="readonly" @change="$emit('change', $event)">
        <el-option v-for="item in list_sex" :key="item.id" :label="item.name[$i18n.locale]" :value="item.id">
        </el-option>
    </el-select> 
</div>
</template>

<script>
// ku-sex
const list_sex = [
    {
        id: 0,
        name: {
            'en': 'Mr.',
            'zh': '先生'
        }
    },
    {
        id: 1,
        name: {
            'en': 'Mrs.',
            'zh': '夫人'
        }
    },
    {
        id: 2,
        name: {
            'en': 'Ms.',
            'zh': '女士'
        }
    },
    {
        id: 3,
        name: {
            'en': 'Miss',
            'zh': '小姐'
        }
    },
]
export default {
    name: "KuSex",
    props: {        
        value: {
            type: [String, Number],
            default: 0
        },
        readonly: {
            type: Boolean,
            default: false
        },
    },
    model: {
        event: 'change',
    },
    data() {
        return {            
            list_sex
        }
    },
    methods: {               
    }    
}
</script>
