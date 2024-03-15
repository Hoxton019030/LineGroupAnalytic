<template>
  <div class="home">
    <input type="file" name="file" id="" @:change="handleFileChange" accept="text/plain">
    <button @click="test">送出</button>
    <h2>文件内容：</h2>
      <pre>{{ chatStatic }}</pre>
  </div>
</template>


<script setup>

import { ref } from 'vue'


let fileContent = ref('')
let chatStatic = ref(null)

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async () => {
    fileContent.value = reader.result;
    fileContent=await analyzeChat(reader.result);
  };

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
  console.log(sortedRecords)
  return sortedRecords;

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
