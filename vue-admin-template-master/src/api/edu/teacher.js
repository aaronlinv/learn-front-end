import request from '@/utils/request'

export default {

    // 1. 获取讲师列表
    // 当前页 每页条数 条件对象
    getTeacherListPage(current,limit,teacherQuery) {
        return request({
            // url: '/eduservice/teacher/pageTeacherCondition/'+current+'/'+limit,
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            // 后端使用requestBody接收 
            // data表示把对象转换成json 进行传递
            data: teacherQuery
        })
    },
    // 删除讲师
    deleteTeacherId(id){
        return request({
            url: `/eduservice/teacher/${id}`,
            method: 'delete'
        })
    },
    // 添加讲师
    addTeacher(teacher){
        return request({
            url: `/eduservice/teacher/addTeacher`,
            method: 'post',
            // requesBody 
            data: teacher
        })
    }
}