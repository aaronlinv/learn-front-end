<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程名称" />
      </el-form-item>

      <el-form-item>
        <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
          <el-option value="" label="全选中" />
          <el-option value="Normal" label="已发布" />
          <el-option value="Draft" label="未发布" />
        </el-select>
      </el-form-item>

      <el-form-item >
        <el-date-picker
          v-model="courseQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="courseQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getPageList()">查询</el-button>
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
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称"  />

      <el-table-column label="课程状态" width="100">
        <template slot-scope="scope">{{ scope.row.status==='Normal'?'已发布':'未发布' }}</template>
      </el-table-column>

      <el-table-column prop="lessonNum" label="课时数"  width="100"/>

      <el-table-column prop="gmtCreate" label="添加时间" width="180" />

      <el-table-column prop="viewCount" label="浏览数量" width="50" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/course/info/'+scope.row.id">
            <el-button class="btn" type="primary" size="mini" icon="el-icon-edit">编辑课程信息</el-button>
          </router-link>
<!-- 
        <router-link :to="'/course/edit/'+scope.row.id">
            <el-button class="btn" type="primary" size="mini" icon="el-icon-edit">编辑大纲信息</el-button>
          </router-link> -->

          <!-- scope.row.id 传递讲师id -->
          <el-button class="btn" type="danger" size="mini" icon="el-icon-delete"
            @click="removeDataById(scope.row.id)" >删除课程信息</el-button>
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
      @current-change="getPageList"
    />
  </div>
</template>


<script>
// 0.引入tacher.js
import course from '@/api/edu/course'

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
            limit: 10,
            // 总记录数
            total: 0,

            courseQuery: {
                // 属性可以不定义，上面使用到了会自动添加
            }

        }
    },
    created(){ // 3.页面渲染前执行，一般调用methods方法
        this.getPageList()
    },
    methods:{ 
        removeDataById(id){
            this.$confirm('此操作将删除课程, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                        course.deleteCourseInfo(id)
                    .then(response =>{
                        // 1.提示
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        // 2.回到列表，需要刷新
                        this.getPageList()

                    })
            })
        },
        
        // 获取全部讲师列表
        getList(){
            course.getListCourse()
            .then(response => {
                
                this.list = response.data.list
                
                
            })
            .catch(error => {
                console.log(error)
            })
        },
        // 获取分页讲师列表
        getPageList(page = 1){
          console.log("getPageList~~")
          console.log("page == >"+this.page)
          console.log("limit == >"+this.limit)
          console.log("courseQuery.title == >"+this.courseQuery.title)
          console.log("courseQuery.status == >"+this.courseQuery.status)
          console.log("courseQuery.begin == >"+this.courseQuery.begin)
          console.log("courseQuery.end == >"+this.courseQuery.end)
          
            this.page = page
            course.getCourseListPage(this.page,this.limit,this.courseQuery)
            .then(response => {
                console.log("response == >")
                console.log(response)
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
            this.courseQuery = {}
            // 2. 查询所有讲师信息
            this.getPageList()
        },
    }

}
</script>


<style  scoped>
.btn {
  margin-top: 2px;
  margin-bottom: 2px;
}

</style>