<template>
  <div>
    <div>聊天室發言排行榜</div>
    <div>總對話數:{{ totalSpeaks }}</div>
    <table>
      <thead>
        <tr>
          <th>排名</th>
          <th>使用者</th>
          <th>發言次數</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in speakerRank" :key="index">
          <td>{{ index + 1 }}</td>
          <td> <span @click="renderPersonalSpeakStatisticComponent(user[0])"> {{ user[0] }} </span></td>
          <td>{{ user[1] }}</td>
        </tr>
      </tbody>

    </table>
  </div>
</template>
  
<script setup>
import { useStore } from 'vuex'
import { computed, watch } from 'vue'
import { ref } from 'vue';

const store = useStore()

let sum = 0;

// 监视 lineContent 的变化，并更新组件中的 lineContent
watch(() => store.state.speakerRank, (newValue) => {
  speakerRank.value = newValue
})
const speakerRank = ref(store.state.speakerRank)
var find = ref(true)

function renderPersonalSpeakStatisticComponent(username) {
  const userMessageRegex = new RegExp(`[\\u4E00-\\u9FFF]{2}\\d{2}:\\d{2}\\s${username}(?!(.*加入聊天|.*已收回訊息|.*離開聊天|.*結束了Live talk)).+\\s`);
  // const userMessageRegex = /[\u4E00-\u9FFF]{2}\d{2}:\d{2}\s(?!(.*加入聊天|.*已收回訊息|.*離開聊天|.*結束了Live talk)).+\s.+/;
  console.log(userMessageRegex)
  const lineContent = computed(() => store.state.lineContent).value;
  const lines = lineContent.split('\n');
  var count = 0
  lines.forEach((line, index) => {
    const messageArray = line.split('\t');
    let userMessage = ''

    if (messageArray[1] == username) {
      //如果句子是"開頭，代表有換行，要往下撈到下一個"
      if (messageArray[2].startsWith(`"`)) {
        // console.log('句子: '+ messageArray[2])
        userMessage += messageArray[2];
        let nextIndex = index + 1;
        
        while (find.value) {
          const nextLine = lines[nextIndex];
          if (nextLine.includes(`"`)) {
              userMessage += lines[nextIndex]
              find.value=false
              // console.log(userMessage)
              break;
            } else {
              userMessage += lines[nextIndex]
              nextIndex += 1
            }
        }
          find.value=true
          count+=1
      }else{
        userMessage=messageArray[2]
        count+=1
      }
      console.log(userMessage)
      


    }

  })
  console.log(count)

  // console.log(count)


}

const totalSpeaks = computed(() => {
  sum = 0
  for (let i = 0; i < speakerRank.value.length; i++) {
    sum += speakerRank.value[i][1]
  }
  return sum
});

</script>
  