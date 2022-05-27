<template>
  <div>
    <!-- <header>
      <div class="menu">
        <router-link class="cur" v-for="(item, index) in permission_routes" :key="index" :to="item.path" tag="li">{{item.meta.title}}</router-link>
      </div>
      <div class="window-controls-container">
        <p>新宿店</p>
        <div class="balance">
          钱箱余额  ¥105650
        </div>
        <img src="" alt="">
        <img src="" alt="">
        <img src="" alt="">
        <img src="" alt="">
        <img src="" alt="" @click="logout">
      </div>
    </header>
    <div class="content">
      <router-view />
    </div> -->
    <el-container>
      <el-header>
        <div class="menu">
          <li class="cur" v-for="(item, index) in permission_routes" :key="index" @click="handleLoadChild(item, index)">{{item.meta.title}}</li>
        </div>
      </el-header>
      <el-container>
        <el-menu
          class="el-menu-vertical-demo"
          :default-active="activeMenu"
          :unique-opened="false"
          :collapse-transition="false"
          mode="vertical"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">导航一</span>
            </template>
            <el-submenu index="1-4">
              <span slot="title">选项4</span>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
        <el-main>Main</el-main>
      </el-container>
    </el-container>

  </div>
</template>
<script>
import { mapGetters } from 'vuex'
// import SerialPort from '@/utils/SerialPorts'
const { ipcRenderer } = window.require('electron')
export default {
  // 组件名称
  name: 'Layout',
  // 过滤器
  filters: {
  },
  // 组件
  components: {
  },
  // props类型
  props: {
  },
  // 数据
  data () {
    return {
    }
  },
  // 计算属性
  computed: {
    ...mapGetters(['permission_routes']),
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  },
  // 计算属性监听
  watch: {
  },
  // 创建时
  created () {
  },
  // 挂载完毕
  mounted () {
    // const Serial = new SerialPort({ path: 'COM6' })
    // console.log(Serial.list())
    // this.$store.dispatch('setPort', Serial)
    // Serial.port.write('123\n')
    // console.log(Serial)
    // Serial.backMessage(data => {
    //   console.log(data)
    // })
  },
  // 方法
  methods: {
    handleLoadChild (item, index) {
      console.log(item, index)
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    logout () {
      ipcRenderer.send('exit', true)
    }
  }
}
</script>

<style lang='less' scoped>
.content{
  width: 100%;
  height: calc(100vh - 72px);
  overflow-y: auto;
}
header{
  .flex-mixins();
  min-width: 1200px;
  height: 72px;
  -webkit-app-region: drag;
  background-color: rgb(55, 192, 130);
  color: black;
  padding: 0 24px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.menu{
  .flex-mixins();
  -webkit-app-region: no-drag;
  -webkit-user-select: none;
  li{
    width: 112px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: white;
    background: linear-gradient(to bottom, rgba(255,255,255,.1), rgb(128, 215, 175));
    text-align: center;
    font-family: 'pingfang';
    border-radius: 4px;
    margin-right: 24px;
    cursor: pointer;
    &.cur{
      background: linear-gradient(to bottom, #fecd85, #e08702);
    }
  }
}
.window-controls-container{
  -webkit-app-region: no-drag;
  -webkit-user-select: none;
  .flex-mixins();
  margin-left: auto;
  color: white;
  .balance{
    padding: 9px 14px;
    background: linear-gradient(to bottom, #4DB687, #72D3A7);
    border-radius: 4px;
    margin-left: 24px;
  }
  img{
    width: 20px;
    height: 20px;
    margin-left: 24px;
    cursor: pointer;
  }
}
</style>
