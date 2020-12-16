<template>
<div>
    <kuc-page-header :title="$t('notice')"></kuc-page-header>
    <nuxt-child></nuxt-child>
</div>
</template>

<script>
export default {
    name: "NoticeLayout",
    head(){
        return {
            title: this.$t('notice')
        }
    },
    data() {
        return {}
    },
    methods: {}
}
</script>
