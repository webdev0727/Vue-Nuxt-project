<template>
<div>
    <div class="px-2 bg-white">
        <el-form :model="info" ref="form" label-width="0" :rules="rules" class="">
            <!-- Pssword  -->
            <el-form-item class=" text-right" prop="current_password">
                <el-input v-model="info.current_password" :placeholder="$t('form.input')" class="" type="password" show-password>
                    <span slot="prepend">{{$t('form.pass_cur')}}</span>
                </el-input>
            </el-form-item>

            <el-form-item class="text-right" prop="password">
                <el-input v-model="info.password" :placeholder="$t('form.input')" class="" type="password" show-password>
                    <span slot="prepend">{{$t('form.pass_new')}}</span>
                </el-input>
            </el-form-item>

            <el-form-item class="ku-no-after text-right" prop="password_confirmation">
                <el-input v-model="info.password_confirmation" :placeholder="$t('form.input')" class="" type="password">
                    <span slot="prepend">{{$t('form.pass_new_c')}}</span>
                </el-input>
            </el-form-item>
        </el-form>
    </div>
    <div class="text-center mt-4">
        <el-button type="danger" round class="w-75 my-3" @click="handleSubmit">{{$t('confirm.ok')}}</el-button>
    </div>
</div>
</template>

<script>
export default {
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
                current_password: '',
                password: '',
                password_confirmation: '',
            },
            rules: {
                current_password: [
                    { required: true, message: this.$t('valid.required', [this.$t('form.pass')]), trigger: ['blur', 'change'] },
                    { min: 6, message: this.$t('valid.min.string', [this.$t('form.pass'), 6]), trigger: ['blur', 'change'] },
                ],
                password: [
                    { required: true, message: this.$t('valid.required', [this.$t('form.pass_new')]), trigger: ['blur', 'change'] },
                    { min: 6, message: this.$t('valid.min.string', [this.$t('form.pass'), 6]), trigger: ['blur', 'change'] },
                ],
                password_confirmation: [
                    { required: true, message: this.$t('valid.required', [this.$t('form.pass_new_c')]), trigger: ['blur', 'change'] },
                    { validator: validatePass2, trigger: 'blur' },
                ],
            },
        }
    },
    methods: {
        handleSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    const login_da = {
                        mode: 0,
                        password: this.info.current_password,
                        user_name: (this.$store.state.auth.phone_prefix + this.$store.state.auth.phone) || this.$store.state.auth.email
                    }
                    this.$store.dispatch('login', login_da)
                        .then(() => {
                            // let data = Object.assign({}, this.info)
                            this.$store.dispatch('resetPass', this.info)
                                .then(() => {
                                    this.$notify({
                                        title: this.$t('success'),
                                        message: this.$t('success.msg'),
                                        type: 'success'
                                    });
                                    this.info = {
                                        current_password: '',
                                        password: '',
                                        password_confirmation: '',
                                    }
                                    this.$refs['form'].resetFields();

                                })
                                .catch(error => {
                                    this.$notify({
                                        title: this.$t('error'),
                                        message: $t('error'),
                                        type: 'error',
                                        duration: 2000
                                    });
                                })
                        })
                        .catch(() => {
                            this.info.current_password = ''
                            this.$notify({
                                title: this.$t('error'),
                                message: this.$t('error'),
                                type: 'error',
                                duration: 2000
                            });
                        })
                }
            });
        },
    }
}
</script>

<style>

</style>
