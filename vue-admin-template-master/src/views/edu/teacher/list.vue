<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="teacherQuery.name" placeholder="讲师名" />
      </el-form-item>

      <el-form-item>
        <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="teacherQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="teacherQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <!--  :data="list" -->
    <!-- === 判断类型 和值 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80" />

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">{{ scope.row.level===1?'高级讲师':'首席讲师' }}</template>
      </el-table-column>

      <el-table-column prop="intro" label="资历" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160" />

      <el-table-column prop="sort" label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <!-- scope.row.id 传递讲师id -->
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- :  v-bind 单向绑定 -->
    <!-- @ v-on -->
    <!-- current-change 中写getList 每次会自动传入page 自动封装了page -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>


<script>
// 0.引入tacher.js
import teacher from '@/api/edu/teacher'

export default {
    // 这种写法是错误的
    // data:{

    // },
    // data必须是方法

    data(){ // 1.定义变量和初始值
        return {
            // 查询后接口返回list
            list: null,

            page: 1,
            limit: 5,
            // 总记录数
            total: 0,

            teacherQuery: {
                // 属性可以不定义，上面使用到了会自动添加
            }

        }
    },
    created(){ // 3.页面渲染前执行，一般调用methods方法
        this.getList()
    },
    methods:{ // 2.创建具体方法，调用teacher.js定义的方法
        // 讲师列表
        // page 默认值1 
        getList(page = 1){
            this.page = page

            teacher.getTeacherListPage(this.page,this.limit,this.teacherQuery)
            .then(response => {
                // console.log(response)
                this.list = response.data.rows
                this.total = response.data.total
                console.log(this.list)
                console.log(this.total)
            })
            .catch(error => {
                console.log(error)
            })
        },
        resetData(){ // 清空表单
            // 1.表单内容清空
            this.teacherQuery = {}
            // 2. 查询所有讲师信息
            this.getList()
        },
        removeDataById(id){ // 删除讲师
            // 删除提示
            this.$confirm('此操作将永久删除讲师, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    // 先测试一下
                    // alert(id)
                    teacher.deleteTeacherId(id)
                    .then(response =>{
                        // 1.提示
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        // 2.回到列表，需要刷新
                        this.getList()
                    })
            })



            // .catch(error =>{
            //     console.log(error);
            // })
        }
    }

}
</script>