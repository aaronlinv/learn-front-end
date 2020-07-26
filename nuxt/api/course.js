import request from '@/utils/request'
export default {
    
    // 按条件查询课程
    getCourseList(page,limit,searchObj) {
    return request({
      url: `/eduservice/coursefront/getFrontCourseList/${page}/${limit}`,
      method: 'post',
      data:searchObj
      
    })
  },
    // 获取查询的分类数据
    getAllSubject() {
    return request({
      url: `/eduservice/subject/getAllSubject`,
      method: 'get',
    })
  }

}