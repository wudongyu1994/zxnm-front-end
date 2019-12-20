<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="pageSetting.title" placeholder="coming soon" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        Add
      </el-button>
    </div>

    <el-tree
      :props="props"
      :data="permissionTemp"
      show-checkbox
      @check-change="handleCheckChange"
    />

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="roleListRaw"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="50">
        <template slot-scope="{row: {id}}">
          <span>{{ id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" align="center" width="200">
        <template slot-scope="{row: {name}}">
          <span>{{ name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Description" width="400">
        <template slot-scope="{row: {description}}">
          <span>{{ description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="pageSetting.page" :limit.sync="pageSetting.size" @pagination="getRole" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Id" prop="id">
          <span>{{ temp.id }}</span>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="temp.description" type="textarea" :rows="3" />
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
// import { getUserByPage, createUser, updateUser, deleteUser } from '../../api/user'
import { getRoleByPage } from '../../api/role'
import Pagination from '../../components/Pagination'
// import { MessageBox } from 'element-ui'

export default {
  name: 'Role',
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
      roleListRaw: null,
      props: {
        label: 'label',
        children: 'children'
      },
      permissionTemp: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      listCheck: [],
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
        username: '',
        password: '',
        corp: '',
        sex: undefined,
        phone: '',
        email: '',
        status: undefined,
        roleList: [],
        listRoleId: []
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
    this.getRole()
  },
  methods: {
    getRole() {
      this.listLoading = true
      getRoleByPage(this.pageSetting).then(response => {
        this.roleListRaw = response.data
        this.total = response.count
        this.listLoading = false
      })
    },
    handleFilter() {
      this.pageSetting.page = 1
      this.getRole()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        createTime: new Date(),
        updateTime: new Date(),
        name: '',
        username: '',
        password: '',
        corp: '',
        sex: undefined,
        phone: '',
        email: '',
        status: undefined,
        roleId: undefined
      }
    },
    handleCheckChange(data) {
      console.info(data)
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
      // MessageBox.confirm('sure to delete?', 'Confirm delete', {
      //   confirmButtonText: 'Delete',
      //   cancelButtonText: 'Cancel',
      //   type: 'error'
      // }).then(() => {
      //   this.temp = Object.assign({}, row) // copy obj
      //   deleteUser(this.temp.id).then(() => {
      //     for (const v of this.UserList) {
      //       if (v.id === this.temp.id) {
      //         this.UserList.splice(this.UserList.indexOf(v), 1)
      //         break
      //       }
      //     }
      //     this.total--
      //     this.$message.success('Delete successfully!')
      //   })
      // })
    },
    createData() {
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     this.temp.createTime = new Date().getTime()
      //     this.temp.updateTime = this.temp.createTime
      //     this.temp.listRoleId = this.listCheck
      //     createUser(this.temp).then(() => {
      //       this.dialogFormVisible = false
      //       this.$message.success('Create successfully!')
      //       this.getUser()
      //     })
      //   }
      // })
    },
    updateData() {
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     this.temp.updateTime = new Date().getTime()
      //     this.temp.listRoleId = this.listCheck
      //     const tempData = Object.assign({}, this.temp)
      //     updateUser(tempData).then(() => {
      //       for (const v of this.UserList) {
      //         if (v.id === this.temp.id) {
      //           const index = this.UserList.indexOf(v)
      //           this.UserList.splice(index, 1, tempData)
      //           break
      //         }
      //       }
      //       this.dialogFormVisible = false
      //       this.$message.success('Update successfully!')
      //       this.getUser()
      //     })
      //   }
      // })
    }
  }
}
</script>
