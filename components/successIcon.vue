<template>
<div class="d-flex align-items-center justify-content-center" style="height:8rem">
    <div class="d-inline">
        <div class="bg-danger rounded-circle checked--icon">
            <svg-icon name="checked1" width='70%' height="70%" color='white'></svg-icon>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: "SuccessIcon"
}
</script>

<style lang="scss" scoped>
@keyframes checked-animation {
    0% {
        width: 0;
        height: 0;
    }

    50% {
        width: 7rem;
        height: 7rem;
    }

    100% {
        width: 5rem;
        height: 5rem;
    }

}

.checked--icon {
    width: 5rem;
    height: 5rem;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    animation-name: checked-animation;
    animation-duration: 0.5s;
}
</style>
