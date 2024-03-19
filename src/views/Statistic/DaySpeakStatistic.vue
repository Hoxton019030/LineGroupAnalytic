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
const dateRegex = /^\d{4}\/\d{2}\/\d{2}/;

function renderDailySpeakStatisticComponent(day) {
    const lineContent = computed(() => store.state.lineContent).value;
    const lines = lineContent.split('\n');
    console.log('fuck')
    //把當天的訊息存成dailyMessage
    let dailyMessage = ''
    let count = 0
    lines.forEach((line, index) => {
        // const day = line.match(dateRegex)
        if (start.value) {
            const lineArray=line.split('\t')
            // console.log(lineArray)
            if(lineArray[2]){
                //代表是多行
                if(lineArray[2].startsWith('"')){
                    let currentIndex =index
                    let userMessage=''
                    let findIt=true
                    console.log(lineArray[2])
                    while(findIt){
                        currentIndex+=1
                        userMessage = line[currentIndex]
                        console.log(userMessage)
                        if(lineArray[0].includes('"')){
                            findIt =false
                        }
                    }
                    console.log(userMessage)
                }
            }
            // if(lineArray.length==3)
            // if(lineArray[1]==''){
            //     return 
            // }
            var space = /^\s/
            const nextDay = line.match(space)
            if (nextDay) {
                start.value = false
                return
            }
            // console.log(line)
            dailyMessage += line + '\n'
        }
        if (line.startsWith(day)) {
            start.value = true
            console.log(day)
        }
    })
    // console.log(dailyMessage)
    const dailyMessageArray = dailyMessage.split('\n');
    dailyMessageArray.pop()
    // console.log(dailyMessageArray)

    let userMessage = ''

    dailyMessageArray.forEach((message, index) => {

        const messageArray = message.split('\t')
        // console.log(messageArray)

    })
}


// 监视 lineContent 的变化，并更新组件中的 lineContent
watch(() => store.state.daySpeakRank, (newValue) => {
    daySpeakRank.value = newValue
})

const daySpeakRank = ref(store.state.daySpeakRank)
</script>