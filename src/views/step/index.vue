<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="getStep">
        Refresh
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        Add
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="listStep"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="id" prop="id" align="center" width="80" />
      <el-table-column label="name" prop="name" align="center" width="120" />
      <el-table-column label="description" prop="description" align="center" width="250" />
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
    <br>
    <hr>

    <!--模拟物联网提交生产线进行步骤-->
    <h3 style="margin-left: 80px">模拟物联网设备上传流程信息</h3>
    <el-form ref="stepDataForm" :rules="stepRules" :model="pi2psTemp" label-position="right" label-width="120px" style="width: 400px; margin-left:50px;">
      <el-form-item label="productItemId" prop="productItemId">
        <el-input v-model="pi2psTemp.productItemId" />
      </el-form-item>
      <el-form-item label="step" prop="step">
        <el-select v-model="pi2psTemp.presentStepId" class="filter-item" placeholder="Please select">
          <el-option v-for="step in listStep" :key="step.id" :label="step.name" :value="step.id" />
        </el-select>
      </el-form-item>
      <el-button class="filter-item" style="margin-left: 120px;" type="primary" icon="el-icon-plus" @click="handleStepSubmit">
        Submit
      </el-button>
      <!--      <el-button @click="test2" />-->
    </el-form>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Id" prop="id">
          <span>{{ temp.id }}</span>
        </el-form-item>
        <el-form-item label="name" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="description" prop="description">
          <el-input v-model="temp.description" />
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
import { getAllStep, addStep, modifyStep, deleteStep } from '../../api/step'
import { addPi2ps } from '../../api/step'
import { MessageBox } from 'element-ui'

export default {
  name: 'Step',
  data() {
    const validateSelect = (rule, value, callback) => {
      console.log('value ==> ')
      console.log(value)
      if (this.pi2psTemp.presentStepId === undefined) {
        callback(new Error('step is required'))
      } else {
        callback()
      }
    }
    return {
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      tableKey: 0,
      listStep: null,
      listLoading: true,
      temp: {
        id: undefined,
        createTime: new Date(),
        updateTime: new Date(),
        name: '',
        description: ''
      },
      pi2psTemp: {
        id: undefined,
        createTime: new Date(),
        updateTime: new Date(),
        productItemId: undefined,
        presentStepId: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'change' }]
      },
      stepRules: {
        productItemId: [{ required: true, message: 'productItemId is required', trigger: 'blur' }],
        step: { validator: validateSelect, trigger: 'blur' }
      }
    }
  },
  created() {
    this.getStep()
  },
  methods: {
    // test2() {
    //   console.info(this.pi2psTemp.presentStepId)
    // },
    getStep() {
      this.listLoading = true
      getAllStep().then(response => {
        this.listStep = response.data
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        createTime: new Date(),
        updateTime: new Date(),
        name: '',
        description: ''
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
        deleteStep(this.temp.id).then(() => {
          this.$message.success('Delete successfully!')
          this.getStep()
        })
      })
    },
    handleStepSubmit() {
      this.$refs['stepDataForm'].validate((valid) => {
        if (valid) {
          const pi2ps = this.pi2psTemp
          pi2ps.createTime = new Date().getTime()
          pi2ps.updateTime = pi2ps.createTime
          addPi2ps(pi2ps).then(res => {
            this.$message.success('submit successfully!')
          })
        }
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.createTime = new Date().getTime()
          this.temp.updateTime = this.temp.createTime
          addStep(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$message.success('Create successfully!')
            this.getStep()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.updateTime = new Date().getTime()
          const tempData = Object.assign({}, this.temp)
          modifyStep(tempData).then(() => {
            this.dialogFormVisible = false
            this.$message.success('Update successfully!')
            this.getStep()
          })
        }
      })
    }
  }
}
</script>
