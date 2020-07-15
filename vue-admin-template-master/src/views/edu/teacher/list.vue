<template>
  <div class="app-container">
    讲师列表
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
            limit: 10,
            // 总记录数
            total: 0,

            teacherQuery: {

            }

        }
    },
    created(){ // 3.页面渲染前执行，一般调用methods方法
        this.getList()
    },
    methods:{ // 2.创建具体方法，调用teacher.js定义的方法
        // 讲师列表
        getList(){
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
        }
    }

}
</script>