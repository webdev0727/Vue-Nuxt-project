<template>
<div>
    <div v-for="ii in cur_count" :key="'mmm'+ii">
        <div class="d-flex justify-content-between py-input avatar-div">
            <img :src="gsv(['avatar', 'url'], list[ii-1].user) || '/files/avatar.png'" alt=" " class="rounded-circle fit-cover" style="width:3rem; height:3rem;">
            <div class="flex-1 ml-2">
                <div class="d-flex justify-content-between align-items-center">
                    <p>{{gsv(['name', $i18n.locale], list[ii-1].user)}}</p>
                    <div class="text-dark9">
                        <!-- <svg-icon name="like-o"></svg-icon> {{list[ii-1].likes}} &nbsp; -->
                        <!-- <svg-icon name="comment"></svg-icon> {{answer.comments}} &nbsp; -->
                    </div>
                </div>
                <p class="text-line-1">{{list[ii-1].answer}}</p>
            </div>
        </div>
        <ku-line />
    </div>
    <div class="text-center" v-if="cur_count<list.length">
        <p class="p-2 text-dark6" @click="hReadMore">{{$t('more_reply')}}</p>
    </div>
</div>
</template>

<script>

export default {
    name: "KuShowMoreAnswer",
    components: {},
    props: {
        list: {
            type: Array,
            required: true
        },
        step: {
            type: Number,
            default: 2
        },

    },
    data() {
        return {
            cur_count: Math.min(this.step, this.list.length)
        }
    },
    computed: {

    },
    methods: {
        hReadMore(){
            const new_count = this.cur_count + this.step
            this.cur_count = new_count > this.list.length ? this.list.length: new_count
        }
    },
}
</script>
