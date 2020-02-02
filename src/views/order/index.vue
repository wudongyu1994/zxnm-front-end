<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="pageSetting.title" placeholder="coming soon" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">-->
      <!--        Add-->
      <!--      </el-button>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="orderListRaw"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="orderNo" prop="orderNo" align="center" width="120">
        <template slot-scope="{row: {orderNo}}">
          <span>{{ orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="userId" align="center" width="70">
        <template slot-scope="{row: {userId}}">
          <span>{{ userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="expressNo" width="120">
        <template slot-scope="{row: {expressNo}}">
          <span>{{ expressNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="money" width="80">
        <template slot-scope="{row: {money}}">
          <span>{{ money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="orderStatus" width="100">
        <template slot-scope="{row: {orderStatus}}">
          <el-tag :type="statusEnum[orderStatus] | statusFilter">
            {{ statusEnum[orderStatus] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="payTime" width="140">
        <template slot-scope="{row: {payTime}}">
          <span>{{ payTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="deliveryTime" width="140">
        <template slot-scope="{row: {deliveryTime}}">
          <span>{{ deliveryTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="receiveTime" width="140">
        <template slot-scope="{row: {receiveTime}}">
          <span>{{ receiveTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="address" width="150">
        <template slot-scope="{row: {address}}">
          <span>{{ address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="phone" width="120">
        <template slot-scope="{row: {phone}}">
          <span>{{ phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="note" width="150">
        <template slot-scope="{row: {note}}">
          <span>{{ note }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.orderStatus<4" style="margin: 5px;" type="warning" size="mini" @click="handlePay_Rec(row)">
            {{ buttonTextMap[row.orderStatus] }}
          </el-button>
          <el-button style="margin: 5px;" type="success" size="mini" @click="handleShowGoods(row)">
            Goods
          </el-button>
          <el-button style="margin: 5px;" type="success" size="mini" @click="handleShowLogistics(row)">
            Logistics
          </el-button>
          <el-button v-if="hasRightModify" style="margin: 5px;" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)" />
          <el-button v-if="hasRightDelete" style="margin: 5px;" size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row)" />
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="pageSetting.page" :limit.sync="pageSetting.size" @pagination="getOrder" />

    <!--    编辑对话框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="id" prop="id">
          <span>{{ temp.id }}</span>
        </el-form-item>
        <el-form-item label="orderNo" prop="orderNo">
          <span>{{ temp.orderNo }}</span>
        </el-form-item>
        <el-form-item label="userId" prop="userId">
          <span>{{ temp.userId }}</span>
        </el-form-item>
        <el-form-item label="expressNo" prop="expressNo">
          <el-input v-model="temp.expressNo" />
        </el-form-item>
        <el-form-item label="money" prop="money">
          <span>{{ temp.money }}</span>
        </el-form-item>
        <el-form-item label="orderStatus" prop="orderStatus">
          <el-tag :type="statusEnum[temp.orderStatus] | statusFilter">
            {{ statusEnum[temp.orderStatus] }}
          </el-tag>
        </el-form-item>
        <el-form-item label="payTime" prop="payTime">
          <span>{{ temp.payTime }}</span>
        </el-form-item>
        <el-form-item label="deliveryTime" prop="deliveryTime">
          <span>{{ temp.deliveryTime }}</span>
        </el-form-item>
        <el-form-item label="receiveTime" prop="receiveTime">
          <span>{{ temp.receiveTime }}</span>
        </el-form-item>
        <el-form-item label="address" prop="address">
          <el-input v-model="temp.address" />
        </el-form-item>
        <el-form-item label="phone" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="note" prop="note">
          <el-input v-model="temp.note" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <!--    查看产品对话框-->
    <el-dialog title="ProductItem List" :visible.sync="productItemListVisible">
      <el-table
        v-loading="listLoading"
        :data="productItemList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="name" align="center" width="150">
          <template slot-scope="{row: {name}}">
            <span>{{ name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="proNo" align="center" width="100">
          <template slot-scope="{row: {proNo}}">
            <span>{{ proNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="price" align="center" width="80">
          <template slot-scope="{row: {price}}">
            <span>{{ price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="number" align="center" width="80">
          <template slot-scope="{row: {number}}">
            <span>{{ number }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="productItemListVisible = false">
          Close
        </el-button>
      </div>
    </el-dialog>

    <!--    物流对话框-->
    <el-dialog title="Logistics" :visible.sync="logisticsVisible">
      <el-table
        v-loading="listLoading"
        :data="logisticsList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="createTime" align="center" width="140">
          <template slot-scope="{row: {createTime}}">
            <span>{{ createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="address" align="center" width="200">
          <template slot-scope="{row: {address}}">
            <span>{{ address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="userId" align="center" width="140">
          <template slot-scope="{row: {userId}}">
            <span>{{ userId }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="logisticsVisible = false">
          Close
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderByPage, getProductItemByOrderId, modifyOrder, deleteOrder } from '../../api/order'
import { getLogisticsByOrderId } from '../../api/logistics'
import Pagination from '../../components/Pagination'
import { formatTime } from '../../utils'
import { MessageBox } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'Order',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        CREATED: 'danger', // red
        PAID: 'warning', // yellow
        PRODUCE: 'success', // green
        DELIVERY: '', // blue
        RECEIVED: 'info' // grey
      }
      return statusMap[status]
    },
    parseTime(time, format) {
      return formatTime(time, format)
    }
  },
  data() {
    return {
      hasRightDelete: false,
      hasRightModify: false,
      statusEnum: [
        'CREATED',
        'PAID',
        'PRODUCE',
        'DELIVERY',
        'RECEIVED'
      ],
      buttonTextMap: [
        'pay',
        'receive',
        'receive',
        'receive',
        'receive'
      ],
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      tableKey: 0,
      productItemList: [],
      logisticsList: [],
      orderListRaw: [],
      total: 0,
      listLoading: true,
      pageSetting: {
        page: 1,
        size: 10
      },
      temp: {
        id: undefined,
        createTime: new Date(),
        updateTime: new Date(),
        name: '',
        orderNo: '',
        userId: 1,
        orderStatus: 0,
        payTime: new Date(),
        deliveryTime: new Date(),
        receiveTime: new Date(),
        money: 0,
        address: '',
        phone: '',
        note: '',
        expressNo: ''
      },
      dialogFormVisible: false,
      productItemListVisible: false,
      logisticsVisible: false,
      dialogStatus: ''
    }
  },
  computed: {
    ...mapGetters([
      'authorities'
    ])
  },
  created() {
    this.hasRightDelete = this.authorities.some(val => val === '/order/delete')
    this.hasRightModify = this.authorities.some(val => val === '/order/modify')
    this.getOrder()
  },
  methods: {
    getOrder() {
      this.listLoading = true
      getOrderByPage(this.pageSetting).then(response => {
        this.orderListRaw = response.data
        this.total = response.count
        this.listLoading = false
      })
    },
    handleFilter() {
      this.pageSetting.page = 1
      this.getOrder()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        createTime: new Date(),
        updateTime: new Date(),
        name: '',
        orderNo: '',
        userId: 1,
        orderStatus: 0,
        payTime: new Date(),
        deliveryTime: new Date(),
        receiveTime: new Date(),
        money: 0,
        address: '',
        phone: '',
        note: '',
        expressNo: ''
      }
    },
    handlePay_Rec(row) {
      if (row.orderStatus === 0) {
        MessageBox.confirm('sure to pay?', 'Confirm Pay', {
          confirmButtonText: 'Pay',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.temp = Object.assign({}, row)
          this.temp.orderStatus++
          this.temp.payTime = new Date().getTime()
          modifyOrder(this.temp).then(() => {
            this.getOrder()
            this.$message.success('Paid successfully!')
          })
        })
      } else {
        MessageBox.confirm('sure to receive?', 'Confirm Receive', {
          confirmButtonText: 'Receive',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.temp = Object.assign({}, row)
          this.temp.orderStatus = 4
          this.temp.receiveTime = new Date().getTime()
          modifyOrder(this.temp).then(() => {
            this.getOrder()
            this.$message.success('Received successfully!')
          })
        })
      }
    },
    handleShowGoods(row) {
      const orderId = row.id
      getProductItemByOrderId(orderId).then(response => {
        this.productItemList = response.data
        this.productItemListVisible = true
      })
    },
    handleShowLogistics(row) {
      const orderId = row.id
      getLogisticsByOrderId(orderId).then(response => {
        this.logisticsList = response.data
        this.logisticsVisible = true
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      MessageBox.confirm('sure to delete?', 'Confirm delete', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'error'
      }).then(() => {
        this.temp = Object.assign({}, row) // copy obj
        deleteOrder(this.temp.id).then(() => {
          this.getOrder()
          this.$message.success('Delete successfully!')
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.updateTime = new Date().getTime()
          const tempData = Object.assign({}, this.temp)
          modifyOrder(tempData).then(() => {
            this.dialogFormVisible = false
            this.$message.success('Update successfully!')
            this.getOrder()
          })
        }
      })
    }
  }
}
</script>
