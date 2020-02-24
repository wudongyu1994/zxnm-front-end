<template>
  <div class="app-container">
    <div class="filter-container">
      <h3>please select a device:</h3>
      <el-select v-model="selectId" style="width: 500px;" placeholder="请选择" @change="deviceChange()">
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
    <h3>details: </h3>
    <el-switch
      v-if="typeof selectId !== 'undefined'"
      :value="property.status==='ONLINE'"
      active-text="ONLINE"
      inactive-text="OFFLINE"
      disabled
    />

    <!--卡片列表-->
    <el-row v-if="typeof selectId !== 'undefined'">
      <el-col :span="6">
        <el-card class="box-card" :body-style="{ padding: '0px' }">
          <div style="width: 100%;">
            <div style="background-color: #409EFF;width: 100%;padding: 10px;">
              <svg-icon class="icon-wdy" icon-class="led" />
              <span  class="span-wdy">
                led status:
                {{ typeof property.isLedOn === 'undefined'? '--':property.isLedOn?'on':' off' }}
              </span>
            </div>
            <div style="margin: 10px;padding: 5px;">
              <el-button style="margin: 5px;" type="info" @click="turnOffLed">turn off</el-button>
              <el-button style="margin: 5px;" type="success" @click="turnOnLed">turn on</el-button>
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

      <div slot="footer" class="dialog-footer">
        <el-button @click="historyDialogVisible = false">
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
</template>

<script>
import {
  addDevice,
  deleteDevice,
  getAllDevice,
  getDeviceDevTempHistoryById,
  getDeviceLedHistoryById,
  getDevicePropertyById
} from '../../api/device'
import { MessageBox } from 'element-ui'
import { formatTime } from '../../utils'

export default {
  name: 'Device',
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
      total: 0,
      propertyHistory: [],
      listLoading: true,
      pageSetting: {
        page: 1,
        size: 10
      },
      property: {
        status: undefined,
        isLedOn: undefined,
        devTemp: undefined
      },
      temp: {
        id: undefined,
        createTime: new Date(),
        updateTime: new Date(),
        productKey: '',
        deviceName: ''
      },
      historyDialogVisible: false,
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
    getDevice() {
      this.listLoading = true
      getAllDevice().then(response => {
        // this.$set(this, 'deviceList', response.data)
        this.deviceList = response.data
        this.listLoading = false
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
    deviceChange() {
      const id = this.selectId
      getDevicePropertyById(id).then(res => {
        this.property = res.data
      })
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
</style>
