import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    noteList: [],
    currentNoteId: undefined,
    currentTodoItem: undefined,
    noteRemoveId: undefined,
    prevStateNote: undefined
  },
  getters: {
    currentNoteId(state) {
      return state.currentNoteId
    },
    currentNote(state, getters) {
      return state.noteList.filter(n => n.id === getters.currentNoteId)[0] || []
    },
    currentTodoList(state, getters) {
      return getters.currentNote.todoList
    },
    noteList(state) {
      return state.noteList
    },
    currentTodoItem(state) {
      return state.currentTodoItem
    }
  },
  mutations: {
    setCurrentTodoItem(state, payload) {
      const idx = state.noteList.findIndex(n => n.id === state.currentNoteId)
      state.currentTodoItem = Object.assign({}, state.noteList[idx].todoList.filter(t => +t.id === +payload)[0])
    },
    updateTodoItem(state, payload) {
      const idx = state.noteList.findIndex(n => n.id === state.currentNoteId)
      state.noteList[idx].todoList[state.noteList[idx].todoList.findIndex(t => t.id === payload.id)] = payload
    },
    updateNoteList(state, payload) {
      state.noteList = payload
    },
    saveStateToLocalStorage(state) {
      const storage = JSON.parse(localStorage.getItem('vuex')) || {}
      storage.noteList = state.noteList
      localStorage.setItem('vuex', JSON.stringify(storage))
    },
    getStateByLocalStorage(state) {
      if (JSON.parse(localStorage.getItem('vuex'))) {
        return state.noteList = JSON.parse(localStorage.getItem('vuex')).noteList
      }
      state.noteList = []
    },
    setCurrentNoteId(state, payload) {
      state.currentNoteId = payload
    },
    setNoteRemoveId(state, payload) {
      state.noteRemoveId = payload
    },
    removeNote(state, payload) {
      state.noteList = state.noteList.filter(n => +n.id !== payload)
    },
    createNote(state, payload) {
      state.noteList.push(payload)
    },
    addTodo(state, payload) {
      const idx = state.noteList.findIndex(n => n.id === state.currentNoteId) || 0
      state.noteList[idx].todoList.push(payload)
    },
    editNote(state, payload) {
      state.noteList.splice(
        state.noteList.findIndex(n => n.id === state.currentNoteId),
        1,
        payload
      )
    },
    filteredRemovedTodoList(state, payload) {
      const idx = state.noteList.findIndex(n => n.id === state.currentNoteId)
      state.noteList[idx].todoList = state.noteList[idx].todoList.filter(t => +t.id !== +payload)
    }
  }
})
