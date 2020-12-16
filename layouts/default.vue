<template>
<div class="container">
    <loading :active.sync="isRootLoading" color="#F15A24"></loading>
    <nuxt />
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Loading from 'vue-loading-overlay'
export default {
    name: 'app',
    components: {
        Loading
    },
    computed: {
        ...mapState('common', ['isRootLoading'])
    },
    methods: {
        // ...mapActions('common', ['getConfig'])
    },
    created() {
        // this.getConfig();        
    }
}
</script>
