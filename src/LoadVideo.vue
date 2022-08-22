<script setup lang="ts">
import { ref } from 'vue'
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
const links = ref<Link[]>([])
const startLoad = async (l: Link) => {
  const { url } = l
  const render = require('electron').ipcRenderer
  const load = await render.invoke('link:LoadContent', link.value)
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
</style>
