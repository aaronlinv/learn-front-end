import request from '@/utils/request'

export default {

    // 生成某一天统计数据
    createStaData(day) {
        return request({
            url: `/staservice/sta/registerCount/${day}`,
            method: 'post',
        })
    },

    // 获取统计数据
    getStaData(searchObj) {
        return request({
            url: `/staservice/sta/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
            method: 'get',
        })
    },
   
}