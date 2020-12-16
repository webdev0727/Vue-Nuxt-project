<template>
<div>
    <div class="vld-parent" style="min-height:5rem" v-if="(!push && active && !total) || (push && active)">
        <loading :active.sync="active" :is-full-page="false" color="#F15A24" :width="40" loader="Dots" background-color="transparent"></loading>
    </div>
    <NoData v-if="!active && !total" />
</div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import NoData from "@/components/NoData"
export default {
    name: 'KuLoadingNoData',
    components: { Loading, NoData },
    props: {
        active: {},
        total: {
            type: [Number],
            default: []
        },
        push: {
            type: Boolean,
            default: false
        }
    },
}
</script>
