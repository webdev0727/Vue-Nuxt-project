<template>
<div>
    <div v-for="item in list" :key="item.id">
        <div class="d-flex justify-content-between py-input avatar-div">
            <img :src="gsv(['avatar', 'url'], item.user) || '/files/avatar.png'" alt=" " class="rounded-circle fit-cover" style="width:3.5rem; height:3.5rem;">
            <div class="flex-1 ml-2">
                <div class="d-flex justify-content-between align-items-center">
                    <p>{{gsv(['name', $i18n.locale], item.user)}}</p>
                    <div class="text-dark9">
                        <svg-icon :name="item.my_like ? 'like': 'like-o'" @click="handleLikeComments(item)"></svg-icon> {{item.likes}} &nbsp; <i class="el-icon-delete p-2" v-if="item.user_id == gsv(['id'], $store.state.auth)"></i>
                    </div>
                </div>
                <p>{{item.content}}</p>

            </div>
        </div>
        <div class="px-2 bg-darkF7">
            <card-r :title="gsv(['name', $i18n.locale], item.source)" :poster="getImg1(gsv(['assets'], item.source))" :bigIMG="false" nl>
                <p class="text-dark9 font-09">{{gsv(['comments'], item.source)}}{{$t('comment')}} ⋅ {{formatTime(gsv(['created_at'], item.source))}}</p>
            </card-r>
        </div>

        <div class="ml-2">
            <div class="d-flex align-items-center justify-content-between">
                <h3 class="py-2 mt-2">{{$t('reply')}}({{item.answers.length}})</h3>
                <el-button v-if="item.user_id != gsv(['id'], $store.state.auth)" type="primary" round @click="handleReplay(item)" size="small">{{$t('reply')}}</el-button>
            </div>
            <ku-line />
            <div class="mb-2">
                <KuShowMoreAnswer :list="item.answers" />
            </div>
        </div>
    </div>

    <el-drawer :visible.sync="drawer" direction="btt" size="50%" :withHeader="false">
        <el-form :model="info" label-width="0" ref='dataForm' :rules="rules" class="p-2">
            <el-form-item class="mt-1 ku-no-after" prop="answer">
                <p>{{$t('to')}}{{to}}</p>
                <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 15}" maxlength="500" v-model="info.answer" show-word-limit :placeholder="$t('form.say')"></el-input>
            </el-form-item>

        </el-form>
        <div class="text-center py-3">
            <el-button type="danger" round class=" w-75" @click="handleSubmit">{{$t('msg.send_btn')}}</el-button>
        </div>
    </el-drawer>

    <infinite-loading spinner="spiral" :identifier='infiniteId' @infinite="handleInfinite" class="m-3"> </infinite-loading>

</div>
</template>

<script>
const mode = 3
const st = process.client ? require('@/utils/scroll-to') : undefined
import { getList, doAnswer, toggleLike } from "@/api/comment"
import KuShowMoreAnswer from "@/components/KuShowMoreAnswer"
export default {
    name: "CommentT",
    components: { KuShowMoreAnswer },
    data() {
        return {
            list: [],
            total: 0,
            listQuery: {
                page: 1,
                limit: 3
            },
            infiniteId: +new Date(),
            drawer: false,
            info: {
                answer: '',
                comment_id: '',
                mode
            },
            to: "",
            rules: {
                answer: [{ required: true, message: this.$t('valid.required', [this.$t('content.i')]), trigger: ['blur', 'change'] },
                    { min: 5, message: this.$t('valid.min.string', [this.$t('content.i'), 5]), trigger: ['blur', 'change'] }
                ],
            },
        }
    },
    methods: {
        getList() {
            getList(mode, this.listQuery).then(res => {
                this.list = res.items
                this.total = res.total
            })
        },
        handleInfinite($state) {
            getList(mode, this.listQuery).then(res => {
                if (res.items.length) {
                    this.listQuery.page += 1;
                    this.list.push(...res.items)
                    this.total = res.total
                    $state.loaded()
                    if (this.list.length >= this.total) {
                        $state.complete();
                    }
                } else {
                    $state.complete();
                }
            })
        },
        handleLikeComments(item) {
            if (item.user_id != this.$store.state.auth.id) {
                toggleLike(4, item.id).then(res => {
                    const iii = this.list.findIndex(rr => rr.id == item.id)
                    if (iii >= 0) {
                        this.list[iii]['likes'] = res.likes
                        this.list[iii]['my_like'] = res.my_like
                    }
                })
            }
        },
        handleReplay(item) {
            const other_info = this.gsv(['phone'], item.user) || this.gsv(['email'], item.user)
            this.to = this.gsv(['name', this.$i18n.locale], item.user) + `(${other_info})`
            this.info.comment_id = item.id
            this.drawer = true
        },
        handleSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    doAnswer(this.info).then(() => {
                        st.scrollTo(0)
                        this.list = []
                        this.total = 0
                        this.listQuery.page = 1
                        this.infiniteId = +new Date()
                        this.drawer = false
                    })
                } else {
                    return false;
                }
            });
        }
    },
    created() {
        // this.getList()
    }
}
</script>