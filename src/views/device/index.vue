<template>
  <div class="app-container">
    <div class="filter-container">
      <h3>please select a device:</h3>
      <el-select v-model="selectId" style="width: 500px;" placeholder="请选择" @change="deviceChange(false)">
        <el-option
          v-for="item in deviceList"
          :key="item.id"
          :label="item.productKey +', '+ item.deviceName"
          :value="item.id"
        />
      </el-select>
      <el-button class="filter-item" style="margin: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        Add
      </el-button>
      <el-button class="filter-item" style="margin: 10px;" type="danger" icon="el-icon-delete" @click="deleteDevice">
        Delete
      </el-button>
    </div>

    <hr>

    <div v-if="typeof selectId !== 'undefined'">
      <h3>details: </h3>
      <el-button style="margin-top: 10px;" type="primary" icon="el-icon-refresh" @click="deviceChange(true)">
        Refresh
      </el-button>
      <br>
      <br>
      <span>device status:</span>
      <el-tag :type="property.status==='ONLINE'?'success':'info'">
        {{ property.status==='ONLINE'?'ONLINE':'OFFLINE' }}
      </el-tag>

      <!--卡片列表-->
      <el-row>
        <el-col :span="6">
          <el-card class="box-card" :body-style="{ padding: '0px' }">
            <div style="width: 100%;">
              <div :class="eventList.length===0?'event-ok':'event-error'">
                <svg-icon class="icon-wdy" :icon-class="eventList.length===0?'check':'error'" />
                <span class="span-wdy">{{ eventList.length===0?'normal':'error count:'+eventList.length }}</span>
              </div>
              <div style="margin: 10px;padding: 5px;">
                <el-button style="margin: 5px;" type="success" @click="clearDeviceEvent()">clear event</el-button>
                <el-button style="margin: 5px;float: right;" round @click="showEventHistory()">history</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card" :body-style="{ padding: '0px' }">
            <div style="width: 100%;">
              <div style="background-color: #409EFF;width: 100%;padding: 10px;">
                <svg-icon class="icon-wdy" icon-class="led" />
                <span class="span-wdy">
                  led status:
                  {{ typeof property.isLedOn === 'undefined'? '--':property.isLedOn?'on':' off' }}
                </span>
              </div>
              <div style="margin: 10px;padding: 5px;">
                <el-button style="margin: 5px;" type="info" @click="setLed(false)">turn off</el-button>
                <el-button style="margin: 5px;" type="success" @click="setLed(true)">turn on</el-button>
                <el-button style="margin: 5px;float: right;" round @click="showLedHistory">history</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card" :body-style="{ padding: '0px' }">
            <div style="width: 100%;">
              <div style="background-color: #409EFF;width: 100%;padding: 10px;">
                <svg-icon class="icon-wdy" icon-class="temperature" />
                <span class="span-wdy">
                  dev temp:
                  {{ typeof property.devTemp ==='undefined'?' -- ':property.devTemp }}
                  'C
                </span>
              </div>
              <div style="margin: 10px;padding: 10px;">
                <el-button style="float: right;margin-bottom: 20px;" round @click="showTempHistory">history</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!--历史详情-->
      <el-dialog title="history" :visible.sync="historyDialogVisible">
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="propertyHistory"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="time" prop="time" align="center" width="180">
            <template slot-scope="{row: {time}}">
              <span>{{ time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="whichCard==='led'?'led status':'dev temp(\'C)'" align="center" width="120">
            <template slot-scope="{row}">
              <span v-if="whichCard==='led'">{{ row.isLedOn?'------on':'off-----' }}</span>
              <span v-else>{{ row.devTemp }}</span>
            </template>
          </el-table-column>
        </el-table>

        <!--图表-->
        <div class="chart-container">
          <chart height="100%" width="100%" :data="getData()" />
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="historyDialogVisible = false">
            close
          </el-button>
        </div>
      </el-dialog>

      <!--历史事件详情-->
      <el-dialog title="history" :visible.sync="eventHistoryDialogVisible">
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="eventHistoryList"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="time" prop="time" align="center" width="180">
            <template slot-scope="{row: {time}}">
              <span>{{ time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="error code" align="center" width="120">
            <template slot-scope="{row}">
              <span>{{ row.isError }}</span>
            </template>
          </el-table-column>
          <el-table-column label="is solved?" align="center" width="120">
            <template slot-scope="{$index}">
              <span>{{ $index>=eventList.length?'solved':'unsolved' }}</span>
            </template>
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button @click="eventHistoryDialogVisible = false">
            close
          </el-button>
        </div>
      </el-dialog>

      <!--添加设备-->
      <el-dialog title="add device" :visible.sync="addDeviceDialogVisible">
        <el-form ref="dataForm" :rules="addDeviceDialogRules" :model="temp" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="productKey" prop="productKey">
            <el-input v-model="temp.productKey" />
          </el-form-item>
          <el-form-item label="deviceName" prop="deviceName">
            <el-input v-model="temp.deviceName" />
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addDeviceDialogVisible = false">
            Cancel
          </el-button>
          <el-button type="primary" @click="createDevice()">
            Confirm
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  addDevice,
  deleteDevice,
  getAllDevice,
  getDeviceDevTempHistoryById, getDeviceEventById, getDeviceEventHistoryById,
  getDeviceLedHistoryById, clearDeviceEventById,
  getDevicePropertyById, setDeviceLedById
} from '../../api/device'
import Chart from './components/LineMarker'
import { MessageBox } from 'element-ui'
import { formatTime } from '../../utils'

export default {
  name: 'Device',
  components: { Chart },
  filters: {
    parseTime(time, format) {
      return formatTime(time, format)
    }
  },
  data() {
    return {
      tableKey: 0,
      whichCard: '',
      selectId: undefined,
      deviceList: null,
      roleListAll: null,
      listCheck: [],
      propertyHistory: [],
      listLoading: true,
      pageSetting: {
        page: 1,
        size: 10
      },
      eventList: [],
      eventHistoryList: [],
      property: {
        status: undefined,
        isLedOn: undefined,
        devTemp: undefined
      },
      chart: null,
      temp: {
        id: undefined,
        createTime: new Date(),
        updateTime: new Date(),
        productKey: '',
        deviceName: ''
      },
      historyDialogVisible: false,
      eventHistoryDialogVisible: false,
      addDeviceDialogVisible: false,
      dialogStatus: '',
      addDeviceDialogRules: {
        productKey: [{ required: true, message: 'productKey is required', trigger: 'blur' }],
        deviceName: [{ required: true, message: 'deviceName is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getDevice()
  },
  methods: {
    getData() {
      const xdata = this.propertyHistory
        .map(pro => formatTime(pro.time, '{y}-{m}-{d} {h}:{i}:{s}'))
        .reverse()
      const ydata = this.propertyHistory
        .map(pro => this.whichCard === 'led' ? pro.isLedOn : pro.devTemp)
        .reverse()
      const data = { xdata: [], ydata: [] }
      data.xdata = xdata
      data.ydata = ydata
      return data
    },
    getDevice() {
      this.listLoading = true
      getAllDevice().then(response => {
        // this.$set(this, 'deviceList', response.data)
        this.deviceList = response.data
        this.listLoading = false
      })
    },
    clearDeviceEvent() {
      clearDeviceEventById(this.selectId, { clearTime: new Date().getTime() }).then(res => {
        this.$message.success('clear event successfully!')
        this.eventList = []
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        createTime: new Date(),
        updateTime: new Date(),
        productKey: '',
        deviceName: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.addDeviceDialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteDevice() {
      if (typeof this.selectId === 'undefined') {
        this.$message.error('please select a device')
      } else {
        MessageBox.confirm('sure to delete?', 'Confirm delete', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'error'
        }).then(() => {
          deleteDevice(this.selectId).then(() => {
            this.$message.success('Delete successfully!')
            this.getDevice()
            this.selectId = undefined
          })
        })
      }
    },
    createDevice() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.createTime = new Date().getTime()
          this.temp.updateTime = this.temp.createTime
          addDevice(this.temp).then((res) => {
            this.addDeviceDialogVisible = false
            this.$message.success('Create successfully!')
            this.getDevice()
            this.selectId = res.data.id
          })
        }
      })
    },
    deviceChange(isRefresh) {
      const id = this.selectId
      getDevicePropertyById(id).then(res => {
        this.property = res.data
        getDeviceEventById(id).then(res => {
          this.eventList = res.data
          if (isRefresh) {
            this.$message.success('refresh successfully!')
          } else {
            this.$message.success('get history successfully!')
          }
        })
      })
    },
    showEventHistory() {
      if (typeof this.selectId === 'undefined') {
        this.$message.error('please select a device')
      } else {
        this.whichCard = 'event'
        getDeviceEventHistoryById(this.selectId).then(res => {
          this.eventHistoryList = res.data
          this.eventHistoryDialogVisible = true
          this.$message.success('get history successfully!')
        })
      }
    },
    showLedHistory() {
      if (typeof this.selectId === 'undefined') {
        this.$message.error('please select a device')
      } else {
        this.whichCard = 'led'
        getDeviceLedHistoryById(this.selectId).then(res => {
          this.propertyHistory = res.data
          this.historyDialogVisible = true
          this.$message.success('get history successfully!')
        })
      }
    },
    showTempHistory() {
      if (typeof this.selectId === 'undefined') {
        this.$message.error('please select a device')
      } else {
        this.whichCard = 'devTemp'
        getDeviceDevTempHistoryById(this.selectId).then(res => {
          this.propertyHistory = res.data
          this.historyDialogVisible = true
          this.$message.success('get history successfully!')
        })
      }
    },
    setLed(isTurnOn) {
      setDeviceLedById(this.selectId, { isTurnOn: isTurnOn }).then(res => {
        this.$message.success('send command successfully')
      })
    }
  }
}
</script>

<style scoped>
  .box-card {
    width: 400px;
    max-width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .icon-wdy{
    display: inline-block;
    color: white;
    width: 40px;
    height: 80px;
    vertical-align: middle;
  }
  .span-wdy{
    color: white;
    margin: 50px 10px;
    text-align: center;
  }
  .chart-container{
    position: relative;
    width: 100%;
    height: calc(100vh - 84px);
  }
  .event-ok{
    background-color: #67C23A;
    width: 100%;
    padding: 10px;
  }
  .event-error{
    background-color: #F56C6C;
    width: 100%;
    padding: 10px;
  }
</style>
