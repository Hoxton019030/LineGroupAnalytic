<template>
    <div>
      <div>總共傳了 {{stickerStatistic}}貼圖統計</div>
    </div>
  </template>
  
  <script setup>
  import { useStore } from 'vuex'
  import { watch } from 'vue'
  import { ref } from 'vue';
  
  const store = useStore()
  
  // 监视 lineContent 的变化，并更新组件中的 lineContent
  watch(() => store.state.stickerStatistic, (newValue) => {
    stickerStatistic.value = newValue
  })
  
  const stickerStatistic = ref(store.state.stickerStatistic)
  </script>
  