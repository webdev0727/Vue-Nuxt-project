<template>
<div>
    <kuc-page-header :title="$t('group.edit')"></kuc-page-header>
    <el-form ref="dataForm" :rules="rules" :model="info" label-position="left" label-width="0" class="bg-white px-2 mt-2">
        <div class="py-input">
            <dlg-select :title="$t('group.sel')" :checked.sync="info.name" :list="['001', '002', '003', '004']" />
        </div>
        <ku-line />

        <el-form-item class="ku-no-after">
            <el-input v-model="info.name_1" class="text-right" placeholder="001">
                <template slot="prepend">{{$t('group.add_new')}}</template>
            </el-input>
        </el-form-item>

    </el-form>

    <el-row :gutter="20" class="px-4 my-4">
        <el-col :span="12" class="">
            <el-button type="primary" round class="w-100" @click="handleSave">{{$t('confirm.ok')}}</el-button>
        </el-col>
        <el-col :span="12">
            <el-button type="primary" round class="w-100" plain @click="goBack">{{$t('confirm.cancle')}}</el-button>
        </el-col>
    </el-row>
</div>
</template>

<script>
export default {
    name: "BuyGroupNew",
    head() {
        return {
            title: this.$t('group.edit')
        }
    },
    data() {
        return {
            type: this.$route.params.id,
            info: {
                name: '',
                name_1: '',
            },
            rules: {
                email: [{ type: 'email', message: this.$t('valid.email', [this.$t('email')]), trigger: ['blur', 'change'] }, ],
                mobile: [{ required: true, message: this.$t('valid.required', [this.$t('mobile')]), trigger: ['blur', 'change'] },
                    { min: 11, max: 15, message: this.$t('valid.between.string', [this.$t('mobile'), 11, 15]), trigger: ['blur', 'change'] },
                ]
            },
        }
    },
    async asyncData({ params, route }) {

    },
    computed: {

    },
    methods: {
        handleSave() {
            this.$notify({
                title: this.$t('success'),
                message: this.$t('success.add'),
                type: 'success'
            });
            this.goBack()
        },        
    }
}
</script>