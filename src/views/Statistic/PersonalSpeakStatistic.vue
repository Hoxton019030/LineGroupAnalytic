<template>
    <div>
        <h1></h1>
      <div>{{imageCount}}照片統計</div>
    </div>
  </template>
  
  <script setup>
  import { useStore } from 'vuex'
  import { watch } from 'vue'
  import { ref } from 'vue';
  
  const store = useStore()
  
  // 监视 lineContent 的变化，并更新组件中的 lineContent
  watch(() => store.state.imageCount, (newValue) => {
    imageCount.value = newValue
  })
  
  const imageCount = ref(store.state.imageCount)
  </script>
  