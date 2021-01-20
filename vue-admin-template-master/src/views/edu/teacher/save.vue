<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

          <!-- 头衔缩略图 -->
          <pan-thumb :image="teacher.avatar"/>
          <!-- 文件上传按钮 -->
          <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
          </el-button>

          <!--
      v-show：是否显示上传组件
      :key：类似于id，如果一个页面多个图片上传控件，可以做区分
      :url：后台上传的url地址
      @close：关闭上传组件
      @crop-upload-success：上传成功后的回调 -->
          <image-cropper
                        v-show="imagecropperShow"
                        :width="100"
                        :height="100"
                        :key="imagecropperKey"
                        :url="BASE_API+'/eduoss/fileoss'"
                        field="file"
                        @close="close"
                        @crop-upload-success="cropSuccess"/>

      </el-form-item>


      <!--  -->

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
  components: { ImageCropper, PanThumb },
  data(){
    return {
      // 不加属性也可
    teacher:{
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: ''
      },
      // 上传弹窗是否显示
      imagecropperShow:false,
      // 上传组件唯一标识key值
      imagecropperKey:0,
      BASE_API: process.env.BASE_API, // 接口API地址
      // 提交后 禁用保存按钮
      saveBtnDisabled:false
    }
  },
  created() {
    this.init()
  },
  watch:{ // 监听
  
    $route(to,from){// 路由发生变化，方法就会执行
      this.init()
    }
    
  },
  methods:{
    close(){// 关闭上传弹窗
      this.imagecropperShow=false
      // 初始化弹窗 避免上传了头像再点上传，窗口提示上传成功
      this.imagecropperKey = this.imagecropperKey +1


    },
    cropSuccess(data){// 上传成功方法
      // 关闭弹窗
      this.imagecropperShow=false
      // 初始化弹窗 避免上传了头像再点上传，窗口提示上传成功
      this.imagecropperKey = this.imagecropperKey +1

      // 接收上传后的地址
      this.teacher.avatar = data.url 

    },
    init(){
      // 判断路径是否有id值
      console.log('created')
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        // 根据id值查询讲师
        this.getInfo(id)
      }else{
        // bug 	点了编辑时候，显示数据，再点击添加，数据还存在
        // 清空表单数据
        this.teacher = {}
      } 
    },
    getInfo(id){
        teacherApi.getTeacherInfo(id)
          .then(repsonse => {
            this.teacher = repsonse.data.teacher
          })
          
    },
    saveOrUpdate(){
      // 判断是修改还是添加
      // 根据是否有id
      if(!this.teacher.id){
        // 添加
        this.saveTeacher()
      }else{
        this.updateTeacher()
      }
    },
    updateTeacher(){
      teacherApi.updateTeacherInfo(this.teacher)
        .then(response => {
        // 1. 提示成功
          this.$message({
              type: 'success',
              message: '修改成功!'
          });
          // 2.回到列表页 路由跳转
          this.$router.push({path:'/edu/teacher/list'})
        })
    },
    saveTeacher(){
        teacherApi.addTeacher(this.teacher)
        .then(repsonse =>{
          // 1. 提示成功
          this.$message({
              type: 'success',
              message: '添加成功!'
          });
          // 2.回到列表页 路由跳转
          this.$router.push({path:'/edu/teacher/list'})
        })
    }
  }
}
</script>