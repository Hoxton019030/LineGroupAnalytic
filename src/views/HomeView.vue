<template>
  <div class="home">
    <input type="file" name="file" id="" @change="handleFileChange" accept="text/plain">
    <button @click="test1">送出</button>
  </div>
  <div v-show="isUploadFile">
    <h1>{{ lineTitle }}</h1>
    <StickerStatisticVue />
    <ImageStatisticVue />
    <SpeakStatisticVue />
    <DaySpeakStatisticVuefrom />
    <!-- <UserJoinStatisticVue />
    <UserLeaveStatisticVue /> -->
  </div>
</template>


<script setup>
import DaySpeakStatisticVuefrom from './Statistic/DaySpeakStatistic.vue';
import SpeakStatisticVue from './Statistic/SpeakStatistic.vue';
import StickerStatisticVue from './Statistic/StickerStatistic.vue'
import UserJoinStatisticVue from './Statistic/UserJoinStatistic.vue'
import UserLeaveStatisticVue from './Statistic/UserLeaveStatistic.vue'
import ImageStatisticVue from './Statistic/ImageStatistic.vue'

import { computed, ref } from 'vue'
import { useStore } from 'vuex';


const store = useStore();
let isUploadFile = ref(false);
let chatStatic = ref(null)
let lineTitle = ref('')


const handleFileChange = async (event) => {
  
  isUploadFile.value = true
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    store.commit('setLineContent', reader.result)
    const lineContent = computed(() => store.state.lineContent);
    const speakerRank = await analyzeChat(lineContent.value)
    store.commit('setSpeakerRank', speakerRank)
  };
  // console.log(result);
  // isUploadFile = true
  reader.readAsText(file);
};



async function analyzeChat(fileContent) {
  const lines = fileContent.split('\n'); // 将文件内容按行拆分成数组
  //統計每個人的總發言數,Key放人,value做counter
  const speakingRecords = new Map()
  //統計群組每天的對話量,Key放day,value做counter
  const daySpeakRecord = new Map();
  //統計群組每天加入的人
  const joinRecord = new Map();
  //統計群組每天離開的人
  const leaveRecord = new Map();
  //找出對話的正則表達式
  const messageRegex = /[\u4E00-\u9FFF]{2}\d{2}:\d{2}\s(?!(.*加入聊天|.*已收回訊息|.*離開聊天|.*結束了Live talk)).+\s.+/;
  //找出日期目錄的正則表達式2023/02/27（一）
  const dateRegex = /^\d{4}\/\d{2}\/\d{2}/;
  //找出加入聊天的正則表達式
  const joinMessageRegex = /^[\u4E00-\u9FFF]{2}\w{2}:\w{2}\s\s\w{1,}加入聊天/;
  // 找出離開聊天室的正則表達式
  const leaveMessageRegex = /^[\u4E00-\u9FFF]{2}\w{2}:\w{2}\s\s\w{1,}離開聊天/;

  let currentDate = ''
  let stickerCount = 0;
  let imageCount = 0
  lineTitle.value = lines[0].slice(6, lines[0].length)
  store.commit('setLineTitle', lines[0].slice(6, lines[0].length))
  console.log(lines[0].slice(6, lines[0].length))
  lines.forEach(line => {
    //統計對話
    const message = line.match(messageRegex);
    if (message) {
      //在這邊先計算每日發言量
      daySpeakRecord.set(currentDate, daySpeakRecord.get(currentDate) + 1)
      const speaker = message.toString().split('\t')[1]
      //有時有些廢物訊息(通話/邀請)過濾掉
      if (speaker == "") {
        console.log(line)
        return
      }
      if (!speakingRecords.has(speaker)) {
        speakingRecords.set(speaker, 1)
      } else {
        let count = speakingRecords.get(speaker)
        speakingRecords.set(speaker, count + 1)
      }
    }
    //統計每日的總發言量
    const date = line.match(dateRegex)
    if (date) {
      const day = date[0];
      // console.log(day)
      if (!daySpeakRecord.has(day)) {
        daySpeakRecord.set(day, 0);
        currentDate = day
      }
    }
    //統計加入人數
    const joinMessage = line.match(joinMessageRegex)

    if (joinMessage) {
      // console.log(line)
      if (!joinRecord.has(currentDate)) {
        joinRecord.set(currentDate, 1)
      } else {
        joinRecord.set(currentDate, joinRecord.get(currentDate) + 1)
      }
    }

    const leaveMessage = line.match(leaveMessageRegex)
    if (leaveMessage) {
      if (!leaveRecord.has(currentDate)) {
        leaveRecord.set(currentDate, 1)
      } else {
        leaveRecord.set(currentDate, leaveRecord.get(currentDate) + 1)
      }
    }

    if (line.includes('[貼圖]')) {
      stickerCount++
    }
    //把貼圖的統計傳給store
    store.commit('setStickerStatistic', stickerCount)

    if (line.includes('[照片]')) {
      imageCount++
    }
    store.commit('setImageStatistic', stickerCount)

  });

  //計算發言
  const sortedSpeakingRecords = Array.from(speakingRecords.entries())
    .filter(([key, value]) => value !== 0)
    .sort((a, b) => b[1] - a[1]); // 根据值大小排序，从大到小
  //計算每日發言
  const sortedDaySpeakRecord = Array.from(daySpeakRecord.entries())
    .filter(([key, value]) => value !== 0)
    .sort((a, b) => b[1] - a[1]); // 根据值大小排序，从大到小
  store.commit('setDaySpeakRank', sortedDaySpeakRecord)
  //計算每日加入
  const sortedJoinRecord = Array.from(joinRecord.entries())
    .filter(([key, value]) => value !== 0)
    .sort((a, b) => b[1] - a[1]); // 根据值大小排序，从大到小
  store.commit('setUserJoinStatistic', sortedJoinRecord)

  //計算每日離開
  const sortedLeaveRecord = Array.from(leaveRecord.entries())
    .filter(([key, value]) => value !== 0)
    .sort((a, b) => b[1] - a[1]); // 根据值大小排序，从大到小
  store.commit('setUserLeaveStatistic', sortedLeaveRecord)

  chatStatic.value = sortedSpeakingRecords;

  console.log(sortedJoinRecord)
  return sortedSpeakingRecords;
}

