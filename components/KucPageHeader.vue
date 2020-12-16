<template>
<div class="ku-page-header">
    <div class="ku-back-btn" @click="handleBack">
        <i class="el-icon-arrow-left go-back-icon"></i>
    </div>
    <div class="ku-page-title text-center pl-4 pr-2">
        <h2 v-if="!hasTitle" class="py-2">{{title}}</h2>
        <slot name="title"></slot>
    </div>
    <div class="ku-right-btn">
        <slot></slot>
    </div>
</div>
</template>

<script>
export default {
    name: 'KucPageHeader',
    props: {
        title: [Number, String],
        to: String,
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            currentValue: this.value
        }
    },
    computed: {
        hasTitle: function () {
            return !!this.$slots['title']
        },
    },
    methods: {
        handleBack(e) {
            if (this.disabled) {
                this.$emit('back')
            } else {
                if (this.to)
                    this.$router.push({ path: this.to })
                else
                    this.goBack()
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.ku-page-header {
    position: relative;
    background: white;

    .ku-ab {
        position: absolute;
        top: 0;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 0.5rem;
    }

    .ku-back-btn {
        @extend .ku-ab;
        left: 0;
    }

    .ku-right-btn {
        @extend .ku-ab;
        right: 0;
    }

    .go-back-icon {
        font-size: 1.8rem;
    }

    .ku-page-title {
        flex: 1;
    }
}
</style>
