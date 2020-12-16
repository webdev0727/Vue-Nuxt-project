<script>
export default {
async asyncData({ params, redirect }) {
      const url = `${process.env.M_URL}/article/${params.id}`
      redirect(url)       
    }
}
</script>