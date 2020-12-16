<template>
<div class="container">
    <kuc-page-header :title="$t('want.post')"></kuc-page-header>
    <div class="tab-container">
        <div class="bg-white mb-2 px-3 pb-3 mt-2">
            <el-form :model="info" ref="dataForm" :rules="rules">
                <!-- title -->
                <el-form-item prop="title" class="ku-no-after border-bottom">
                    <el-input v-model="info.title" class="text-right" :placeholder="$t('form.input1')">
                        <template slot="prepend">{{$t('title')}}</template>
                    </el-input>
                </el-form-item>

                <!-- content -->
                <p class="mt-3">{{$t('content.i')}}</p>
                <ku-editor-html v-model="info.content" title="content.i" key="content" class="my-2" />
                <el-form-item class="ku-only-valid ku-no-after" prop="content">
                    <el-input v-model="info.content" type="hidden"></el-input>
                </el-form-item>

                <!-- covers -->
                <div class="py-2">
                    <p class="mb-2">{{$t('article.cover')}}</p>
                    <ku-upload :f_data.sync="files1" name="covers[]" :limit=3 :key="upload_key" />
                </div>

            </el-form>
        </div>

        <div class="mt-4">
            <div class="text-center">
                <el-button type="danger" round class="w-75 my-3" @click="handleSubmit">{{$t('confirm.ok')}}</el-button>
            </div>
        </div>

    </div>

</div>
</template>

<script>
import KuEditorHtml from "@/components/KuEditorHtml"
import { add } from "@/api/discovery"
export default {
    middleware: ['authenticated', 'member_0'],
    name: 'NewDiscovery',
    components: {
        KuEditorHtml
    },
    data() {
        return {
            info: {
                title: '',
                content: '',
            },
            files1: {},
            upload_key: "sdf",
            rules: {
                title: [{ required: true, message: this.$t('valid.required', [this.$t('title')]), trigger: ['blur', 'change'] },
                    { min: 2, max: 30, message: this.$t('valid.between.string', [this.$t('title'), 2, 30]), trigger: ['blur', 'change'] },

                ],
                content: [{ required: true, message: this.$t('valid.required', [this.$t('content.i')]), trigger: ['change'] }, ],
            },
        }

    },
    computed: {},
    methods: {

        resetInfo() {
            this.info = {
                title: "",
                content: ""
            }
            this.files1 = {}
            this.upload_key = +new Date()
        },
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                let form_s = new FormData()
                form_s.append('tag', "discover")
                form_s.append('status', 2)
                let cnt_file = 0
                if (this.files1 instanceof FormData) {
                    for (let pp of this.files1.entries()) {
                        cnt_file++
                        form_s.append(pp[0], pp[1])
                    }
                }
                if (valid) {
                    let ob = Object.assign({}, this.info)
                    for (const key in ob) {
                        if (ob.hasOwnProperty(key)) {
                            const el = ob[key];
                            form_s.append(key, el)
                        }
                    }
                    this.$store.dispatch("common/setLoading")
                    add(form_s).then(() => {
                            this.$notify({
                                title: this.$t('success'),
                                message: this.$t('success.add'),
                                type: 'success'
                            });
                            this.resetInfo()
                            this.$refs['dataForm'].resetFields();
                        })
                        .catch(error => {
                            this.error = error
                        })
                        .finally(() => {
                            this.$store.dispatch("common/setLoading", false)
                        })
                } else {
                    return false;
                }
            });
        },
    }
}
</script>

<style lang="scss" scoped>
.input-label {
    min-width: 70px;
    color: #282828;
}
</style>
