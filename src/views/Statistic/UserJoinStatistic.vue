<template>
    <div>
      <div>每日加入統計</div>
      <table>
        <thead>
          <tr>
            <th>排名</th>
            <th>日期</th>
            <th>加入人數</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in userJoinStatistic" :key="index">
            <td>{{ index+1 }}</td>
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
  watch(() => store.state.userJoinStatistic, (newValue) => {
    userJoinStatistic.value = newValue
  })
  
  const userJoinStatistic = ref(store.state.userJoinStatistic)
  </script>
  