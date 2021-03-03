<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item>
        <el-select v-model="searchObj.type" clearable placeholder="请选择">
          <el-option label="学员注册数统计" value="register_num"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="searchObj.begin"
          type="date"
          placeholder="选择开始日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="date"
          placeholder="选择截止日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-button
        :disabled="btnDisabled"
        type="primary"
        icon="el-icon-search"
        @click="showChart()">查询</el-button>
    </el-form>

    <div class="chart-container">
      <div id="chart" class="chart" style="height:500px;width:100%" />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import staApi from '@/api/sta'

export default {
    data(){
        return{
            searchObj: {
                type: '',
                begin: '',
                end: ''
            },
            btnDisabled: false,
            chart: null,
            title: '',
            xData: [],
            yData: []
        }
    },methods:{
         showChart() {
        staApi.getStaData(this.searchObj)
            .then(response =>{
                this.xData = response.data.date_calculatedList
                this.yData = response.data.numDataList
                // 调用生成图片方法
                this.setChart()
                // 这个如果放在括号外面执行，那么xData和yData取不到值
            })
        
    //   this.initChartData()
    //   this.setChart()
    },

    // 准备图表数据
    // initChartData() {

    // },

    // 设置图标参数
    setChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById('chart'))
      // console.log(this.chart)

      // 指定图表的配置项和数据
      var option = {
        // x轴是类目轴（离散数据）,必须通过data设置类目数据
        xAxis: {
          type: 'category',
        //   data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
             data:this.xData
        },
        // y轴是数据轴（连续数据）
        yAxis: {
          type: 'value'
        },
        // 系列列表。每个系列通过 type 决定自己的图表类型
        series: [{
          // 系列中的数据内容数组
        //   data: [820, 932, 901, 934, 1290, 1330, 1320],
             data:this.yData,
          // 折线图
          type: 'line'
        }],

        title: {
            text: '统计数据'
        },
        // x坐标轴触发提示
        tooltip: {
            trigger: 'axis'
        },

        // 区域缩放
        dataZoom: [{
        show: true,
        height: 30,
        xAxisIndex: [
            0
        ],
        bottom: 30,
        start: 10,
        end: 80,
        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle: {
            color: '#d3dee5'

        },
        textStyle: {
            color: '#fff'
        },
        borderColor: '#90979c'
        },
        {
        type: 'inside',
        show: true,
        height: 15,
        start: 1,
        end: 35
        }]
      }
      

      this.chart.setOption(option)
    }
    }
}
</script>