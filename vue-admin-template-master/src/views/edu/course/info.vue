<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>


<el-form label-width="120px">

  <el-form-item label="课程标题">
    <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
  </el-form-item>

  <!-- 所属分类 TODO -->
    
    <!-- 一级分类 -->
    <el-form-item label="课程分类">
    <el-select
        v-model="courseInfo.subjectParentId"
        placeholder="一级分类" @change="subjectLevelOneChanged">
        <el-option
        v-for="subject in subjectOneList"
        :key="subject.id"
        :label="subject.title"
        :value="subject.id"/>
    </el-select>

    <!-- 二级分类 -->

        <el-select
            v-model="courseInfo.subjectId"
            placeholder="二级分类">
            <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
    </el-form-item>
    



  <!-- 课程讲师 TODO -->

    <!-- 课程讲师 -->
    <el-form-item label="课程讲师">
    <el-select
        v-model="courseInfo.teacherId"
        placeholder="请选择">
        <el-option
        v-for="teacher in teacherList"
        :key="teacher.id"
        :label="teacher.name"
        :value="teacher.id"/>
    </el-select>
    </el-form-item>




  <el-form-item label="总课时">
    <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
  </el-form-item>

  <!-- 课程简介 TODO -->
<!-- 课程简介-->
<el-form-item label="课程简介">
    <tinymce :height="300" v-model="courseInfo.description"/>
</el-form-item>

  <!-- 课程封面 TODO -->


<!-- 课程封面-->
<el-form-item label="课程封面" >
    <!-- show-file-list 不显示上传列表 -->
  <el-upload
  
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :action="BASE_API+'/eduoss/fileoss'"
    class="avatar-uploader">
    <img :src="courseInfo.cover" class="avatar-img">
  </el-upload>

</el-form-item>



  <el-form-item label="课程价格">
    <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
  </el-form-item>

  <el-form-item>
    <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
  </el-form-item>
</el-form>

  </div>
</template>

<script>
import course from "@/api/edu/course"
import subject from "@/api/edu/subject"
// 引入
import Tinymce from '@/components/Tinymce'



export default {
    // 声明
    components: { Tinymce },
    data(){
        return {
            saveBtndisabled:false,
            // courseInfo 添加了这个表单效果才会显示，里面属性不写也可
            courseInfo:{
                title: '',
                subjectId: '', // 二级分类id
                subjectParentId:'',// 一级分类id
                teacherId: '',
                lessonNum: 0,
                description: '',
                cover: '/static/01.jpeg',
                price: 0
            },
            // 讲师列表 封装所有讲师
            teacherList:[],

            // 一级分类
            subjectOneList:[],
            // 二级分类
            subjectTwoList:[],
            BASE_API: process.env.BASE_API, // 接口API地址
            courseId:''

        }
    },
    created(){
        // 路由地址存在id
        if(this.$route.params && this.$route.params.id){
            this.courseId = this.$route.params.id
            // 调用方法回显数据
            this.getInfo()
            
            
            // 查询所有分类包括一级分类和二级分类
            subject.getSubjectList()
                .then(response => {
                    
                    //获取一级分类
                    this.subjectOneList =  response.data.list
                    console.log(this.subjectOneList)

                    // 遍历一级分类，取对应一级分类的二级分类

                    for(var i = 0;i<this.subjectOneList.length;i++){
                        
                        var oneSubject = this.subjectOneList[i]

                        console.log(i)

                        
                        if(this.courseInfo.subjectParentId == oneSubject.id){
                            // 获取二级
                             this.subjectTwoList = oneSubject.children
                             console.log(this.subjectTwoList);

                        }else{
                             console.log("没有匹配到");
                        }
                    }
                })
                        // 初始化所有讲师
            this.getListTeacher()
        }else{
            // 初始化所有讲师
            this.getListTeacher()
            // 初始化一级分类
            this.getOneSubject()

        }
        
    },
    methods:{
        // 根据课程id 查信息
        getInfo(){
            course.getCourseInfo(this.courseId)
                .then(response =>{
                    this.courseInfo = response.data.courseInfoVo
                    console.log("根据课程id 查询到的课程 == >")
                    console.log(this.courseInfo)
                })
        },
        // 上传成功
        handleAvatarSuccess(res, file){
        console.log(res)// 上传响应
        console.log(URL.createObjectURL(file.raw)) // base64编码
        
        // courseInfo.cover 封面的src
        this.courseInfo.cover = res.data.url

        },
        // 上传之前调用方法
        beforeAvatarUpload(file){
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        // 点击一级分类 触发change 显示对应二级分类
        subjectLevelOneChanged(value){
            // value 就是一级分类id值
            // alert(value)

            for(var i =0 ;i<this.subjectOneList.length;i++){
                var oneSubject =  this.subjectOneList[i];

                if(value ==oneSubject.id ){
                    // 获取对应二级分类
                    this.subjectTwoList =  oneSubject.children
                    // 切换一级分类 清空二级分类显示
                    //  v-model="courseInfo.subjectId"
                    this.courseInfo.subjectId = ''
                }

            }

        },


        // 查询所有一级分类
        getOneSubject(){
            subject.getSubjectList()
                .then(response => {
                    this.subjectOneList = response.data.list
                })
        },

        // 查询所有讲师
        getListTeacher(){
            course.getListTeacher()
                .then(response => {
                    this.teacherList = response.data.items
                })
        },
        // 添加课程
        addCourse(){
            course.addCourseInfo(this.courseInfo)
                .then(response => {
                    // 提示
                    
                        this.$message({
                            type: 'success',
                            message: '添加课程信息成功!'});
                    // 跳转下一步
                    // 后端response 返回id
                    this.$router.push({path:`/edu/course/chapter/${response.data.courseId}`})
                })
          
        },
        
        // 修改课程
        updateCourse(){
            course.updateCourseInfo(this.courseInfo)
                .then(response =>{
                     this.$message({
                            type: 'success',
                            message: '修改课程信息成功!'});
                    // 跳转下一步
                    // 修改后端不会返回id 注意
                    this.$router.push({path:`/edu/course/chapter/${this.courseId}`})
                })
            
        },
        // 点击下一步 添加或者修改
        saveOrUpdate(){
            if(!this.courseInfo.id){
                // 添加
                this.addCourse()

            }else{
                // 修改
                this.updateCourse()

            }

        }  
    }
}
</script>

<style scoped>
/*  scoped 表示当前页面有效 */
.tinymce-container {
  line-height: 29px;
}

.avatar-img {
    /* width: 200px; */
    height: 200px;
}
</style>