<template>
  <div class="app-container">
    <div style="margin: 20px;">
      <el-button class="filter-item" type="warning" @click="handleCart">
        <svg-icon icon-class="shopping" /> Shopping Cart
      </el-button>
      <el-button
        v-if="hasRightAdd"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        Add
      </el-button>
    </div>

    <!--    卡片列表-->
    <el-row style="margin: 20px;">
      <el-col v-for="(item, index) in proListRaw" :key="index" :span="6">
        <el-card class="box-card" :body-style="{ padding: '0px' }">
          <div class="card-wdy">
            <div style="background-color: #409EFF;height: 100px;width: 100%;">
              <svg-icon icon-class="product" class="card-icon-wdy" />
            </div>
            <div class="card-container-wdy">
              <div class="div-wdy">
                <span style="font-size: 20pt;">{{ item.name }}</span>
                <span style="font-size: 20pt;float: right">{{ '$'+item.price }}</span>
              </div>
              <div class="div-wdy">
                <span>{{ item.proNo }}</span>
                <br>
                <span>{{ item.description }}</span>
              </div>
              <div>
                <el-input-number v-model="nums[index]" :min="1" />
                <el-button type="warning" @click="addPro(item,index)">
                  <svg-icon icon-class="shopping" />
                </el-button>
              </div>
              <div class="div-wdy">
                <el-button
                  v-if="hasRightUpdate"
                  type="primary"
                  class="el-icon-edit"
                  @click="handleUpdate(item,index)"
                />
                <el-button
                  v-if="hasRightDelete"
                  type="danger"
                  class="el-icon-delete"
                  @click="deletePro(item,index)"
                />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!--    购物车对话框-->
    <el-dialog
      title="shopping cart"
      :visible.sync="cartVisible"
    >
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="productListInCart"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="product">
          <template slot-scope="{row: {name}}">
            <span>{{ name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="price for each">
          <template slot-scope="{row: {price}}">
            <span>{{ price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="number">
          <template slot-scope="{row: {number}}">
            <span>{{ number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="action">
          <template slot-scope="{ $index}">
            <el-button type="primary" icon="el-icon-minus" @click="numberMinus($index)" />
            <el-button type="primary" icon="el-icon-plus" @click="numberPlus($index)" />
            <el-button type="danger" icon="el-icon-delete" @click="deleteProItem($index)" />
          </template>
        </el-table-column>
      </el-table>

      <div class="div-wdy">
        <el-form
          ref="dataForm"
          :rules="rulesInOrder"
          :model="orderTemp"
          label-position="right"
          label-width="100px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item label="address" prop="address">
            <el-input v-model="orderTemp.address" />
          </el-form-item>
          <el-form-item label="phone" prop="phone">
            <el-input v-model="orderTemp.phone" />
          </el-form-item>
          <el-form-item label="note" prop="note">
            <el-input v-model="orderTemp.note" />
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <span style="font-size: 20pt;float: left;vertical-align: middle">
          {{ 'total price: $'+totalPrice }}</span>
        <el-button @click="cartVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" :disabled="totalPrice===0" @click="createOrder()">
          Order
        </el-button>
      </div>
    </el-dialog>

    <!--    创建/修改产品对话框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="id" prop="id">
          <span>{{ temp.id }}</span>
        </el-form-item>
        <el-form-item label="name" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="proNo" prop="proNo">
          <el-input v-model="temp.proNo" />
        </el-form-item>
        <el-form-item label="serial" prop="serial">
          <el-input v-model="temp.serial" />
        </el-form-item>
        <el-form-item label="price" prop="price">
          <el-input v-model.number="temp.price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="description" prop="description">
          <el-input v-model="temp.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createPro():updatePro()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getProduct, addProduct, modifyProduct, deleteProduct } from '../../api/product'
import { MessageBox } from 'element-ui'
import { mapGetters } from 'vuex'
import { addOrder } from '../../api/order'

export default {
  name: 'Product',
  data() {
    return {
      orderTemp: {
        address: '',
        phone: '',
        note: ''
      },
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      hasRightDelete: false,
      hasRightUpdate: false,
      hasRightAdd: false,
      orderNote: '',
      tempNum: 0,
      tableKey: 0,
      proListRaw: [],
      productListInCart: [],
      total: 0,
      nums: [],
      listLoading: true,
      temp: {
        id: undefined,
        createTime: new Date(),
        updateTime: new Date(),
        name: '',
        proNo: '',
        serial: '',
        price: 0,
        description: ''
      },
      cartVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        name: { required: true, message: 'name is required', trigger: 'blur' },
        proNo: { required: true, message: 'proNo is required', trigger: 'blur' },
        serial: { required: true, message: 'serial is required', trigger: 'blur' },
        price: [{ required: true, message: 'price is required', trigger: 'blur' },
          { type: 'number', message: 'price must be number', trigger: 'blur' }]
      },
      rulesInOrder: {
        address: { required: true, message: 'address is required', trigger: 'blur' },
        phone: [{ required: true, message: 'phone is required', trigger: 'blur' },
          { min: 11, max: 11, message: 'phone must be 11 numbers', trigger: 'blur' }]
      }
    }
  },
  computed: {
    totalPrice: function() {
      let sum = 0
      this.productListInCart.forEach(val => {
        sum += val.number * val.price
      })
      return sum
    },
    ...mapGetters([
      'authorities',
      'principal'
    ])
  },
  created() {
    this.hasRightAdd = this.authorities.some(val => val === '/product/add')
    this.hasRightUpdate = this.authorities.some(val => val === '/product/modify')
    this.hasRightDelete = this.authorities.some(val => val === '/product/delete')
    this.getPro()
  },
  methods: {
    getPro() {
      this.listLoading = true
      getProduct().then(response => {
        this.proListRaw = response.data
        this.total = response.count
        this.nums = [...Array(this.total)].map((x) => 1)
        console.log('nums= ' + this.nums)
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        createTime: new Date(),
        updateTime: new Date(),
        name: '',
        proNo: '',
        serial: '',
        price: 0,
        description: ''
      }
    },
    handleCart() {
      this.cartVisible = true
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(item, index) {
      this.temp = Object.assign({}, item)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createPro() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.createTime = new Date().getTime()
          this.temp.updateTime = this.temp.createTime
          addProduct(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$message.success('Create successfully!')
            this.getPro()
          })
        }
      })
    },
    createOrder() {
      const now = new Date().getTime()
      const orderVO = {
        createTime: now,
        updateTime: now,
        userId: this.principal.id,
        money: this.totalPrice,
        address: this.orderTemp.address,
        phone: this.orderTemp.phone,
        note: this.orderTemp.note,
        productItemList: this.productListInCart
      }
      addOrder(orderVO).then(() => {
        this.productListInCart = []
        this.orderTemp = {
          address: '',
          phone: '',
          note: ''
        }
        this.cartVisible = false
        this.$message.success('Create successfully!\nYou can see order in Order page')
      })
    },
    addPro(item, index) {
      const number = this.nums[index]
      const findIndex = this.productListInCart.findIndex(pro => pro.id === item.id)
      if (findIndex !== -1) {
        this.productListInCart[findIndex].number += number
      } else {
        this.$set(item, 'number', number)
        this.productListInCart.push(item)
      }
      this.$message.success('added to cart successfully!')
    },
    updatePro() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.updateTime = new Date().getTime()
          modifyProduct(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$message.success('Update successfully!')
            this.getPro()
          })
        }
      })
    },
    deletePro(pro, index) {
      MessageBox.confirm('sure to delete?', 'Confirm delete', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'error'
      }).then(() => {
        deleteProduct(pro.id).then(() => {
          this.getPro()
          this.$message.success('Delete successfully!')
        })
      })
    },
    deleteProItem(index) {
      this.productListInCart.splice(index, 1)
    },
    numberPlus(index) {
      this.productListInCart[index].number++
    },
    numberMinus(index) {
      if (this.productListInCart[index].number > 1) { this.productListInCart[index].number-- }
    }
  }
}
</script>

<style scoped>
  .box-card {
    width: 400px;
    max-width: 100%;
    margin: 20px auto;
  }
  .div-wdy {
    padding-bottom: 10px;
    padding-top: 10px;
  }
  .card-container-wdy{
    padding: 20px;
  }
  .card-wdy {
    width: 100%;
  }
  .card-icon-wdy{
    color: white;
    width: 100%;
    height: 100%;
    padding: 20px;
  }
</style>
