<template>
  <span>{{timeLeft}}前</span>
</template>

<script>

const humanizeDuration = require('humanize-duration')

export default {
name: 'Timer',
    props:[
        'endTime'
    ],
    data () {
        return {
            timeLeft: '',
            polling: null
        }
    },
    created() {
        const endStamp = +new Date(this.endTime) 
        this.polling = setInterval(() => {
            const now = new Date().getTime();
            const distance = now - endStamp ;
            this.timeLeft= humanizeDuration(distance, {                
                language: 'zh_CN',
                round: true,                
                units: ['d', 'h']
                
            })            
            if (distance < 0) {
                clearInterval(this.polling);
                this.timeLeft = 0
            }
        }, 1000);
    },
    beforeDestroy () {
        clearInterval(this.polling)
    }
}
</script>
