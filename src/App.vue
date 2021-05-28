<template>
  <div>
    <div>
      <input type="text" class="disk" v-model="inputDisk" />
    </div>
    <div @click="findFile" class="search">查询</div>
    <div class="menus">
      <div class="menu" @click="selectMenu(0)">{{ menus[0] }}</div>
      <div
        class="menu"
        v-for="(m, i) in menus.slice(1)"
        :key="m"
        @click="selectMenu(i + 1, m)"
      >
        \{{ m }}
      </div>
    </div>
    <ul>
      <li v-for="f in files" :key="f" class="item">
        <span
          :class="['val', { directory: f.isDirectory }]"
          @click="findMore(f)"
          >{{ f.name }}</span
        >
      </li>
    </ul>
  </div>
</template>
<script >
import { defineComponent, onMounted, reactive, ref } from 'vue';

export default defineComponent({
  setup() {
    const startFind = (disk) => {
      files.length = 0;
      const directory = disk.split('\\');
      menus.push(directory[directory.length - 1]);
      linkMenu(disk);
    };
    const inputDisk = ref('G');
    let files = reactive([]);
    const findFile = () => {
      const _disk = inputDisk.value.trim().toUpperCase();
      if (!_disk) {
        return;
      }
      if (_disk < 'A' || _disk > 'Z') {
        return;
      }
      const disk = inputDisk.value + ':\\';
      startFind(disk);
      menus.length = 0;
      menus.push(disk);
    };
    const findMore = (file) => {
      if (!file.isDirectory) {
        return;
      }
      const path = file.parent + '\\' + file.name;
      startFind(path);
    };

    // 添加导航菜单
    let menus = reactive([]);
    const linkMenu = (disk) => {
      const fs = require('fs');
      const path = require('path');
      if (!fs.existsSync(disk)) {
        console.log('该路径不存在');
        return;
      }
      if (fs.lstatSync(disk).isDirectory()) {
        let _files = fs.readdirSync(disk);
        const _list = [];
        for (let f of _files) {
          try {
            const _p = path.join(disk, f);
            const isDirectory = fs.lstatSync(_p).isDirectory();
            const _o = {
              name: f,
              isDirectory: isDirectory,
              parent: disk,
            };
            // _list.push(_o);
            files.push(_o);
          } catch (error) {}
        }
      } else {
        console.log(disk);
      }
    };
    const selectMenu = (index, name) => {
      if (index === 0) {
        findFile();
      } else {
        let _m = menus.slice(0, index + 1);
        if (_m.length === menus.length) {
          return;
        }
        menus.length = 0;
        menus.push(..._m);
        const disk = menus.join('\\');
        linkMenu(disk);
      }
    };

    onMounted(() => {
      console.log(123);
    });

    return {
      findFile,
      files,
      findMore,
      menus,
      selectMenu,
      inputDisk,
    };
  },
});
</script>
<style lang="less" scoped>
.disk {
  outline: none;
  background: none;
  width: 200px;
  height: 40px;
  padding: 0 10px;
  margin: 20px 0;
  border-radius: 5px;
  border: 1px solid #6cf;
}
.search {
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 3px;
  background: #6cf;
  color: #fff;
  display: inline-block;
}
.item {
  height: 30px;
  line-height: 30px;
  margin: 5px;
  cursor: pointer;
  .val {
    padding: 5px 0;
    &:hover {
      background: rgba(128, 128, 128, 0.2);
    }
    &.directory:hover {
      border-bottom: 1px solid rgba(102, 204, 255, 0.6);
    }
  }
}
.menus {
  display: flex;
  .menu {
    cursor: pointer;
    margin-right: 5px;
    &:active {
      text-decoration: underline;
      text-decoration-color: greenyellow;
    }
    &:last-child:active {
      text-decoration: none;
    }
  }
}
</style>
