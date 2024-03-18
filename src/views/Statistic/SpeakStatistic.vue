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
            <td>{{ user[0] }}</td>
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

 const totalSpeaks = computed(() => {
  sum =0
  for(let i =0 ;i< speakerRank.value.length;i++){
    sum+=speakerRank.value[i][1]
  }
  return sum
});
  
  </script>
  