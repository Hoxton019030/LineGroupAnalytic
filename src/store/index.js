import { createStore } from 'vuex'

export default createStore({
  state: {
    lineTitle:'',
    lineContent:'',
    speakerRank:'',
    daySpeakRank:'',
    stickerCount:'',
    imageCount:'',
    userJoinStatistic:'',
    userLeaveStatistic:''
  },
  getters: {
    geLineContent(state){
      return state.lineContent
    }
  },
  mutations: {
    setLineTitle(state,lineTitle){
      state.lineTitle=lineTitle
    },
    setLineContent(state,lineContent){
      state.lineContent=lineContent
    },
    setSpeakerRank(state,speakerRank){
      state.speakerRank=speakerRank
    },
    setDaySpeakRank(state,daySpeakRank){
      state.daySpeakRank=daySpeakRank
    },
    setStickerStatistic(state,stickerStatistic){
      state.stickerCount=stickerStatistic
    },
    setUserJoinStatistic(state,userJoinStatistic){
      state.userJoinStatistic=userJoinStatistic
    },
    setUserLeaveStatistic(state,userLeaveStatistic){
      state.userLeaveStatistic=userLeaveStatistic
    },
    setImageStatistic(state,imageCount){
      state.imageCount=imageCount
    }

  },
  actions: {
  },
  modules: {
    generatorLineArray(lineConent){
      
    }
  }
})
