import request from '@/utils/request'
export default {
    getListBanner() {
        // 查询Banner
        return request({
            url: `/educms/bannerfront/getAllBanner`,
            method: 'get'
        })
    }
}