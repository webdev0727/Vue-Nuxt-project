<template>
<div class="login-box">
    <!-- svg-map -->
    <h2 class="text-center">Svg Map</h2>
    <div class="w-100">
        <ku-svg-map :checked.sync="checked" :raw_data="map_data"/>
    </div>

</div>
</template>

<script>
import axios from 'axios'
export default {
    name: "Test1",
    components: {},
    data() {
        return {
            map_data: '',            
            checked: [],
            key_s : "kk"
        }
    },
    methods: {
        
    },
    mounted() {
        axios.get('http://img.antway.cn/hall/5f53ad4d25a6c.svg').then(data => {
            this.map_data = data.data
            this.key_s = +new Date()
        }).catch(error => {
            console.log(error)
        })
        
    },
}
</script>
