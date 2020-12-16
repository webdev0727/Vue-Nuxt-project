import Vue from 'vue'
Vue.mixin({
  data: function(){
    return{      
      GENDER: {
        zh: ["先生", "夫人", "女士", "小姐"],
        en: ["Mr.", "Mrs.", "Ms.", "Miss"]
      }
    }
  },
  methods: {
    getWan(v, digit = 0) {
      if (v == null) v = 0;
      else {
        if (typeof v != 'number') v = parseFloat(v);
        if (v > 9999) v = +(v / 10000).toFixed(digit) + "万";
        else if (v != 0) v = +v.toFixed(digit);
      }
      return v;      
    },
    noMyCompany(id) {
        let is_m = false
        if (this.$store.state.auth) {
            is_m = id == this.$store.state.auth.company_id
        }
        return !is_m
    },
    goBack() {
     
      // if (this.$nuxt.context.from) {
      // } 
      if(window.history.length>2){
          this.$router.back()
      }else 
          this.$router.push({ path: '/' })
    },
    ...require("~/utils"),
    ...require("~/utils/validate"),
    // ...require("~/utils/scroll-to"),
  },
  filters:{
    strippedContent: function(string){
      return string.replace(/<\/?[^>]+>/ig, " ").replace(/\&nbsp;/g, '')
    }
  }
})