<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>
import subject from '@/api/edu/subject'
export default {
  data() {
    return {
      filterText: '',
      // 返回分类数据
      data2: [],
      defaultProps: {
        //   封装数据的properties名称
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
created(){
    this.getAllSubjectList()
},
  methods: {
    getAllSubjectList(){
        subject.getSubjectList()
        .then(response =>{
            this.data2 = response.data.list
        })
        
    },
    filterNode(value, data) {
      if (!value) return true
      // 搜索不区分大小写
      
    //   return data.title.indexOf(value) !== -1
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }
}
</script>

