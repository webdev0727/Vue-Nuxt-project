<template>
  <div class="container">
    <loading :active.sync="isRootLoading" color="#F15A24"></loading>
    <nuxt />
    <Footer />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Footer from '~/components/Footer.vue'
import Loading from 'vue-loading-overlay'
export default {
    name: 'MainLayout',
    components: {Footer, Loading},
    computed: {
        ...mapState('common', ['isRootLoading'])
    },
}
</script>
<style>

</style>
