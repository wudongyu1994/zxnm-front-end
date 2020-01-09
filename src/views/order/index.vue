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
        <el-form-item label="Permission" prop="permission">
          <el-tree ref="tree" :data="listPermissionTree" show-checkbox default-expand-all node-key="id" highlight-current :props="myProps" @check-change="handlePerChange" />
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
import Pagination from '../../components/Pagination'
import { MessageBox } from 'element-ui'

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
      myProps: {
        label: 'name',
        children: 'children'
      },
      tableKey: 0,
      roleListRaw: [],
      listPermissionTree: [],
      listPermissionKey: [],
      props: {
        label: 'label',
        children: 'children'
      },
      listCheck: [],
      total: 0,
      listLoading: true,
      perLoading: true,
      pageSetting: {
        page: 1,
        size: 10
      },
      temp: {
        id: undefined,
        createTime: new Date(),
        updateTime: new Date(),
        name: '',
        description: '',
        permissionList: [],
        listPermissionId: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        name: { required: true, message: 'name is required', trigger: 'blur' }
      }
    }
  },
  created() {
    this.getRole()
    this.getTree()
  },
  methods: {
    getRole() {
      // this.listLoading = true
      // getRoleByPage(this.pageSetting).then(response => {
      //   this.roleListRaw = response.data
      //   this.total = response.count
      //   this.listLoading = false
      // })
    },
    getTree() {
      // this.listLoading = true
      // getAllPermissionTree().then(response => {
      //   this.listPermissionTree = response.data
      //   this.total = response.count
      //   this.listLoading = false
      // })
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
        description: '',
        permissionList: [],
        listPermissionId: []
      }
    },
    handlePerChange() {
      // console.log(this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()))
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs.tree.setCheckedKeys([])
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs.tree.setCheckedKeys(this.temp.permissionList.map(per => per.id))
      })
    },
    handleDelete(row) {
      MessageBox.confirm('sure to delete?', 'Confirm delete', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'error'
      }).then(() => {
        // this.temp = Object.assign({}, row) // copy obj
        // deleteRole(this.temp.id).then(() => {
        //   this.getRole()
        //   this.$message.success('Delete successfully!')
        // })
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.createTime = new Date().getTime()
          this.temp.updateTime = this.temp.createTime
          this.temp.listPermissionId = this.$refs.tree.getCheckedKeys()
          // addRole(this.temp).then(() => {
          //   this.dialogFormVisible = false
          //   this.$message.success('Create successfully!')
          //   this.getRole()
          // })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.updateTime = new Date().getTime()
          this.temp.listPermissionId = this.$refs.tree.getCheckedKeys()
          const tempData = Object.assign({}, this.temp)
          // modifyRole(tempData).then(() => {
          //   this.dialogFormVisible = false
          //   this.$message.success('Update successfully!')
          //   this.getRole()
          // })
        }
      })
    }
  }
}
</script>
