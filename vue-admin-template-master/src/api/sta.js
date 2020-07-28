import request from '@/utils/request'

export default {

    // 生成某一天统计数据
    createStaData(day) {
        return request({
            url: `/staservice/sta/registerCount/${day}`,
            method: 'post',
        })
    },
   
}