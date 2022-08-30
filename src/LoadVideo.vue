<script setup lang="ts">
import { computed, ref } from 'vue'
// import { getDonwloadUrl, downloadBFile } from './utils/link'

type Link = {
  url: string
  type: 'video' | 'audio'
  text: string
  title: string
  progress?: string
}

const link = ref('https://www.bilibili.com/video/BV1KZ4y1e7cG?vd_source=29a1ec123bcf2daca305150b5b3a6a6b')
const getSource = async () => {
  if (!link.value) {
    alert('请输入链接')
    return
  }
  const render = require('electron').ipcRenderer
  const info = await render.invoke('link:GetLink', link.value)
  links.value.length = 0
  if (info.videoUrl) {
    links.value.push({
      url: info.videoUrl,
      text: '下载视频',
      type: 'video',
      title: info.title
    })
  }
  if (info.audioUrl) {
    links.value.push({
      url: info.audioUrl,
      text: '下载音频',
      type: 'audio',
      title: info.title
    })
  }
}
  
const render = require('electron').ipcRenderer
const links = ref<Link[]>([])
const progress = ref('')
const percentFn = (message: any, v: any) => {
  progress.value = (v * 100).toFixed(2) + '%'
}
const progressStyle = computed(() => ({
  width: progress.value
}))
render.on('percent', percentFn)
const startLoad = async (l: Link) => {
  const { url, title } = l
  console.log(url, title)
  const load = await render.invoke('link:LoadContent', url, title)

}
</script>
<template>
  <div class="head">
    <input type="text" class="link" v-model="link" placeholder="请输入链接" />
    <div class="btn" @click="getSource">获取</div>
  </div>
  <div class="main">
    <div class="btn" v-for="(link, index) in links" :key="index" @click="startLoad(link)">
      {{ link.text }}
    </div>
  </div>
  <div class="progress">
    <div class="bar">
      <span class="cur" :style="progressStyle"></span>
    </div>
    <div class="val">{{progress}}</div>
  </div>
</template>
<style lang="less" scoped>
.head {
  margin: 20px;
  display: flex;
  .link {
    height: 35px;
    border-radius: 5px;
    border: 1px solid #6cf;
    padding: 10px;
    flex: 1;
  }
}
.main {
  display: flex;
  margin-top: 20px;
  .btn {
    margin-right: 15px;
  }
}
.btn {
  width: 100px;
  height: 35px;
  background: #6cf;
  border-radius: 5px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.progress {
  display: flex;
  align-items: center;
  .bar {
    flex: 1;
    height: 10px;
    border-radius: 5px;
    background: rgba(102, 204, 255, .2);
    position: relative;
    overflow: hidden;
    .cur {
      position: absolute;
      left: 0;
      top: 0;
      height: 10px;
      background: aqua;
    }
  }
  .val {
    width: 80px;
    text-align: right;
  }
}
</style>
