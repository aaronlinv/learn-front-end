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
    
}