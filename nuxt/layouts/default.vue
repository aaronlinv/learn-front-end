<template>
  <div class="in-wrap">
    <!-- 公共头引入 -->
    <header id="header">
      <section class="container">
        <h1 id="logo">
          <a href="#" title="橙汁学院">
            <img src="~/assets/img/logo.png" width="100%" alt="橙汁学院">
          </a>
        </h1>
        <div class="h-r-nsl">
          <ul class="nav">
            <router-link to="/" tag="li" active-class="current" exact>
              <a>首页</a>
            </router-link>
            <router-link to="/course" tag="li" active-class="current">
              <a>课程</a>
            </router-link>
            <router-link to="/teacher" tag="li" active-class="current">
              <a>名师</a>
            </router-link>
            <!-- <router-link to="/article" tag="li" active-class="current">
              <a>文章</a>
            </router-link>
            <router-link to="/qa" tag="li" active-class="current">
              <a>问答</a>
            </router-link> -->
          </ul>
          <!-- / nav -->

<!-- / nav -->
          <ul class="h-r-login">
            <!-- 数据中没有id值 显示登录 -->
              <li v-if="!loginInfo.id" id="no-login">
                  <a href="/login" title="登录">
                      <em class="icon18 login-icon">&nbsp;</em>
                      <span class="vam ml5">登录</span>
                  </a>
                  |
                  <a href="/register" title="注册">
                      <span class="vam ml5">注册</span>
                  </a>
              </li>
              <!-- <li v-if="loginInfo.id" id="is-login-one" class="mr10">
                  <a id="headerMsgCountId" href="#" title="消息">
                      <em class="icon18 news-icon">&nbsp;</em>
                  </a>
                  <q class="red-point" style="display: none">&nbsp;</q>
              </li> -->
              <li v-if="loginInfo.id" id="is-login-two" class="h-r-user">
                  <a href="/ucenter" title>
                      <img
                          :src="loginInfo.avatar"
                          width="30"
                          height="30"
                          class="vam picImg"
                          alt
                          >
                      <span id="userName" class="vam disIb">{{ loginInfo.nickname }}</span>
                  </a>
                  <a href="javascript:void(0);" title="退出" @click="logout()" class="ml5">退出</a>
              </li>
              <!-- /未登录显示第1 li；登录后显示第2，3 li -->
          </ul>




          <aside class="h-r-search">
            <form action="#" method="post">
              <label class="h-r-s-box">
                <input type="text" placeholder="输入你想学的课程" v-model="courseName" name="courseName" value>
                <button type="input" class="s-btn" @click.prevent="search()">
                  <em class="icon18">&nbsp;</em>
                </button>
              </label>
            </form>
          </aside>
        </div>
        <aside class="mw-nav-btn">
          <div class="mw-nav-icon"></div>
        </aside>
        <div class="clear"></div>
      </section>
    </header>
    <!-- /公共头引入 -->
      
    <nuxt/>

    <!-- 公共底引入 -->
    <footer id="footer">
      <section class="container">
        <div class>
          <h4 class="hLh30">
            <span class="fsize18 f-fM c-999">友情链接</span>
          </h4>
          <ul class="of flink-list">
            <li>
              <a href="https://www.icourse163.org/" title="中国大学慕课" target="_blank">中国大学慕课</a>
            </li>
          </ul>
          <div class="clear"></div>
        </div>
        <div class="b-foot">
          <section class="fl col-7">
            <section class="mr20">
              <section class="b-f-link">
                <a href="#" title="关于我们" target="_blank">关于我们</a>|
                <a href="#" title="联系我们" target="_blank">联系我们</a>|
                <a href="#" title="帮助中心" target="_blank">帮助中心</a>|
                <a href="#" title="资源下载" target="_blank">资源下载</a>|
                <span>服务热线：010-85293833</span>
                <span>Email：info@juice.com</span>
              </section>
              <section class="b-f-link mt10">
                <span>©2021版权均归橙汁学院所有</span>
              </section>
            </section>
          </section>
          <aside class="fl col-3 tac mt15">
            <section class="gf-tx">
              <span>
                <img src="~/assets/img/wx-icon.png" alt>
              </span>
            </section>
            <section class="gf-tx">
              <span>
                <img src="~/assets/img/wb-icon.png" alt>
              </span>
            </section>
          </aside>
          <div class="clear"></div>
        </div>
      </section>
    </footer>
    <!-- /公共底引入 -->
  </div>
</template>
<script>
import '~/assets/css/reset.css'
import '~/assets/css/theme.css'
import '~/assets/css/global.css'
import '~/assets/css/web.css'
import '~/assets/css/base.css'
import '~/assets/css/activity_tab.css'
import '~/assets/css/bottom_rec.css'
import '~/assets/css/nice_select.css'

import '~/assets/css/order.css'
import '~/assets/css/swiper-3.3.1.min.css'
import "~/assets/css/pages-weixinpay.css"

import cookie from 'js-cookie'
import loginApi from '@/api/login'

export default {
  data(){
    return {
      token:'',
      loginInfo:{
        id: '',
        age: '',
        avatar: '',
        mobile: '',
        nickname: '',
        sex: ''
      },courseName:''
    }
    
  },
  created(){
    // 获取微信登录时候 路径里面的token
    this.token = this.$route.query.token
    if(this.token){
      this.wxLogin()
    }

    this.showInfo()
  },
  methods:{
    // 微信登录
    wxLogin(){
        // 把token 放入cookie
      cookie.set('guli_token',this.token,{domain:'localhost'})
      cookie.set('guli_ucenter','',{domain:'localhost'})
      
      // 调用接口根据token获取用户信息
      loginApi.getLoginUserInfo()
        .then(response =>{
          this.loginInfo = response.data.data.userInfo 
          
      })
    },


    // 退出 清空cookie数据
    logout(){ 
        cookie.set('guli_token','',{domain:'localhost'})
        cookie.set('guli_ucenter','',{domain:'localhost'})
        // 跳转页面 
        window.location.href = "/";
    },


    // 从cookie中获取信息
      showInfo(){
          var userStr = cookie.get('guli_ucenter')
          // 字符串转换Json对象
            console.log(userStr)
            // debugger
          if(userStr){
            this.loginInfo = JSON.parse(userStr)
          }
      },

      search(){
        console.log("点击查询 == >"+this.courseName)
        this.$router.replace({
          path: '/course',
          query: {
            courseName: this.courseName
          }
})
      }
  }

};
</script>

<style scoped>
  .router-link{
    width: 200px;
  }

</style>