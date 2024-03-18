import { createStore } from 'vuex'

export default createStore({
  state: {
    lineTitle:'',
    lineContent:'',
    speakerRank:'',
    daySpeakRank:'',
    stickerStatistic:'',
    userJoinStatistic:''
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
      state.stickerStatistic=stickerStatistic
    },
    setUserJoinStatistic(state,userJoinStatistic){
      state.userJoinStatistic=userJoinStatistic
    }

  },
  actions: {
  },
  modules: {
  }
})
