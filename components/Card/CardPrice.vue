<template>
<div class="card-price-container mb-2 rounded" @click="goDetail(productDa)">
    <img :src="getImg1(productDa.assets)" alt="" class="rounded">
    <h4 class="text-dark text-line-1">{{productDa.name[$i18n.locale]}}</h4>
    <h3 class="text-danger">￥{{price || productDa.price}}</h3>
    <p class="text-dark9 text-line-2">{{gsv(['company', 'name', $i18n.locale], productDa)}}</p>
</div>
</template>

<script>
export default {
    name: 'CardPrice',
    props: [
        'productDa',
        'price'
    ], 
    methods:{
        goDetail(item){
            this.$router.push({ path: this.getSeoProduct(item) })
        }
    }
}
</script>

<style lang="scss" scoped>
.card-price-container {
    // display: inline-block;
    >img {
        object-fit: cover;
        width: 100%;
        height: 40vw;
        max-height: 400px;
    }
    p {
        font-size: 0.9rem;
    }
}
</style>
