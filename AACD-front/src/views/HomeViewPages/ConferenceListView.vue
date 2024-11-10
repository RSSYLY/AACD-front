<script>
import {get,post,baseURL} from '@/utril/AxioRequest.js'
import Md from '@/components/Md.vue'
export default {
  components: {Md},
  data(){
    return{
      conferenceList:{
      },
      currentDate: new Date().toLocaleString(),
      groupedConferences: {},
      baseURL:baseURL,
      // 默认会议详情对话框的内容，当打开对话框时会包含指定的会议信息
      showingConference:{content:'sb'}
    }
  },
  mounted() {
    // 更新时间
    this.updateDate();
    setInterval(this.updateDate, 1000);
    // 获取会议列表
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
          year = '未知';
          month = '不详';
          day = '不明';
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
    },
    openConferenceInfoDialog(id) {
      // 打开会议详情对话框
      const conference = this.conferenceList.data.find(conference => conference.id === id);
      if (conference) {
        const dialog = document.querySelector('.con-info-dialog');
        dialog.open = true;
        // 设置对话框内容，包含会议信息，会议信息会在对话框中显示，这里只是简单的设置了一个字符串，实际上应该是一个包含会议信息的对象， 例如 { title: '会议标题', content: '会议内容' }，这个对象应该是从后端获取的，  也可以是一个包含会议信息的对象数组，这样可以实现在对话框中显示多个会议信息，  例如 [{ title: '会议1标题', content: '会议1内容' }, { title: '会议2标题', content: '会议2内容' }]
        this.showingConference = conference;}
    },
    closeConferenceInfoDialog() {
      // 关闭会议详情对话框
      const dialog = document.querySelector('.con-info-dialog');
      dialog.open = false;
    }
    },


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
      <div class="main-list-year-title" v-if="yearGroup.year !== new Date().getFullYear().toString()">{{ yearGroup.year }}年</div>
      <div class="main-list-year-content">
        <div class="main-list-month" v-for="monthGroup in yearGroup.data" :key="monthGroup.month">
          <div class="main-list-month-title">{{ monthGroup.month }}月</div>
          <div class="main-list-month-content">
            <div class="main-list-day" v-for="dayGroup in monthGroup.data" :key="dayGroup.day">
              <div class="main-list-day-title">{{monthGroup.month}}月{{ dayGroup.day }}日</div>
              <div class="main-list-day-content">
                <div class="main-list-item" v-for="conference in dayGroup.data" :key="conference.id" @click="openConferenceInfoDialog(conference.id)">
                  <div class="main-list-item-location"><mdui-icon name='location_on' style="margin-right: 5px;font-size: var(--mdui-typescale-label-large-size)"></mdui-icon><span  v-for="locationName in conference.f_821go86slk0" :key="locationName.id"> {{ locationName.name }}</span></div>
<!--                  TODO: 图片-->
                  <div class="main-list-item-cover">
                    <div class="main-list-item-cover-img" v-for="img in conference.coverImg" :style="{backgroundImage:'url('+ this.baseURL +img.url+')'}"></div>
                  </div>
                  <div class="main-list-item-host">{{ conference.host || "无举办方信息" }}</div>
                  <div class="main-list-item-title">{{ conference.f_7e25tpohq5o || "无标题" }}</div>
                  <div class="main-list-item-description">{{ conference.f_n3z4nrdlxd2 || "无描述"}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <mdui-dialog fullscreen class="con-info-dialog" close-on-esc="true" >
    <div class="dialog-header">
      <mdui-button-icon icon="arrow_back" @click="closeConferenceInfoDialog"></mdui-button-icon>
      <div class="dialog-title">{{ showingConference.f_7e25tpohq5o }}</div>
    </div>
    <div class="dialog-content">
      <div class="dialog-cover">
        <div class="dialog-cover-img" v-for="img in showingConference.coverImg" :style="{backgroundImage:'url('+ this.baseURL +img.url+')'}"></div>
      </div>
      <Md :md-content="this.showingConference.content" />
    </div>
  </mdui-dialog>

</template>

<style scoped>
/* 头部 */
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px 40px 0;
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
.main-list{
  padding: 0 40px;
}
@media screen and (max-width: 600px){
  .main-list{
    padding: 0 20px;
  }
}

.main-list-year{
 padding: 10px 0 ;
}
.main-list-year-title{
  font-size: var(--mdui-typescale-title-large-size);
  font-weight: var(--mdui-typescale-display-medium-weight);
  padding: 10px 0;
}
.main-list-year-content{
  display: flex;
  flex-direction: column;
}
.main-list-month{
}
.main-list-month-title{
  font-size: var(--mdui-typescale-title-large-size);
  font-weight: var(--mdui-typescale-display-large-weight);
  padding: 10px 0;
}
.main-list-month-content{
  display: flex;
  flex-direction: column;
}
.main-list-day{
}
.main-list-day-title{
  font-size: var(--mdui-typescale-title-small-size);
  font-weight: var(--mdui-typescale-display-small-size);
  padding: 10px 0;
}
.main-list-day-content{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 40px;
}
.main-list-item{
  border: .0625rem solid rgb(var(--mdui-color-surface-variant));
  border-radius: var(--mdui-shape-corner-medium);
  display: flex;
  flex-direction: column;
}
.main-list-item-location{
  width: fit-content;
  border-radius: var(--mdui-shape-corner-extra-large);
  padding: 10px 15px;
  margin: 10px;
  font-size: var(--mdui-typescale-label-medium-size);
  font-weight: var(--mdui-typescale-label-small-weight);
  background-color: rgb(var(--mdui-color-secondary-container));
  display: flex;
  align-items: center;
  color:rgb(var(--mdui-color-secondary))
}
.main-list-item-cover{

}
.main-list-item-cover-img{
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  border-radius: var(--mdui-shape-corner-medium);
}
.main-list-item-host{
  border-radius: var(--mdui-shape-corner-extra-large);
  padding: 10px 15px;
  margin: 10px;
  display: flex;
  align-items: center;
  width: fit-content;
  background-color: rgb(var(--mdui-color-surface-bright));
  font-size: var(--mdui-typescale-label-medium-size);
  font-weight: var(--mdui-typescale-label-small-weight);
  bottom:10px;


}
.main-list-item-title{
  padding: 10px;
  font-size: var(--mdui-typescale-title-large-size);
  font-weight: var(--mdui-typescale-title-medium-weight);
}
.main-list-item-description{
  padding: 10px;
  font-size: var(--mdui-typescale-title-small-size);
  font-weight: var(--mdui-typescale-title-small-weight);
}
@media screen and (max-width: 600px){
  .main-list-day-content{
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

.con-info-dialog {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
mdui-dialog::part(panel){
  padding: 0;
}
.dialog-header{
  display: flex;
  justify-content: flex-start;
  gap:10px;
  padding: 20px;
  align-items: center;
}
.dialog-title{
  font-size: var(--mdui-typescale-title-large-size);
  font-weight: var(--mdui-typescale-title-medium-weight);
  flex: 1;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

}
.dialog-cover{
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}
.dialog-cover-img{
  width: 100%;
  height: 200px;
  max-width: 400px;
  background-size: cover;
  background-position: center;
  border-radius: var(--mdui-shape-corner-medium);
}
.dialog-content{
  height: calc(100% - 160px);
  overflow-y: auto;
  padding: 40px;
  border-radius: var(--mdui-shape-corner-extra-large);
  background-color: rgb(var(--mdui-color-surface-bright));
}

@media screen and (max-width: 600px){
  .dialog-content{
    padding: 20px;
    height: calc(100% - 120px);
  }
}


</style>