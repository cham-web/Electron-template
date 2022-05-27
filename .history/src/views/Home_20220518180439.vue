<template>
  <div class="home">
    <el-input v-model="value" placeholder="请输入"></el-input>
    <p>设置快捷键1</p>
    <button @click="setHotKey(1)">设置ctrl+1</button>
    <button @click="setHotKey(2)">设置ctrl+2</button>
    <el-input v-model="name" @keydown.native.prevent="getCode"></el-input>
    <!-- <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column label="编号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.imeiNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.imeiName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="省" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
    </el-table> -->
    <el-button @click="send">点击</el-button>
    <!-- <spot-car></spot-car> -->
    <el-button @click="downloadFile">下载文件</el-button>

    <FilePreviewer ref="readFile"></FilePreviewer>
  </div>
</template>

<script>
// import SpotCar from '../components/SpotCar.vue'
// @ is an alias to /src
// import { qryImei } from '@/api/device'
import { bufToFile, blobToBuf } from '@/utils/util'
import FilePreviewer from '@/components/FilePreviewer/FilePreviewer'
import axios from 'axios'
const { ipcRenderer } = window.require('electron')

const keyObj = {
  ctrlKey: 'Ctrl',
  altKey: 'Alt',
  shiftKey: 'Shift'
}
export default {
  name: 'Home',
  components: {
    // SpotCar
    FilePreviewer
  },
  data () {
    return {
      value: null,
      name: '',
      controlKey: '',
      tableData: [
        {
          imeiNo: 'imeiNo1',
          imeiName: 'imeiName1',
          name: 'name1'
        },
        {
          imeiNo: 'imeiNo2',
          imeiName: 'imeiName2',
          name: 'name2'
        },
        {
          imeiNo: 'imeiNo3',
          imeiName: 'imeiName3',
          name: 'name3'
        },
        {
          imeiNo: 'imeiNo4',
          imeiName: 'imeiName4',
          name: 'name4'
        },
        {
          imeiNo: 'imeiNo5',
          imeiName: 'imeiName5',
          name: 'name5'
        },
        {
          imeiNo: 'imeiNo6',
          imeiName: 'imeiName6',
          name: 'name6'
        },
        {
          imeiNo: 'imeiNo7',
          imeiName: 'imeiName7',
          name: 'name7'
        },
        {
          imeiNo: 'imeiNo8',
          imeiName: 'imeiName8',
          name: 'name8'
        },
        {
          imeiNo: 'imeiNo9',
          imeiName: 'imeiName9',
          name: 'name9'
        },
        {
          imeiNo: 'imeiNo10',
          imeiName: 'imeiName10',
          name: 'name10'
        },
        {
          imeiNo: 'imeiNo11',
          imeiName: 'imeiName11',
          name: 'name11'
        },
        {
          imeiNo: 'imeiNo12',
          imeiName: 'imeiName12',
          name: 'name12'
        },
        {
          imeiNo: 'imeiNo13',
          imeiName: 'imeiName13',
          name: 'name13'
        },
        {
          imeiNo: 'imeiNo14',
          imeiName: 'imeiName14',
          name: 'name14'
        },
        {
          imeiNo: 'imeiNo15',
          imeiName: 'imeiName15',
          name: 'name15'
        },
        {
          imeiNo: 'imeiNo16',
          imeiName: 'imeiName16',
          name: 'name16'
        },
        {
          imeiNo: 'imeiNo17',
          imeiName: 'imeiName17',
          name: 'name17'
        },
        {
          imeiNo: 'imeiNo18',
          imeiName: 'imeiName18',
          name: 'name18'
        },
        {
          imeiNo: 'imeiNo19',
          imeiName: 'imeiName19',
          name: 'name19'
        },
        {
          imeiNo: 'imeiNo20',
          imeiName: 'imeiName20',
          name: 'name20'
        },
        {
          imeiNo: 'imeiNo21',
          imeiName: 'imeiName21',
          name: 'name21'
        },
        {
          imeiNo: 'imeiNo22',
          imeiName: 'imeiName22',
          name: 'name22'
        },
        {
          imeiNo: 'imeiNo23',
          imeiName: 'imeiName23',
          name: 'name23'
        },
        {
          imeiNo: 'imeiNo24',
          imeiName: 'imeiName24',
          name: 'name24'
        },
        {
          imeiNo: 'imeiNo25',
          imeiName: 'imeiName25',
          name: 'name25'
        },
        {
          imeiNo: 'imeiNo26',
          imeiName: 'imeiName26',
          name: 'name26'
        },
        {
          imeiNo: 'imeiNo27',
          imeiName: 'imeiName27',
          name: 'name27'
        },
        {
          imeiNo: 'imeiNo28',
          imeiName: 'imeiName28',
          name: 'name28'
        },
        {
          imeiNo: 'imeiNo29',
          imeiName: 'imeiName29',
          name: 'name29'
        },
        {
          imeiNo: 'imeiNo30',
          imeiName: 'imeiName30',
          name: 'name30'
        }
      ]
    }
  },
  created () {
    // qryImei().then(res => {
    //   console.log(res)
    //   this.tableData = res.lsList
    // })

  },
  methods: {
    downloadFile () {
      axios.get('http://dmc.yozocloud.cn/api/file/download?appId=yozoYyrdp1Br0048&fileVersionId=733720798279241728_0&sign=A93EDD909F2DCD577DF61D44346C4296A9C2B6B31FD4CB2E8F07870578BC95D7', {
        responseType: 'blob'
      }).then(async res => {
        // window.open(`http://office.qingshanboke.com/Default.aspx?url=${url}`)
        blobToBuf(res.data, (buffer, type) => {
          console.log(buffer, type)
          this.$refs.readFile.initBufferFile(buffer, bufToFile(buffer, ``.${type}`, type))
        })
      })
    },
    setControlKey (event) {
      if (event.keyCode === 16 || event.keyCode === 17 || event.keyCode === 18) {
        if (this.name) {
          this.controlKey = event.key
        }
      } else {
        this.controlKey = ''
      }
    },
    getCode (event) {
      if (event.keyCode !== 16 && event.keyCode !== 17 && event.keyCode !== 18) {
        this.name = event.key
        console.log(event)
        for (const key in keyObj) {
          if (event[key]) {
            this.name = keyObj[key] + '+' + this.name
          }
        }
        console.log(this.name)
      }
    },
    keydown (event) {
      console.log(event)
    },
    setHotKey (key) {
      // hotKeyFun(`CommandOrControl+${key}`)
      ipcRenderer.send('setHotkey', `CommandOrControl+${key}`)
    },
    send () {
      const { port } = this.$store.getters
      port.port.write('456123123123\n')
      port.backMessage(data => {
        console.log(data, '201-----------')
      })
    },
    jump () {
      this.$router.push('about')
    },
    logout () {
      ipcRenderer.send('exit', true)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
