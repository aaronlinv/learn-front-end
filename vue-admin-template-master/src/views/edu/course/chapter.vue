<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
  
  <!-- 添加课程按钮 -->
  <el-button type="text" @click="openChapterDialog()">添加章节</el-button>


  <ul class="chanpterList">
      <li
          v-for="chapter in chapterVideoList"
          :key="chapter.id">
          <p>
              {{ chapter.title }}

            <span class="acts">
                <el-button style="" type="text" @click="openVideo(chapter.id)">添加小节</el-button>
                <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
                <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
            </span>
          </p>

          <!-- 视频 -->
          <ul class="chanpterList videoList">
              <li
                  v-for="video in chapter.children"
                  :key="video.id">
                  <p>{{ video.title }}
                      <span class="acts">
                          <el-button type="text">编辑</el-button>
                          <el-button type="text" @click="removeViedo(video.id)">删除</el-button>
                      </span>
                  </p>
              </li>
          </ul>
      </li>
  </ul>
    <el-form label-width="120px">

      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>


    <!-- 添加和修改章节表单 dialog -->
<el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
    <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
            <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
            <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
    </div>
</el-dialog>

<!-- 添加和修改课时Video表单 -->
<el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
  <el-form :model="video" label-width="120px">
    <el-form-item label="课时标题">
      <el-input v-model="video.title"/>
    </el-form-item>
    <el-form-item label="课时排序">
      <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
    </el-form-item>
    <el-form-item label="是否免费">
      <el-radio-group v-model="video.free">
        <el-radio :label="true">免费</el-radio>
        <el-radio :label="false">默认</el-radio>
      </el-radio-group>
    </el-form-item>


  <el-form-item label="上传视频">
      <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduvod/video/uploadAlyiVideo'"
            :limit="1"
            class="upload-demo">
      <el-button size="small" type="primary">上传视频</el-button>
      <el-tooltip placement="right-end">
          <div slot="content">最大支持1G，<br>
              支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
              GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
              MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
              SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
          <i class="el-icon-question"/>
      </el-tooltip>
      </el-upload>
  </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
    <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
  </div>
</el-dialog>


  </div>
</template>

<script>
import chapter from "@/api/edu/chapter";
import video from "@/api/edu/video";
export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      chapterVideoList:[],
      courseId:'',
      dialogChapterFormVisible:false, // 章节dialog
      // 封装章节数据
      chapter:{
        courseId:'',
        title:'',
        sort:0
      },
      video:{// 课时对象
        title: '',
        sort: 0,
        free: 0,
        videoSourceId: '',
        videoOriginalName:'' //上传名称

      },
      // Video弹窗
      dialogVideoFormVisible:false,

      // 视频
      fileList: [],//上传文件列表
      BASE_API: process.env.BASE_API // 接口API地址
    }
  },

  created() {
    console.log('chapter created')
    // 获取路由的 课程 id值
    // 有值
    if(this.$route.params && this.$route.params.id){
        this.courseId = this.$route.params.id
        // 根据课程id查询章节和小节
         this.getChapterVideo()
    }
  
    
  },

  methods: {

    // =========================视频=========================
    // 上传成功
    handleVodUploadSuccess(response, file, fileList){
        // 赋值获取的视频id
        this.video.videoSourceId = response.data.videoId
        // 赋值视频名称 file是上传的文件
        this.video.videoOriginalName = file.name
    },
    // 上传之前
    handleUploadExceed(){
        this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
    // =========================小节=========================
    // 小节弹窗
    removeViedo(id){
                        // 删除提示
            this.$confirm('此操作将删除小节, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    // 先测试一下
                    // alert(id)
                    video.deleteVideo(id)
                    .then(response =>{
                        // 1.提示
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        // 2.回到列表，需要刷新
                        this.getChapterVideo()

                    })
            })
    },
    openVideo(chapterId){
        this.dialogVideoFormVisible = true
        // 需要课程id和章节id
        
        this.video.chapterId = chapterId
        this.video.courseId = this.courseId

      
    } ,   
    addVideo(){
        video.addVideo(this.video)
          .then(response =>{
            // 设置课程id 
            // 写在这里会报错，所以写在上面 的openVideo
            
            console.log(this.video)
            // 关闭窗口 提示信息 刷新数据
            this.dialogVideoFormVisible=false
            this.$message({
              type: 'success',
              message: '添加小节信息成功!'})

            this.getChapterVideo()
          })
    },
    saveOrUpdateVideo(){
      this.addVideo()
    },


    // =========================章节=========================
    // 删除章节
    removeChapter(chapterId){
                  // 删除提示
            this.$confirm('此操作将删除章节, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    // 先测试一下
                    // alert(id)
                    chapter.deleteChapter(chapterId)
                    .then(response =>{
                        // 1.提示
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        // 2.回到列表，需要刷新
                                 this.getChapterVideo()

                    })
            })
    },
    // 修改章节弹窗,数据回显
  openEditChapter(chapterId){
    console.log("openEditChapter")
    this.dialogChapterFormVisible =true

      chapter.getChapter(chapterId)
        .then(response => {
          this.chapter = response.data.chapter
        })

      
  },

    // 打开添加弹窗

    openChapterDialog(){
        this.dialogChapterFormVisible =true
        // 清空数据残留
        this.chapter.title =''
        this.chapter.sort = 0
    },
    // 添加章节
    addChapter(){
      chapter.addChapter(this.chapter)
          .then(response =>{
            // 设置课程id
            this.chapter.courseId = this.courseId
            // 关闭窗口 提示信息 刷新数据
            this.dialogChapterFormVisible=false
            this.$message({
              type: 'success',
              message: '添加章节信息成功!'})
            this.getChapterVideo()
            

          })
    },
    // 修改章节
    updateChapter(){
        chapter.updateChapter(this.chapter)
        
          .then(response =>{
            this.dialogChapterFormVisible=false
            this.$message({
              type: 'success',
              message: '修改章节信息成功!'})
            this.getChapterVideo()
          })
    },

    saveOrUpdate(){
      //
      if(!this.chapter.id){
        this.addChapter()
      }else{
        this.updateChapter()
      }
    },
    // 根据课程id查询章节和小节
    getChapterVideo(){
        chapter.getAllChapterVideo(this.courseId)
          .then(response => {
              this.chapterVideoList = response.data.allChapterVideo
          })
    },


    previous() {
      console.log('previous')
      this.$router.push({ path: '/course/info/'+this.courseId })
    },

    next() {
      console.log('next')
      this.$router.push({ path: '/course/publish/'+this.courseId })
    }
  }
}
</script>

<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  /* float: left; */
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  /* 需要注释 否者按钮无法点击 */
  /* float: left; */
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>