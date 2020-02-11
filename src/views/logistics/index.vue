<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
      <el-form-item label="address" prop="address">
        <el-autocomplete
          v-model="temp.address"
          :fetch-suggestions="querySearch"
          class="inline-input"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="expressNo" prop="expressNo">
        <el-input v-model="temp.expressNo" />
      </el-form-item>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        Submit
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { addLogistics } from '../../api/logistics'
import { MessageBox } from 'element-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'Logistics',
  data() {
    return {
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      temp: {
        createTime: 0,
        updateTime: 0,
        expressNo: '',
        address: '',
        userId: 0
      },
      addressList: [
        { value: '浙江杭州西湖区服务部' },
        { value: '浙江杭州萧山中转部' },
        { value: '浙江杭州下沙中转部' },
        { value: '浙江杭州余杭中转部' },
        { value: '上海华新中转部' },
        { value: '上海夏阳区服务部' },
        { value: '江苏苏州中转部' },
        { value: '江苏无锡新区服务部' }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        address: [{ required: true, message: 'name is required', trigger: 'change' }],
        expressNo: [{ required: true, message: 'expressNo is required', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'principal'
    ])
  },
  methods: {
    querySearch(queryString, cb) {
      const addressList = this.addressList
      const results = queryString ? addressList.filter(add => (add.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)) : addressList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    handleCreate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const message = 'sure to submit?' +
            '\nexpressNo= ' + this.temp.expressNo +
            '\nuserId= ' + this.principal.id +
            '\naddress= ' + this.temp.address
          MessageBox.confirm(message,
            'Confirm Submit', {
              confirmButtonText: 'Submit',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }).then(() => {
            const temp = this.temp
            temp.userId = this.principal.id
            temp.createTime = new Date().getTime()
            temp.updateTime = temp.createTime
            addLogistics(temp).then(() => {
              this.$message.success('Submit successfully!')
            })
          })
        }
      })
    }
  }
}
</script>
