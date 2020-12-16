<template>
  <div>
      <el-button type="primary" size="default" @click="check">Confirm</el-button>
      <el-button type="primary" size="default" @click="check_k">Confirm_k</el-button>
      
  </div>
</template>

<script>
export default {
    methods:{
        check(){
            this.$confirm("<h2>拼单结束后是否拼单改为否的状态</h2>", this.$t('warning'), {
                confirmButtonText: "前往查看",
                cancelButtonText: this.$t('confirm.cancle'),
                showClose: false,                
                showCancelButton: true,
                confirmButtonClass: 'text-danger',
                cancelButtonClass: 'border-right',
                customClass: 'ku-confirm',
                dangerouslyUseHTMLString: true,
                center: true,
            }).then(() => {
                // pindan_finish([id]).then(() => {
                this.$notify({
                    title: this.$t('success'),
                    message: this.$t('success.del'),
                    type: 'success'

                });                
            }).catch(() => {})
        },
        check_k(){
            this.$confirm("<h2>拼单结束后是否拼单改为否的状态</h2>", this.$t('warning'), {
                confirmButtonText: "前往查看",
                cancelButtonText: this.$t('confirm.cancle'),
                showClose: false,                
                showCancelButton: true,
                confirmButtonClass: 'text-danger',
                cancelButtonClass: 'border-right',
                customClass: 'ku-confirm',
                dangerouslyUseHTMLString: true,
                center: true,
            }).then(() => {
                // pindan_finish([id]).then(() => {
                this.$notify({
                    title: this.$t('success'),
                    message: this.$t('success.del'),
                    type: 'success'

                });                
            }).catch(() => {})
        }
    }
}
</script>