async function calcSticker(fileContent) {
  const lines = fileContent.split('\n');
  let stickerCount = 0
  lines.forEach(line => {
    if (line.includes('[貼圖]')) {
      stickerCount++
    }
  });
}


function statisticSpeak(lineContent) {
}

async function test(fileContent) {
  const lines = fileContent.split('\n');
  const regex = /[\u4E00-\u9FFF]{2}\d{2}:\d{2}\s(?!(.*加入聊天|.*已收回訊息|.*離開聊天|.*結束了Live talk)).+\s.+/;
  const regex2 = /\d{4}\/\d{2}\/\d{2}/;

  const daySpeakRecord = new Map();
  let currentDate = ''

  lines.forEach(line => {
    // 檢查每一行是否包含日期
    const dayMatch = line.match(regex2);
    // console.log(dayMatch)
    if (dayMatch) {
      const day = dayMatch[0];
      // console.log(day)
      if (!daySpeakRecord.has(day)) {
        daySpeakRecord.set(day, 0);
        currentDate = day
      }
    }

    // 檢查每一行是否包含訊息
    const quote = line.match(regex)
    if (quote) {
      daySpeakRecord.set(currentDate, daySpeakRecord.get(currentDate) + 1);
    }
  });

  const sortedRecords = Array.from(daySpeakRecord.entries()).sort((a, b) => b[1] - a[1]);
  console.log('按照發言次數排序後的統計結果：', sortedRecords);
}

async function calcJoin(fileContent) {
  const joinRecord = new Map();
  let currentDate = ''
  const regex2 = /\d{4}\/\d{2}\/\d{2}/;
  const lines = fileContent.split('\n');
  const joinMessageRegex = /^[\u4E00-\u9FFF]{2}\w{2}:\w{2}\s\s\w{1,}加入聊天/;
  // const joinMessageRegex = /^[\u4E00-\u9FFF]{2}\w{2}:\w{2}\s\s\w{1,} 加入聊天/;
  lines.forEach(line => {

    const dayMatch = line.match(regex2);
    if (dayMatch) {
      const day = dayMatch[0];
      // console.log(day)
      if (!joinRecord.has(day)) {
        joinRecord.set(day, 0);
        currentDate = day
      }
    }
    const joinMessage = line.match(joinMessageRegex);
    if (joinMessage) {
      joinRecord.set(currentDate, joinRecord.get(currentDate) + 1)
    }
  });
  // console.log(joinRecord)


  const sortedRecords = Array.from(joinRecord.entries()).sort((a, b) => b[1] - a[1]);
  console.log('按照加入次數排序後的統計結果：', sortedRecords);

}

async function calcLeave(fileContent) {
  const joinRecord = new Map();
  let currentDate = ''
  const regex2 = /\d{4}\/\d{2}\/\d{2}/;
  const lines = fileContent.split('\n');
  const leaveMessageRegex = /^[\u4E00-\u9FFF]{2}\w{2}:\w{2}\s\s\w{1,}離開聊天/;
  // const joinMessageRegex = /^[\u4E00-\u9FFF]{2}\w{2}:\w{2}\s\s\w{1,} 加入聊天/;
  lines.forEach(line => {
    const dayMatch = line.match(regex2);
    if (dayMatch) {
      const day = dayMatch[0];
      // console.log(day)
      if (!joinRecord.has(day)) {
        joinRecord.set(day, 0);
        currentDate = day
      }
    }
    const joinMessage = line.match(leaveMessageRegex);
    if (joinMessage) {
      joinRecord.set(currentDate, joinRecord.get(currentDate) + 1)
    }
  });
  // console.log(joinRecord)


  const sortedRecords = Array.from(joinRecord.entries()).sort((a, b) => b[1] - a[1]);
  console.log('按照離開次數排序後的統計結果：', sortedRecords);

}

async function calcImage(fileContent) {
  const lines = fileContent.split('\n');
  // const joinMessageRegex = /^[\u4E00-\u9FFF]{2}\w{2}:\w{2}\s\s\w{1,} 加入聊天/;
  let imageCount = 0
  lines.forEach(line => {
    if (line.includes('[照片]')) {
      imageCount++
    }
  });
  console.log('照片總共有' + imageCount)
}









// const readFile =(event)=>{
//   const file =event.target.files[0]
//   const reader = new FileReader();
//       reader.onload = () => {
//         fileContent.value = reader.result;
//       };
//       reader.readAsText(file);
//       fileContent.value
// }



</script>
