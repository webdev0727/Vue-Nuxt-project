<template>
<div class="container">
    <kuc-page-header title="输入新密码"></kuc-page-header>
    <div class="mt-2">
        <el-form :model="info" ref="form" label-width="0" :rules="rules">
            <!-- Password-->
            <div class="bg-white mb-2 px-2 py-1">

                <el-form-item class="" prop="password">
                    <el-input v-model="info.password" :placeholder="$t('form.input')" class="" type="password" show-password>
                        <span slot="prepend">{{$t('form.pass')}}</span>
                    </el-input>
                </el-form-item>

                <el-form-item class="ku-no-after" prop="password_confirmation" :error="error.password">
                    <el-input v-model="info.password_confirmation" :placeholder="$t('form.input')" class="" type="password">
                        <span slot="prepend">{{$t('form.pass_c')}}</span>
                    </el-input>
                </el-form-item>

            </div>

        </el-form>
        <div class="text-center">
            <el-button type="danger" round class="w-75 my-3" @click="handleSubmit">{{$t('confirm.ok')}}</el-button>
        </div>

    </div>

</div>
</template>

<script>
export default {
    name: 'NewPassword',
    components: {},
    head() {
        return{
            title: this.$t('recover.i')      
        }
    },
    data() {
        var validatePass2 = (rule, value, callback) => {
            if (value !== this.info.password) {
                callback(new Error(this.$t('valid.same', [this.$t('form.pass_new'), this.$t('form.pass_new_c')])));
            } else {
                callback();
            }
        };
        return {
            info: {
                password: '',
                password_confirmation: ''
            },
            rules: {
                password: [
                    { required: true, message: this.$t('valid.required', [this.$t('form.pass_new')]), trigger: ['blur', 'change'] },
                    { min: 6, message: this.$t('valid.min.string', [this.$t('form.pass'), 6]), trigger: ['blur', 'change'] },
                ],
                password_confirmation: [
                    { required: true, message: this.$t('valid.required', [this.$t('form.pass_new_c')]), trigger: ['blur', 'change'] },
                    { validator: validatePass2, trigger: 'blur' },
                ],
            },
            error: {
                password: ''
            },
        }

    },
    computed: {},
    methods: {
        handleSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let data = Object.assign({}, this.info)
                    this.$store.dispatch('resetPass', data)
                        .then(() => {
                            this.$router.push({ path: '/' })
                        })
                        .catch(error => {
                            console.log("Api failed!", error)
                            this.error = error
                        })
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.input-label {
    min-width: 70px;
    color: #282828;
}
</style>
