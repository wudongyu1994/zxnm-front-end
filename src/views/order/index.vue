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
      <el-table-column label="orderNo" prop="orderNo" align="center" width="80">
        <template slot-scope="{row: {orderNo}}">
          <span>{{ orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="userId" align="center" width="50">
        <template slot-scope="{row: {userId}}">
          <span>{{ userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="expressNo" width="80">
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
      <el-table-column label="payTime" width="80">
        <template slot-scope="{row: {payTime}}">
          <span>{{ payTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="deliveryTime" width="80">
        <template slot-scope="{row: {deliveryTime}}">
          <span>{{ deliveryTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="receiveTime" width="80">
        <template slot-scope="{row: {receiveTime}}">
          <span>{{ receiveTime }}</span>
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
      <el-table-column label="Actions" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" icon="el-icon-order" @click="handleShowGoods(row)">
            Goods
          </el-button>
          <br>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            Edit
          </el-button>
          <br>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="pageSetting.page" :limit.sync="pageSetting.size" @pagination="getOrder" />

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
          <span>{{ temp.expressNo }}</span>
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
  </div>
</template>

<script>
import { getOrderByPage, modifyOrder, deleteOrder } from '../../api/order'
import Pagination from '../../components/Pagination'
import { MessageBox } from 'element-ui'

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
    }
  },
  data() {
    return {
      statusEnum: [
        'CREATED',
        'PAID',
        'PRODUCE',
        'DELIVERY',
        'RECEIVED'
      ],
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      tableKey: 0,
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
      dialogStatus: ''
    }
  },
  created() {
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
    // handleCreate() {
    //   this.resetTemp()
    //   this.dialogStatus = 'create'
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    handleShowGoods(row) {

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
    // createData() {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       this.temp.createTime = new Date().getTime()
    //       this.temp.updateTime = this.temp.createTime
    //       // addOrder(this.temp).then(() => {
    //       //   this.dialogFormVisible = false
    //       //   this.$message.success('Create successfully!')
    //       //   this.getOrder()
    //       // })
    //     }
    //   })
    // },
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
