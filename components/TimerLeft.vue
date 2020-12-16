<template>
<span>{{timeLeft}}</span>
</template>

<script>
const humanizeDuration = require('humanize-duration')

export default {
    name: 'TimerLeft',
    props: [
        'endTime',
        'unit'
    ],

    data() {
        return {
            timeLeft: '',
            polling: null
        }
    },
    mounted() {
        let endStampL = this.endTime
        if (/^\d{4}-\d{2}-\d{2}$/.test(this.endTime)) endStampL = this.endTime + ' 23:59:59'
        const endStamp = +new Date(endStampL)
        this.polling = setInterval(() => {
            const now = new Date().getTime();
            const distance = endStamp - now;
            var urnits = ['d', 'h']
            if (this.unit) urnits = this.unit
            else {
                if (distance > 86400000) {
                    urnits = ['d'];
                } else if (distance > 3600000) {
                    urnits = ['h', 'm'];
                } else if (distance > 60000)
                    urnits = ['m'];
                else
                    urnits = ['s'];
            }
            let language = this.$i18n.locale
            if (language=="zh") language='zh_CN'
            this.timeLeft = humanizeDuration(distance, {
                language,
                round: true,
                units: urnits
            })
            if (distance < 0) {
                clearInterval(this.polling);
                if(language=='en')
                    this.timeLeft = "0day"
                else 
                    this.timeLeft = "0天"
                this.$emit("ended")
            }
            // console.log(distance)
        }, 1000);
    },
    beforeDestroy() {
        clearInterval(this.polling)
    }
}
</script>
