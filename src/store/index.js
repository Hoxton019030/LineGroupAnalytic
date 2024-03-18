import { createStore } from 'vuex'

export default createStore({
  state: {
    lineTitle:'',
    lineContent:'',
    speakerRank:''
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
    }

  },
  actions: {
  },
  modules: {
  }
})
