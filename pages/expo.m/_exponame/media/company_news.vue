<template>
<div class="text-center px-5 py-3">
      <a target="_blank" rel="noopener noreferrer" class="bg-blue-2 text-white d-block p-2" @click="goHeadine">{{$t('expo.company_news')}}</a>
</div>
</template>

<script>
export default {
      name: "Expo-Media-Company-News",
      methods: {
            goHeadine() {
                  window.open(`${process.env.M_URL}/headline?tab=9`, '_blank')
            },
      }
}
</script>
