<template>
    <div>
        <div>每日發言統計</div>
        <table>
            <thead>
                <tr>
                    <th>排名</th>
                    <th>日期</th>
                    <th>發言數</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, index) in daySpeakRank" :key="index">
                    <td>{{ index + 1 }}</td>
                    <span @click="renderDailySpeakStatisticComponent(user[0])">
                        <td>{{ user[0] }}</td>
                        <td>{{ user[1] }}</td>
                    </span>
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
let start = ref(false);
var find = ref(true)
const dateRegex = /\d{4}\/\d{2}\/\d{2}/;

function renderDailySpeakStatisticComponent(day) {
    const lineContent = computed(() => store.state.lineContent).value;
    const lines = lineContent.split('\n');
let count =0


    lines.forEach((line, index) => {
        let userMessage = ''
        //一開始是false不會執行這邊
        if (start.value) {
            const messageArray = line.split('\t');
            var message = messageArray[2]
            if(message==undefined){
                // start.value=false
                return
            }
            if(message.includes('離開聊天')){
                return
            }
            if (message.startsWith(`"`)) {
                userMessage += messageArray[2];
                let nextIndex = index + 1;
                while (find.value) {
                    const nextLine = lines[nextIndex];
                    if (nextLine.includes(`"`)) {
                        userMessage += lines[nextIndex]
                        find.value = false
                        console.log(userMessage)
                        count+=1
                    } else {
                        userMessage += lines[nextIndex]
                        nextIndex += 1
                    }
                }
                find.value=true
            }else{
                messageArray[0]
                userMessage=messageArray[2]
                console.log(userMessage)
                count+=1
            }
            
            if (line.match(dateRegex)) {
                start.value = false
            }
        }
        if(line==undefined){
            console.log("三小")
            start.value = true
            return
        }
        if (line.startsWith(day)) {
            // console.log(line)
            start.value = true
        }
    })
    
    console.log(count)
}

// 监视 lineContent 的变化，并更新组件中的 lineContent
watch(() => store.state.daySpeakRank, (newValue) => {
    daySpeakRank.value = newValue
})

const daySpeakRank = ref(store.state.daySpeakRank)
</script>
  