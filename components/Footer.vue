<template>
<footer class="bg-white d-flex justify-content-between px-1">

    <div to='/' :class="$route.name=='index' ? 'active' : ''" @click="handleRoute('/')">
        <div class="go-home "></div>
        <p>{{$t('homepage')}}</p>
    </div>

    <div to='/product' :class="$route.name=='product' || $route.name=='product-search' ? 'active' : ''" @click="handleRoute('/product')">
        <div class="go-product"></div>
        <p>{{$t('products')}}</p>
    </div>
    <div to='/headline' :class="$route.name=='headline' ? 'active' : ''" @click="handleRoute('/headline')">
        <div class="go-headline "></div>
        <p>{{$t('headline')}}</p>
    </div>
    <div to='/discovery' :class="$route.name=='discovery' ? 'active' : ''" @click="handleRoute('/discovery')">
        <div class="go-discover "></div>
        <p>{{$t('discovery')}}</p>
    </div>
    <div to='/my' :class="$route.name=='my' ? 'active' : ''" @click="handleRoute('/my')">
        <div class="go-my "></div>
        <p>{{$t('mine')}}</p>
    </div>

</footer>
</template>

<script>
export default {
    name: 'Footer',
    computed: {},
    methods: {
        handleRoute(route_path){
            if (window.location.hostname != process.env.DOMAIN){                
                location.replace(`${process.env.M_URL}${route_path}`)
            }else{
                this.$router.push({path: route_path})
            }
        }
    }
}
</script>

<style lang="scss" scoped>
footer {
    position: fixed;
    bottom: 0;
    width: 100vw;
    z-index: 88;
    max-width: 768px;
    left: 50%;
    transform: translateX(-50%);

    .footer-munu-button {
        width: 2rem;
        height: 2rem;
        background-repeat: no-repeat;
        background-size: cover;
    }

    .go-home {
        @extend .footer-munu-button;
        background-image: url('/icons/footer/h-o.png');
    }

    .go-product {
        @extend .footer-munu-button;
        background-image: url('/icons/footer/p-o.png');
    }

    .go-headline {
        @extend .footer-munu-button;
        background-image: url('/icons/footer/a-o.png');
    }

    .go-discover {
        @extend .footer-munu-button;
        background-image: url('/icons/footer/c-o.png');
    }

    .go-my {
        @extend .footer-munu-button;
        background-image: url('/icons/footer/u-o.png');
    }

    &>div {
        padding: 0.25rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        flex: 1;

        p {
            padding-top: 2px;
            color: #999999;
            font-size: 0.8rem;
        }

        &.active {
            p {
                color: #E50113;
            }

            .go-home {
                background-image: url('/icons/footer/h.png');
            }

            .go-product {
                background-image: url('/icons/footer/p.png');
            }

            .go-headline {
                background-image: url('/icons/footer/a.png');
            }

            .go-discover {
                background-image: url('/icons/footer/c.png');
            }

            .go-my {
                background-image: url('/icons/footer/u.png');
            }
        }
    }

}
</style>
