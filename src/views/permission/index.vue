<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="coming soon" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        Add
      </el-button>
    </div>

    <el-table
      :data="listPermissionTree"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :default-expand-all="true"
    >
      <el-table-column prop="id" label="ID" width="150" />
      <el-table-column prop="name" label="Name" width="100" />
      <el-table-column prop="permission" label="Permission" width="180" />
      <el-table-column prop="description" label="Description" width="250" />
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Id" prop="id">
          <span>{{ temp.id }}</span>
        </el-form-item>
        <el-form-item label="ParentId" prop="parentId">
          <el-select v-model="temp.parentId" class="filter-item" placeholder="Please select">
            <el-option v-for="item in listId" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="Permission" prop="permission">
          <el-input v-model="temp.permission" />
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
import { getAllPermissionTree, createPermission, modifyPermission, deletePermission } from '../../api/permission'
import { MessageBox } from 'element-ui'

export default {
  name: 'Permission',
  data() {
    return {
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      listId: [],
      listPermissionTree: [],
      total: 0,
      listLoading: true,
      temp: {
        id: undefined,
        createTime: new Date(),
        updateTime: new Date(),
        name: '',
        permission: '',
        description: '',
        parentId: 0,
        children: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        permission: [{ required: true, message: 'permission is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getTree()
  },
  methods: {
    getId(targetList, srcList) {
      srcList.forEach(per => {
        targetList.push(per.id)
        if (per.children.length > 0) {
          this.getId(targetList, per.children)
        }
      })
    },
    getAllId(targetList, srcList) {
      this.getId(targetList, srcList)
      if (targetList.indexOf(0) === -1) targetList.push(0)
      targetList.sort((a, b) => a - b)
    },
    getTree() {
      this.listLoading = true
      getAllPermissionTree().then(response => {
        this.listPermissionTree = response.data
        this.listId = []
        this.getAllId(this.listId, response.data)
        this.total = response.count
        this.listLoading = false
      })
    },
    handleFilter() {
      this.getTree()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        createTime: new Date(),
        updateTime: new Date(),
        name: '',
        permission: '',
        description: '',
        parentId: 0,
        children: []
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
        deletePermission(this.temp.id).then(() => {
          this.getTree()
          this.$message.success('Delete successfully!')
        })
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.createTime = new Date().getTime()
          this.temp.updateTime = this.temp.createTime
          createPermission(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$message.success('Create successfully!')
            this.getTree()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.updateTime = new Date().getTime()
          const tempData = Object.assign({}, this.temp)
          modifyPermission(tempData).then(() => {
            this.dialogFormVisible = false
            this.$message.success('Update successfully!')
            this.getTree()
          })
        }
      })
    }
  }
}
</script>
