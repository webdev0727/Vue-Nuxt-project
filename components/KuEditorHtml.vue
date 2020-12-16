<template>
<div>
    <div class="rounded border info-textarea" v-html="value" @click="handleEdit()"></div>
    <!-- modal dialog -->
    <el-dialog :visible.sync="dlg_show" width="100%" class="full-modal-container" :show-close="false">
        <div slot="title" class="position-fixed w-100 border-bottom m-max-width" style="z-index:999;">
            <kuc-page-header :title="$t(title)" disabled @back="dlg_show = false">
                <p @click="handleViewHtml">Html</p>
            </kuc-page-header>
        </div>
        <div class="my-5">
            <div class="pt-2" v-if="!show_html">
                <ku-editor v-model='desc_temp' :key="dlg_key"></ku-editor>
            </div>
            <el-input v-if="show_html" type="textarea" :autosize="{ minRows: 5, maxRows: 35}" v-model="desc_temp" placeholder="请输入正文" @change="handleChangeHtml" class="black"></el-input>

            <el-row :gutter="20" class="px-4 my-4">
                <el-col :span="12" class="">
                    <el-button type="primary" round class="w-100" @click="handleDscSave">{{$t('confirm.ok')}}</el-button>
                </el-col>
                <el-col :span="12">
                    <el-button type="primary" round class="w-100" plain @click="dlg_show=false">{{$t('confirm.cancle')}}</el-button>
                </el-col>
            </el-row>
        </div>
    </el-dialog>
</div>
</template>

<script>
import KuEditor from "@/components/KuEditor"
var cleaner = require('clean-html')
export default {
    name: "KuEditorHtml",
    components: { KuEditor },
    props: {
        value:{},
        title:{
            type: String,
            default: 'description'
        }
    },
    model: {
        event: 'change',
    },
    data() {
        return {
            editor: null,
            desc_temp: this.value,
            dlg_show: false,
            dlg_key: 'ss',
            show_html: false,
        };
    },
    methods: {
        handleViewHtml() {
            let that = this
            this.show_html = !this.show_html
            cleaner.clean(this.desc_temp, function (html) {
                that.desc_temp = html
            })
        },
        handleChangeHtml() {
            this.dlg_key = +new Date()
        },
        handleEdit(desc_key) {
            this.desc_temp = this.value
            this.dlg_show = true
            this.show_html = false
            this.dlg_key = +new Date()
        },
        handleDscSave() {
            this.$emit("change", this.desc_temp)
            this.dlg_show = false
        },
    },

};
</script>
