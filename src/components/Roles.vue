<template>
  <div class="roles">
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item to="/rights">角色管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>
<el-button type="success" plain @click="showAddRoles">添加角色</el-button>
  <el-table :data="rolesList">
    <el-table-column type="expand">
      <template slot-scope="scope">
        <!-- 如果没有数据,显示的提示 -->
        <el-row v-if="scope.row.children.length===0">暂无权限</el-row>
        <!-- {{scope.row.children}} -->
        <!-- 1级菜单 -->
        <el-row v-for="label1 of scope.row.children" :key="label1.id" class="label1">
            <el-col :span="4"><el-tag closable @close="closeTag(label1.id,scope.row)">{{label1.authName}}</el-tag></el-col>
       <!-- 2级菜单 -->
          <el-col :span="20">
        <el-row v-for="label2 of label1.children" :key="label2.id"  >
          <el-col :span="4" ><el-tag closable type="success" class="label2"
           @close="closeTag(label2.id,scope.row)">{{label2.authName}}</el-tag></el-col>
          <!-- 3 级菜单 -->
        <el-col :span="20"><el-tag closable v-for="label3 of label2.children" :key="label3.id"
        type="danger" class="label3"  @close="closeTag(label3.id,scope.row)">{{label3.authName}}</el-tag></el-col>
        </el-row>
          </el-col>
         </el-row>
          </template>
    </el-table-column>
    <el-table-column label="角色名称" prop="roleName"  >
    </el-table-column>
    <el-table-column label="描述" prop="roleDesc"></el-table-column>
    <el-table-column label="操作">
       <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
          @click="handleEdit(scope.row)" plain></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" plain
         @click="handleDelete(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini"
            @click="handleAssign(scope.row)">分配权限</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 显示添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="AddRolesDialogVisible" width="40%">
      <el-form ref="form" :model="addform" label-width="80px" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addform.roleName"></el-input>
        </el-form-item>
         <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addform.roleDesc"></el-input>
        </el-form-item>
     </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="AddRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="AddRoles">确 定</el-button>
    </span>
</el-dialog>
  <!-- 显示编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRolesDialogVisible" width="40%">
      <el-form ref="form" :model="editform" label-width="80px" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editform.roleName"></el-input>
        </el-form-item>
         <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editform.roleDesc"></el-input>
        </el-form-item>
     </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoles">确 定</el-button>
    </span>
</el-dialog>

    <!-- 分配权限的所有权限对话框 -->
  <el-dialog title="角色授权" :visible.sync="AssignDialogVisible" width="50%">
      <el-tree
        ref="tree"
        :data="rightList"
        show-checkbox
        node-key="id"
        default-expand-all
       :default-checked-keys="rightchecked"
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="AssignDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editAssign">确 定</el-button>
    </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      AssignDialogVisible: false,
      AddRolesDialogVisible: false,
      editRolesDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      rightList: [],
      rightchecked: [],
      id: '',
      addform: {
        roleName: '',
        roleDesc: ''
      },
      editform: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      let res = await this.axios.get('roles')
      // console.log(res)
      this.rolesList = res.data
    },
    async getRightList() {
      let res = await this.axios.get(`rights/tree`)
      // console.log(res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.rightList = data
      }
    },
    // 删除权限标签
    async closeTag(rightid, roles) {
      // console.log(roles)
      // console.log(rightid, roles.id)
      let res = await this.axios.delete(`roles/${roles.id}/rights/${rightid}`)
      let { meta: { status }, data } = res
      if (status === 200) {
        roles.children = data
        this.$message.success('删除权限成功')
      }
    },
    // 添加角色按钮,显示对话框
    showAddRoles() {
      this.AddRolesDialogVisible = true
    },
    // 角色编辑按钮,显示对话框,数据回写
    async handleEdit(row) {
      this.editRolesDialogVisible = true
      // console.log(row)
      let res = await this.axios.get(`roles/${row.id}`)
      // console.log(res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.editform.roleId = data.roleId
        this.editform.roleName = data.roleName
        this.editform.roleDesc = data.roleDesc
      }
    },
    //  角色编辑完成,提交
    async editRoles() {
      let res = await this.axios.put(
        `roles/${this.editform.roleId}`,
        this.editform
      )
      // console.log(res)
      if (res.meta.status === 200) {
        this.getRolesList()
        this.editRolesDialogVisible = false
        this.$message.success('编辑角色成功')
      }
    },

    // 删除角色
    async handleDelete(id) {
      try {
        await this.$confirm('此操作将永久删除该角色, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        let res = await this.axios.delete(`roles/${id}`)
        if (res.meta.status === 200) {
          this.$message.success('删除成功')
          this.getRolesList()
        }
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    // 点击分配权限事件
    handleAssign(row) {
      let rightchecked = []
      this.AssignDialogVisible = true
      this.getRightList()
      this.id = row.id
      // console.log(11, row)
      row.children.forEach((l1) => {
        // this.rightchecked.push(l1.id)
        l1.children.forEach((l2) => {
          // this.rightchecked.push(l2.id)
          l2.children.forEach((l3) => {
            rightchecked.push(l3.id)
          })
        })
      })
      this.rightchecked = rightchecked
    },
    // 编辑权限完成提交事件
    async editAssign() {
      let getChecked = this.$refs.tree.getCheckedKeys()
      let getHalfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      let checkedAll = [...getChecked, ...getHalfCheckedKeys]
      console.log(checkedAll)
      let res = await this.axios.post(`roles/${this.id}/rights`, {
        rids: checkedAll.join()
      })
      let { meta: { status } } = res
      if (status === 200) {
        this.AssignDialogVisible = false
        this.getRolesList()
        this.$message.success('编辑权限完成')
      }
    },
    AddRoles() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // console.log(this.addform)
          let res = await this.axios.post('roles', this.addform)
          // console.log(res)
          let { meta: { status } } = res
          if (status === 201) {
            this.$message.success('添加角色成功')
            this.AddRolesDialogVisible = false
            this.getRolesList()
          }
        } else {
          return false
        }
      })
    }
  },
  // 渲染角色列表
  created() {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.label1 {
  padding-top: 5px;
  border-bottom: 1px dashed #ccc;
}
.label1:last-child {
  border: none;
}

.label3 {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
