<template>
<p>
    {{getText}}
    <template v-if="needBtn" >
        <span v-if="!is_max">... <span style="color: #00519B" @click="is_max=true">{{moreStr}}</span></span>
        <span v-else style="color: #00519B" @click="is_max=false">{{lessStr}}</span>
    </template>
</p>
</template>

<script>

export default {
    name: "KuReadMore",
    props: {
        text: {
            type: String,
            required: true
        },
        maxChars: {
            type: Number,
            default: 100
        },
        moreStr: {
            type: String,
            default: '【了解更多】'
        },
        lessStr: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            is_max: false
        }
    },
    computed: {
        getText: function(){
            if(this.is_max) return this.text
            else{
                return this.text.substring(0, this.maxChars)
            }
        },
        needBtn: function(){
            return this.text.length > this.maxChars
        }
    },
    methods: {       
    },   
}
</script>
