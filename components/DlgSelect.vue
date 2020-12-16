<template>
<div>
    <div class="d-flex justify-content-between " @click="openModal()">
        <p class="text-nowrap mr-2">{{title}}</p>
        <div class="d-flex justify-content-end align-items-center">
            <p class="flex-1">
                <span v-if="checkedItems==''" class="text-dark9">{{$t(placeholder)}}</span>
                <span>{{checkedItems}}</span>
            </p>
            <p><i class="el-icon-arrow-right"></i></p>
        </div>
    </div>
    <!-- modal dialog -->
    <el-dialog title="Country" :visible.sync="dialogVisible" width="100%" class="full-modal-container m-max-width" :show-close="false">

        <div slot="title" class="position-fixed w-100 border-bottom m-max-width" style="z-index:999">
            <kuc-page-header :title="title" disabled @back="dialogVisible = false">
                <p class="text-danger" @click="handleItemSave">{{$t('save')}}</p>
            </kuc-page-header>
        </div>

        <div class="my-5">
            <template v-for="item in cList">
                <div :key="item[_key]">
                    <div class="d-flex justify-content-between py-2" @click="handleItemClick(item[_key])">
                        <p>{{item.name[$i18n.locale] || item.name}}</p>
                        <svg-icon v-if="check_exist_item(item[_key])" name='checked' color="green"></svg-icon>
                    </div>
                    <ku-line />
                </div>
            </template>

        </div>

    </el-dialog>
</div>
</template>

<script>
export default {
    name: "DlgSelect",
    props: {
        list: {
            type: [Array],
            default: function () {
                return []
            }
        },
        checked: {
            type: [Array, String, Number],
            required: true
        },
        title: {
            type: String,
            default: '国家地区'
        },
        placeholder: {
            type: String,
            default: 'select'
        },        
        readonly: {
            type: Boolean,
            default: false
        },        
        _key: {
            type: String,
            default: "id"
        }
    },
    data() {
        return {
            dialogVisible: false,
            temp_checked: [],
        }
    },
    computed: {
        multi_check: function () {
            return typeof this.checked == 'object'
        },
        cList: function () {            
            if (typeof this.list[0] == 'object') return this.list
            else {
                var new_arr = []
                this.list.forEach(el => {
                    let obj = {
                        name: el
                    }
                    obj[this._key] = el
                    new_arr.push(obj)
                });
                return new_arr
            }
        },
        checkedItems: function () {
            var checked_name = ''
            if (this.multi_check) {
                let ccc = this.cList.filter(item => this.checked.includes(item[this._key]))
                var c_names = []
                ccc.forEach(el => {
                    c_names.push(el.name[this.$i18n.locale])
                });
                checked_name = c_names.join(', ')
            } else {
                let ccc = this.cList.filter(item => this.checked == item[this._key])
                if (ccc.length) {
                    if (typeof ccc[0]['name'] == 'string') checked_name = ccc[0]['name']
                    else checked_name = ccc[0]['name'][this.$i18n.locale]
                }
            }
            if (checked_name) this.$emit('cUnitName', checked_name)
            return checked_name
        }
    },
    methods: {
        openModal() {
            if (this.cList.length && !this.readonly) {
                this.dialogVisible = true
                this.temp_checked = this.checked
            }else{
                if (!this.cList.length){
                    this.$emit('onError', {code: 400, msg: 'Empty List'})
                }
            }
        },

        check_exist_item(id) {
            var is_checked = false
            if (this.multi_check) {
                const cur = this.temp_checked.filter(ii => {
                    return ii == id
                })
                is_checked = !!cur.length
            } else {
                is_checked = this.temp_checked == id                
            }
            return is_checked
        },
        handleItemClick(id) {
            if (this.multi_check) {
                if (this.check_exist_item(id)) {
                    const newTemp = this.temp_checked.filter(ii => id != ii)
                    this.temp_checked = newTemp
                } else {
                    this.temp_checked.push(id)
                }
            } else {
                this.temp_checked = id
            }
        },
        handleItemSave() {
            this.dialogVisible = false
            this.$emit('update:checked', this.temp_checked)
            this.$emit('change', this.temp_checked)
        },
    }
}
</script>