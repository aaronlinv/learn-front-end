import request from '@/utils/request'
export default {
    
    // 根据手机号发验证码
  sendCode(phone) {
      // 查询热门名师
    return request({
      url: `/edumsm/msm/send/${phone}`,
      method: 'get'
    })
  },
    //  注册
    registerMember(formItem){
        return request({
            url: `/educenter/member/register`,
            method: 'post',
            data:formItem
          })  
    }
}
