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
                <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
                <el-button type="text">删除</el-button>
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
                          <el-button type="text">删除</el-button>
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
  </div>
</template>

<script>
import chapter from "@/api/edu/chapter";
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
      }
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
    saveOrUpdate(){
        this.addChapter()
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
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>