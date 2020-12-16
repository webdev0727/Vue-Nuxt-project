<script>
export default {
async asyncData({ params, redirect }) {
      const url = `/${params.exponame}/media/expo_news`
      redirect(url)       
    }
}
</script>
