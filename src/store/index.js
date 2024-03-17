import { createStore } from 'vuex'

export default createStore({
  state: {
    lineContent:'',
    speakerRank:''
  },
  getters: {
    geLineContent(state){
      return state.lineContent
    }
  },
  mutations: {
    setLineContent(state,lineContent){
      state.lineContent=lineContent
    },
    setSpeakerRank(state,speakerRank){
      state.speakerRank=speakerRank
    }

  },
  actions: {
  },
  modules: {
  }
})
