<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="'/static/01.xls'">点击下载模版</a>
        </el-tag>

      </el-form-item>

      <el-form-item label="选择Excel">
        <!-- ref组件唯一标识 -->
        <!-- auto-upload 不需要点击上传就自动上传 -->
        <!-- 对应情况执行方法 -->
        <!-- disabled 点了上传 还能点第二次吗 -->
        <!-- 限制每次上传文件次数 -->
        <!-- accept 接收的文件类型 -->
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/eduservice/subject/addSubject'"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">{{ fileUploadBtnText }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    data() {
        return {
            BASE_API: process.env.BASE_API, // 接口API地址
            OSS_PATH: process.env.OSS_PATH, // 阿里云OSS地址
            fileUploadBtnText: '上传到服务器', // 按钮文字
            importBtnDisabled: false, // 按钮是否禁用,
            loading: false
        }
    },
    created(){

    },
    methods:{
        // 点击提交按钮
        submitUpload(){
            this.fileUploadBtnText = '正在上传'
            this.importBtnDisabled = true
            this.loading = true
            // upload 就是上面ref
            // js:document.getElementById("upload").submit()
            this.$refs.upload.submit()
        },
        // 上传成功
        fileUploadSuccess(response){
                if (response.success === true) {
                this.fileUploadBtnText = '导入成功'
                this.loading = false
                this.$message({
                    type: 'success',
                    message: response.message
                })
                // 路由跳转到课程分类界面
    } 
        },
        // 上传失败
        fileUploadError(){
              this.fileUploadBtnText = '导入失败'
              this.loading = false
              this.$message({
                type: 'error',
                message: '导入失败'
              })
        }
    }
}
</script>