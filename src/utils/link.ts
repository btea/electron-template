import axios from 'axios'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export const getDonwloadUrl = (url: string) => {
  return axios
    .get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
        referer: 'https://www.bilibili.com'
      }
    })
    .then(({ data }) => {
      const info = JSON.parse(data.match(/<script>window\.__playinfo__=({.*})<\/script><script>/)?.[1])
      const videoUrl = info?.data?.dash?.video?.[0]?.baseUrl ?? info?.data?.dash?.video?.[0]?.backupUrl?.[0]
      const audioUrl = info?.data?.dash?.audio?.[0]?.baseUrl ?? info?.data?.dash?.audio?.[0]?.backupUrl?.[0]
      const title = data.match(/title="(.*?)"/)?.[1]?.replaceAll?.(/\\|\/|:|\*|\?|"|<|>|\|/g, '')

      if (videoUrl && audioUrl) {
        return { videoUrl, audioUrl, title }
      }

      return Promise.reject('获取下载地址失败')
    })
}

export const downloadBFile = (url: string, fullFileName: string, progressCallback: (per: number) => void) => {
  return axios
    .get(url, {
      responseType: 'stream',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
        referer: 'https://www.bilibili.com'
      }
    })
    .then(({ data, headers }) => {
      let currentLen = 0
      const totalLen = Number(headers['content-length'])

      return new Promise((resolve, reject) => {
        data.on('data', (chunk: any) => {
          currentLen += chunk.length
          progressCallback?.(currentLen / totalLen)
        })

        data.pipe(
          fs.createWriteStream(fullFileName).on('finish', () => {
            resolve({
              fullFileName,
              totalLen
            })
          })
        )
      })
    })
}

export const isWindows = os.platform() === 'win32'
export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id)
}
export function slash(p: string): string {
  return p.replace(/\\/g, '/')
}
