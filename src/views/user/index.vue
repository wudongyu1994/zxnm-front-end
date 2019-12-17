<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Username" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        Add
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="{row: {id}}">
          <span>{{ id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Username" align="center" width="80">
        <template slot-scope="{row: {username}}">
          <span>{{ username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" align="center" width="80">
        <template slot-scope="{row: {name}}">
          <span>{{ name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Sex" align="center" width="80">
        <template slot-scope="{row: {sex}}">
          {{ sexEnum[sex] }}
        </template>
      </el-table-column>
      <el-table-column label="Corp" align="center" width="80">
        <template slot-scope="{row: {corp}}">
          <span>{{ corp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Phone" align="center" width="120">
        <template slot-scope="{row: {phone}}">
          <span>{{ phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" align="center" width="150">
        <template slot-scope="{row: {email}}">
          <span>{{ email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center" width="150">
        <template slot-scope="{row: {status}}">
          <el-tag :type="statusEnum[status] | statusFilter">
            {{ statusEnum[status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getUser" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Id" prop="id">
          {{ temp.id }}
        </el-form-item>
        <el-form-item label="Username" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-if="dialogStatus==='create'" v-model="temp.password" />
          <span v-else>******</span>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="Sex" prop="sex">
          <el-select v-model="temp.sex" class="filter-item" placeholder="Please select">
            <el-option v-for="{index, item} in sexEnum" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="Corp" prop="corp">
          <el-input v-model="temp.corp" />
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="{index, item} in statusEnum" :key="index" :label="item" :value="index" />
          </el-select>
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
import { getUserByPage, createUser, updateUser } from '../../api/user'
import Pagination from '../../components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        disable: 'info',
        valid: 'success',
        locked: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      statusEnum: [
        'disable',
        'valid',
        'locked'
      ],
      sexEnum: [
        'F',
        'M'
      ],
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        username: undefined
      },
      temp: {
        id: undefined,
        name: '',
        username: '',
        password: '',
        corp: '',
        sex: 0,
        phone: '',
        email: '',
        status: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        username: [{ required: true, message: 'username is required', trigger: 'change' }],
        password: [
          { required: true, message: 'password is required', trigger: 'blur' },
          { mix: 4, message: 'password must longer than 3', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.listLoading = true
      getUserByPage(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.count
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getUser()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        username: '',
        password: '',
        corp: '',
        sex: 0,
        phone: '',
        email: '',
        status: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.temp).then(() => {
            this.list.unshift(this.temp)// 镜像函数 list.push(), unshift()方法可向数组的开头添加一个或更多元素,
            this.dialogFormVisible = false
            this.$message.success('Create successfully!')
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUser(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, tempData)
                break
              }
            }
            this.dialogFormVisible = false
            this.$message.success('Update successfully!')
          })
        }
      })
    }
  }
}
</script>
