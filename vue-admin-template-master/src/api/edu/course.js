import request from '@/utils/request'

export default {

    // 添加课程信息
    addCourseInfo(courseInfo) {
        return request({
            url: `/eduservice/course/addCourseInfo`,
            method: 'post',
            data:courseInfo
        })
    },
    // 查询所有讲师
    getListTeacher() {
        return request({
            url: `/eduservice/teacher/findAll`,
            method: 'get'
        })
    },



     // 根据id 查询 课程信息
     getCourseInfo(id) {
        return request({
            url: `/eduservice/course/getCourseInfo/`+id,
            method: 'get'
        })
    },


     // 根据id 修改 课程信息
     updateCourseInfo(courseInfo) {
        return request({
            url: `/eduservice/course/updateCourseInfo`,
            method: 'post',
            data:courseInfo
        })
    },
    // 课程确认信息
    
    getPublishCourseInfo(id) {
        return request({
            url: `/eduservice/course/getPublishCourseInfo/`+id,
            method: 'get'
        })
    },
    // 发布课程
    publishCourse(id){
        return request({
            url: `/eduservice/course/publishCourse/`+id,
            method: 'post',
            data:id
        })
    },

    // 课程列表
    getListCourse(){
        return request({
            url: `/eduservice/course`,
            method: 'get'
        })
    },

    // 删除课程
    deleteCourseInfo(id) {
        return request({
            url: `/eduservice/course/`+id,
            method: 'delete'
        })
    },
    // 分页查询课程
    // 当前页 每页条数 条件对象
    getCourseListPage(current,limit,courseQuery) {
        return request({
            url: `/eduservice/course/pageCourseCondition/${current}/${limit}`,
            method: 'post',
            // 后端使用requestBody接收 
            // data表示把对象转换成json 进行传递
            data: courseQuery
        })
    }
}