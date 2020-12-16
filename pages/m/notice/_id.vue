<template>
<div class="bg-white min-vh-100">
    <div class="px-2 mt-2" v-if="info.id">
        <h2>{{gsv(['title_' + $i18n.locale], info)}}</h2>
         <p class="font-09 text-dark9 mt-3">{{parseTime(info.created_at, '{y}-{m}-{d}')}}</p>
        <p class="my-3" v-html="gsv(['content_' + $i18n.locale], info)"></p>        
        <div class="mt-2 d-flex" v-if="info.assets.length">
            <p class="mr-2">{{$t('attachment')}}：</p>
            <div class="flex-1">
                <div class="d-flex justify-content-between align-items-center" v-for="item in info.assets" :key="item.id">
                    <img :src="getExtensionIcon(item.filename)" alt="" class="fit-cover" style="width:4rem; height:4rem">
                    <div class="ml-3">
                        <span class="border border-danger rounded px-2 py-1 text-danger" @click="handleDownload(item.url)">{{$t('attachment.download')}}</span>
                    </div>
                </div>
                
            </div>
        </div> 
        <!-- <div class="text-center pt-4 pb-5">
            <el-button type="primary" @click="handleSubmit" class="w-75" round>我已阅读</el-button>
        </div> -->
    </div>
</div>
</template>

<script>
import axios from 'axios'
import { getDetail } from '@/api/notice'
export default {
    scrollToTop: true,
    name: "AdsDetail",
    data() {
        return {
            // url: 'http://img4.imgtn.bdimg.com/it/u=4216693967,2080494303&fm=26&gp=0.jpg',
            info:{

            }
        }
    },
    methods: {
        forceFileDownload(response) {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            const file_name = "my_1431" + '.'+ response.headers['content-type'].split('/')[1]
            // console.log(response)
            link.setAttribute('download', file_name) //or any other extension
            document.body.appendChild(link)
            link.click()
        },
        handleSubmit() {

        },
        handleDownload(url) {
            // axios({
            //         method: 'get',
            //         url,
            //         responseType: 'arraybuffer'
            //     })
            //     .then(response => {                    
            //         this.forceFileDownload(response)
            //     })
            //     .catch(() => console.log('error occured'))
            window.open(url, '_blank')
        },
        getExtensionIcon(path){
            const extension =  path.split('.').pop()
            var path_icon = ''
            switch (extension) {
                case 'rar':
                    path_icon = '/icons/attatchment/rar.svg'
                    break;
                case 'zip':
                    path_icon = '/icons/attatchment/zip.svg'
                    break;
                case 'doc':
                    path_icon = '/icons/attatchment/doc.svg'
                    break;            
                case 'png':
                case 'svg':
                case 'jpg':
                case 'jpeg':
                case 'bmp':
                    path_icon = 'http://img.antway.cn/' + path
                    break;            
                default:
                    path_icon = '/icons/attatchment/attatchment.svg'
                    break;
            }
            return path_icon
        }
    },
    mounted(){
        getDetail(this.$route.params.id).then(res=>{
            this.info= res.notice
        })
    }

}
</script>
