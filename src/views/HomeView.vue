<template>
  <div class="home">
    <input type="file" name="file" id="" @change="handleFileChange" accept="text/plain">
    <button @click="test1">送出</button>
  </div>
  <div v-show="isUploadFile">
    <SpeakStatisticVue ></SpeakStatisticVue>
  </div>
</template>


<script setup>

import { computed, ref } from 'vue'
import SpeakStatisticVue from './Statistic/SpeakStatistic.vue';
import { useStore } from 'vuex';
const store = useStore();
let isUploadFile = ref(false);
let chatStatic = ref(null)

const handleFileChange = async (event) => {
  isUploadFile.value = true
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    store.commit('setLineContent',reader.result)
    const lineContent = computed(() => store.state.lineContent);
    const speakerRank=await analyzeChat(lineContent.value)
    store.commit('setSpeakerRank',speakerRank)
    // console.log(typeof isUploadFile)
  };
  // isUploadFile = true
  reader.readAsText(file);
};



async function analyzeChat(fileContent){
  const lines = fileContent.split('\n'); // 将文件内容按行拆分成数组
  // console.log(lines)
  const speakingRecords =new Map()

  lines.forEach(line => {
    const regex = /[\u4E00-\u9FFF]{2}\d{2}:\d{2}\s(?!(.*加入聊天|.*已收回訊息|.*離開聊天|.*結束了Live talk)).+\s.+/;
    const match = line.match(regex); // 匹配日期、时间、发言者和发言内容
    if (match) {
      const quote=match.toString().split('\t')
      const speaker =quote[1]
      // console.log(speaker)
      if (!speakingRecords.has(speaker)) {
        speakingRecords.set(speaker,1)
      } else {
        // alert(speaker)
        // alert(quote)
        if(speaker==""){
          alert(speaker)
          alert(quote[2])
        }
        let count =speakingRecords.get(speaker)
        speakingRecords.set(speaker,count+1)
      }
    }
  });
  // alert(speakingRecords.length)
  const sortedRecords = Array.from(speakingRecords.entries())
    .sort((a, b) => b[1] - a[1]); // 根据值大小排序，从大到小
    chatStatic.value = sortedRecords;
  // console.log(sortedRecords)
  return sortedRecords;

}

async function test(fileContent) {
    const lines = fileContent.split('\n');
    const regex = /[\u4E00-\u9FFF]{2}\d{2}:\d{2}\s(?!(.*加入聊天|.*已收回訊息|.*離開聊天|.*結束了Live talk)).+\s.+/;
    const regex2 = /\d{4}\/\d{2}\/\d{2}/;

    const daySpeakRecord = new Map();
    let currentDate =''

    lines.forEach(line => {
        // 檢查每一行是否包含日期
        const dayMatch = line.match(regex2);
        // console.log(dayMatch)
        if (dayMatch) {
            const day = dayMatch[0];
            // console.log(day)
            if (!daySpeakRecord.has(day)) {
                daySpeakRecord.set(day, 0);
                currentDate=day
            }
        }

        // 檢查每一行是否包含訊息
        const quote=line.match(regex)
        if (quote) {
            daySpeakRecord.set(currentDate, daySpeakRecord.get(currentDate) + 1);
        }
    });

    const sortedRecords = Array.from(daySpeakRecord.entries()).sort((a, b) => b[1] - a[1]);
    console.log('按照發言次數排序後的統計結果：', sortedRecords);
}

async function calcJoin(fileContent) {
    const joinRecord = new Map();
    let currentDate =''
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
                currentDate=day
            }
        }
        const joinMessage = line.match(joinMessageRegex);
        if(joinMessage){
          joinRecord.set(currentDate,joinRecord.get(currentDate)+1)
        }
    });
    // console.log(joinRecord)


    const sortedRecords = Array.from(joinRecord.entries()).sort((a, b) => b[1] - a[1]);
    console.log('按照加入次數排序後的統計結果：', sortedRecords);

}

async function calcLeave(fileContent) {
    const joinRecord = new Map();
    let currentDate =''
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
                currentDate=day
            }
        }
        const joinMessage = line.match(leaveMessageRegex);
        if(joinMessage){
          joinRecord.set(currentDate,joinRecord.get(currentDate)+1)
        }
    });
    // console.log(joinRecord)


    const sortedRecords = Array.from(joinRecord.entries()).sort((a, b) => b[1] - a[1]);
    console.log('按照離開次數排序後的統計結果：', sortedRecords);

}

async function calcImage(fileContent) {
    const lines = fileContent.split('\n');
    // const joinMessageRegex = /^[\u4E00-\u9FFF]{2}\w{2}:\w{2}\s\s\w{1,} 加入聊天/;
    let imageCount =0
    lines.forEach(line => {
      if(line.includes('[照片]')){
        imageCount++
      }
    });
    console.log('照片總共有'+imageCount)
}



async function calcSticker(fileContent) {
  const lines = fileContent.split('\n');
    let stickerCount =0
    lines.forEach(line => {
      if(line.includes('[貼圖]')){
        stickerCount++
      }
    });
    console.log('貼圖總共有'+stickerCount)

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
