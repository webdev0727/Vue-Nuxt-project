<template>
<div class="d-flex justify-content-between step-progress-bar">
    <template v-for="(item, kk) in items">
        <div v-if="kk>0" class="step-line" :class="status>kk ? 'active' : ''" :style="{width: iWidth}" :key="kk+'line0'"></div>
        <div class="stage-item" :class="status>kk ? 'active' : ''" :key="kk+'body'">
            <h2 class="p-2 text-white text-center d-flex align-items-center justify-content-center">{{kk+1}}</h2>
            <div class="d-flex" :class="acss(kk)">
                <ku-read-more :text="item" moreStr='' :maxChars="19" class="text-nowrap text-dark6 mt-1"></ku-read-more>
            </div>
        </div>
        <div v-if="(kk+1)<items.length" class="step-line" :class="status>kk ? 'active' : ''" :style="{width: iWidth}" :key="kk+'line1'"></div>
    </template>
</div>
</template>

<script>
export default {
    name: 'ProcessBar3',
    props: {
        status: {
            type: Number,
            default: 0
        },
        items: {
            type: Array,
            default: function(){
                return [this.$t('step.info'), this.$t('step.pay'), this.$t('step.complete')]
            }
        },
    },
    computed: {
        iWidth: function () {
            var width_i = 0;
            var len = this.items.length
            var width_v = `calc(${100/(len+1)}% - ${3.4*len/(len+1)}rem)`
            return width_v
        }        
    },
    methods: {
        acss(kk) {
            if(kk==0) return ""
            else if(kk==(this.items.length-1)) return "justify-content-end"
            else return "justify-content-center"
            return width_v
        }
    }
}
</script>

<style lang="scss" scoped>
.stage-item {
    width: 3.4rem;
    min-width: 3.4rem;
    position: relative;

    h2 {
        width: 100%;
        height: 3.4rem;
        font-weight: 700;
        background-color: #EEEEEE;
    }

    p {
        font-size: 0.85rem;        
    }

    &.active {
        h2 {
            background-color: red;
        }
    }
}

.step-line {
    height: 3px;
    background-color: #EEEEEE;
    // width: calc(25% - 2.55rem);
    margin-top: 1.7rem;

    &.active {
        background-color: red;
    }
}
</style>
