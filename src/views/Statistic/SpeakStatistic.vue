<template>
    <div>
      <div>聊天室發言排行榜</div>
      <table>
        <thead>
          <tr>
            <th>排名</th>
            <th>用户</th>
            <th>发言数量</th>
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
  import { watch } from 'vue'
  import { ref } from 'vue';
  
  const store = useStore()
  
  // 监视 lineContent 的变化，并更新组件中的 lineContent
  watch(() => store.state.speakerRank, (newValue) => {
    speakerRank.value = newValue
  })
  
  const speakerRank = ref(store.state.speakerRank)
  </script>
  