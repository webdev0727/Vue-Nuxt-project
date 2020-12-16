<template>
<div>
    <div class="map-container" id="map">       
        <k-svg-map :map="hall1" :zoom.sync="zoom" v-model="selectedLocation" :bg_url="bg_url" radio />
    </div>
    <br>
    <h2 style="text-align: center">{{selectedLocation}}</h2>
    <div id="map_ctrl">        
        <button @click="selectedLocation=['h1-129']">h1-129</button>
        <button @click="selectedLocation=['h1-226']">h1-226</button>
    </div>
    <br>
    <!-- <div style="margin-top:  100vh">

    </div> -->
</div>
</template>

<script>
import KSvgMap from "@/components/k-svg-map"
import hall1 from "@/static/map/mapConfig.js"

export default {
    name: "Svg-Map",
    layout: 'full',
    components: {
        KSvgMap,
    },
    data() {
        return {
            hall1,
            bg_url: '/map/hall1.gif',
            selectedLocation: '',
            zoom: 1,
        };
    }
}
</script>
<style>
#map {
    width: 100%;
    height: calc(100vh - 200px);
    /* height: 626px; */
    /* height: 313px; */
    margin: 0 auto;
    padding: 0 10px;    
}
button{
    font-size: 1rem;
}
</style>
