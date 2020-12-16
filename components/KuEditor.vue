<template>
<div class="aw-editor-content fade-in" id="aweditor" style="width: 100%;">
    <div ref="editorElem" style="text-align:left"></div>
</div>
</template>

<script>
import eee from "@/static/json/emotions.json";
import e_gif from "@/static/json/gif.json";

const E = process.client ? require('wangeditor') : null
const Cookie = process.client ? require('js-cookie') : undefined
export default {
    name: "KuEditor",
    components: {},
    data() {
        return {
            editor: null
        };
    },
    props: ["value"],
    model: {
        event: 'change',
    },
    methods: {
        init() {
            this.editor = new E(this.$refs.editorElem);
            this.editor.customConfig.onchange = (html) => {
                // this.catchData(html);
                this.$emit('change', html)
            };
            this.editor.customConfig.uploadImgServer = "http://api.antway.cn/api/common/fileupload";
            this.editor.customConfig.uploadFileName = "file";
            const CSRF_TOKEN = Cookie.get('token')
            this.editor.customConfig.uploadImgParams = {
                // 如果版本 <=v3.1.0 ，属性值会自动进行 encode ，此处无需 encode
                // 如果版本 >=v3.1.1 ，属性值不会自动 encode ，如有需要自己手动 encode
                _token: CSRF_TOKEN
            }
            this.editor.customConfig.menus = [
                "head",
                "bold",
                "fontSize",
                "fontName",
                "italic",
                "underline",
                "strikeThrough",
                "foreColor",
                "backColor",
                "link",
                "list",
                "justify",
                "quote",
                "emoticon",
                "image",
                "table",
                "code",
                "undo",
                "redo",
                "html",
            ];
            this.editor.customConfig.lang = {
                '设置标题': 'title',
                '正文': 'p',
                '链接文字': 'link text',
                '链接': 'link',
                // '上传图片': 'Upload image',
                // '网络图片': 'Web image',
                // '图片': 'Image',
                // '上传': 'Upload',
                '创建': 'init',
                '对齐方式': 'Alignment',
                '设置列表': 'Setting',
                '有序列表': 'Numbering',
                '无序列表': 'Bullets',
                '靠左': 'left',
                '居中': 'center',
                '靠右': 'right',
                '背景色': 'Background',
                '文字颜色': 'Text Color',
                '字体': 'Font',
                // 还可自定添加更多
            }
            this.editor.customConfig.uploadImgHooks = {
                customInsert: function (insertImg, result, editor) {
                    insertImg(result);
                },
            };

            this.editor.customConfig.emotions = [{
                    title: this.$t('default'),
                    type: 'image',
                    content: eee
                },
                {
                    title: this.$i18n.locale =='en' ? 'Sina': '新浪',
                    type: 'image',
                    content: e_gif
                },
                {
                    // tab 的标题
                    title: 'emoji',
                    type: 'emoji',
                    // content -> 数组
                    content: '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😌 😍 😘 😗 😙 😚 😋 😜 😝 😛 🤑 🤗 🤓 😎 😏 😒 😞 😔 😟 😕 🙁  😣 😖 😫 😩 😤 😠 😡 😶 😐 😑 😯 😦 😧 😮 😲 😵 😳 😱 😨 😰 😢 😥 😭 😓 😪 😴 🙄 🤔 😬 🤐'.split(/\s/)
                },
                {
                    // tab 的标题
                    title: 'emoji手势',
                    type: 'emoji',
                    // content -> 数组
                    content: ['🙌', '👏', '👋', '👍', '👎', '👊', '✊', '️👌', '✋', '👐', '💪', '🙏', '️👆', '👇', '👈', '👉', '🖕', '🖐', '🤘']
                }
            ]

            this.editor.create();
            this.editor.txt.html(this.value)
        },
    },
    mounted() {
        this.init();
    },
};
</script>
