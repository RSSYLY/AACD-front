<script>
import {get,post} from '@/utril/AxioRequest.js'
export default {
  data(){
    return{
      conferenceList:{
      },
      currentDate: new Date().toLocaleString(),
      groupedConferences: {}
    }
  },
  mounted() {
    this.updateDate();
    setInterval(this.updateDate, 1000);
    this.getConferenceDateList(1,25,null,null,['coverImg','f_821go86slk0','createdBy'])
  },
  methods: {
    updateDate() {
      this.currentDate = new Date().toLocaleString();
    },
    groupConferencesByMonth() {
      // 按时间分组会议

      // 获取会议列表
      const conferences = this.conferenceList.data;
      console.debug(conferences);

      // 按照时间倒序排序，考虑 f_lvc5m4zpoky 可能为 null 的情况
      conferences.sort((a, b) => {
        const dateA = a.f_lvc5m4zpoky ? new Date(a.f_lvc5m4zpoky) : 0;
        const dateB = b.f_lvc5m4zpoky ? new Date(b.f_lvc5m4zpoky) : 0;
        return dateB - dateA;
      });

      const groupedConferences = [];

      conferences.forEach(conference => {
        let year, month, day;

        if (conference.f_lvc5m4zpoky) {
          const date = new Date(conference.f_lvc5m4zpoky);
          year = date.getUTCFullYear().toString();
          month = (date.getUTCMonth() + 1).toString(); // 月份从0开始，所以要加1
          day = date.getUTCDate().toString();
        } else {
          year = 'unknown';
          month = 'unknown';
          day = 'unknown';
        }

        // 查找或创建年份组
        let yearGroup = groupedConferences.find(group => group.year === year);
        if (!yearGroup) {
          yearGroup = { year, data: [] };
          groupedConferences.push(yearGroup);
        }

        // 查找或创建月份组
        let monthGroup = yearGroup.data.find(group => group.month === month);
        if (!monthGroup) {
          monthGroup = { month, data: [] };
          yearGroup.data.push(monthGroup);
        }

        // 查找或创建日期组
        let dayGroup = monthGroup.data.find(group => group.day === day);
        if (!dayGroup) {
          dayGroup = { day, data: [] };
          monthGroup.data.push(dayGroup);
        }

        // 添加会议
        dayGroup.data.push(conference);
      });

      // 将结果赋值给 this.groupedConferences
      this.groupedConferences = groupedConferences;

      console.debug(groupedConferences);
    },
    async getConferenceDateList(page,pageSize,filter,sort,appends){
        // 从后端获取会议列表，
        try{

             const requestData=  await get('/api/t_ohwc0ble6if:list',{
            page: page,
            pageSize: pageSize,
            filter: filter,
            sort: sort,
             appends: appends
             });
          this.conferenceList = requestData.data;
          // 默认按照时间倒序排序
          this.groupConferencesByMonth();
        } catch (error) {
          console.error(error)
        }
    }

    }

}
</script>

<template>
  <div class="header">
    <div class="header-lift">
      <div class="header-title">会议</div>
      <div class="header-subtitle">近期的会议列表</div>
    </div>
    <div class="header-right">
      <div class="header-date">{{ currentDate }}</div>
    </div>
  </div>
  <div class="main-list">
    <div class="main-list-year" v-for="yearGroup in groupedConferences" :key="yearGroup.year">
      <div class="main-list-year-title">{{ yearGroup.year }}年</div>
      <div class="main-list-year-content">
        <div class="main-list-month" v-for="monthGroup in yearGroup.data" :key="monthGroup.month">
          <div class="main-list-month-title">{{ monthGroup.month }}月</div>
          <div class="main-list-month-content">
            <div class="main-list-day" v-for="dayGroup in monthGroup.data" :key="dayGroup.day">
              <div class="main-list-day-title">{{ dayGroup.day }}日</div>
              <div class="main-list-day-content">
                <div class="main-list-item" v-for="conference in dayGroup.data" :key="conference.id">
                  <div class="main-list-item-location">  <span  v-for="locationName in conference.f_821go86slk0" :key="locationName.id"> {{ locationName.name }}</span></div>
<!--                  TODO: 图片-->
                  <div class="main-list-item-cover" style="background-image: url("")"></div>
                  <div class="main-list-item-host"></div>
                  <div class="main-list-item-title"></div>
                  <div class="main-list-item-description"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
/* 头部 */
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px 40px;
}
.header-title{
  font-size: var(--mdui-typescale-display-small-size);
  font-weight: var(--mdui-typescale-display-medium-weight);
}
.header-subtitle{
  padding-top: 10px;
  font-size: var(--mdui-typescale-label-large-size);
  color: #666;
}
.header-date{
  font-size: var(--mdui-typescale-title-medium-size);
  font-weight: var(--mdui-typescale-display-medium-weight);
}
@media screen and (max-width: 600px){
  .header{
    padding: 40px 20px;
  }
  .header-date{
    display: none;
  }
}
/* 主体列表 */


</style>