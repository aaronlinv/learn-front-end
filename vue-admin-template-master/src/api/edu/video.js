import request from '@/utils/request'

export default {
    //添加小节
    addVideo(video) {
        return request({
            url: `/eduservice/video/addVideo`,
            method: 'post',
            data:video
        })
    },

    // //根据id查询小节
    // getChapter(chapterId) {
    //     return request({
    //         url: `/eduservice/chapter/getChapterInfo/${chapterId}`,
    //         method: 'get'
    //     })
    // },

    // // 修改小节
    // updateChapter(chapter) {
    //     return request({
    //         url: `/eduservice/chapter/updateChapter`,
    //         method: 'post',
    //         data:chapter
    //     })
    // },

    
    // 删除小节
    deleteVideo(id) {
        return request({
            url: `/eduservice/video/`+id,
            method: 'delete',
        })
    },
}