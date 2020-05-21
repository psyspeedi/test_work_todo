<template>
  <div class="container">
    <Modal
      @successHandler="closeModal"
      @closeHandler="closeModal"
      v-if="showMoreModal"
      :showLeftBtn="false"
      textRightBtn="OK"
    >
      <h2>{{ title }}</h2>
      <p>{{ text }}</p>
    </Modal>

    <div
      class="item"
      v-show="note.title.toLowerCase().includes(filterSearch.toLowerCase())"
      v-for="(note, i) in filteredNoteList"
      :key="note.id"
    >
      <div class="item-header">
        <h4
          :class="
            note.todoList.every(el => el.done === true) && note.todoList.length
              ? 'title-done'
              : null
          "
        >
          {{ note.title }}
        </h4>
        <div class="item-buttons">
          <i @click="editHandler(+note.id)" class="item-btn">
            <EditIcon />
          </i>
          <i @click="removeNote(+note.id)" class="item-btn">
            <RemoveIcon />
          </i>
        </div>
      </div>
      <ul>
        <draggable @end="moveTodo" group="list" v-model="note.todoList">
          <li
            ref="containerTodo"
            :data-id-container="`${i}:${idx}`"
            v-for="(list, idx) in note.todoList"
            :key="idx"
          >
            <input type="checkbox" class="custom-checkbox" :id="idx" disabled v-model="list.done" />
            <label :for="idx">
              <div class="text-todo-wrap">
                <span
                  :data-id-item="`${i}:${idx}`"
                  ref="todo"
                  class="text-todo"
                  :class="list.done ? 'text-done' : null"
                >
                  <strong>{{ list.title }}: </strong>
                  <span>{{ list.text }}</span>
                </span>
              </div>
            </label>
            <i
              class="moreInfoTodoText"
              @click="showMoreTodoTextHandler(list)"
              v-if="checkItemWidth(+i, +idx)"
            >
              <ViewsIcon />
            </i>
          </li>
        </draggable>
      </ul>
      <span v-if="!note.todoList.length">Todo пока нет</span>
    </div>
  </div>
</template>

<script>
  import Modal from './Modal'
  import EditIcon from '@/assets/icons/EditIcon.vue'
  import RemoveIcon from '@/assets/icons/RemoveIcon.vue'
  import ViewsIcon from '@/assets/icons/ViewsIcon.vue'
  import draggable from 'vuedraggable'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      EditIcon,
      RemoveIcon,
      ViewsIcon,
      Modal,
      draggable
    },
    data: () => ({
      showMoreModal: false,
      title: '',
      text: '',
      containerWidth: undefined,
      arrLongWidthItem: []
    }),
    props: {
      filterSearch: {
        type: String,
        default: ''
      },
      filter: {
        type: String,
        required: true
      }
    },
    computed: {
      ...mapGetters(['noteList']),
      filteredNoteList: {
        get() {
          switch (this.filter) {
            case 'all':
              return this.noteList
            case 'started':
              return this.noteList.filter(
                item =>
                  item.todoList.some(el => el.done === true) &&
                  item.todoList.some(el => el.done === false)
              )
            case 'completed':
              return this.noteList.filter(
                item => item.todoList.every(el => el.done === true) && item.todoList.length
              )
            case 'not_started':
              return this.noteList.filter(item => item.todoList.every(el => el.done === false))
          }
          return this.noteList
        }
      }
    },
    methods: {
      removeNote(id) {
        this.$emit('openModal', id)
        console.log(this.test)
      },
      editHandler(id) {
        this.$router.push('/detail/' + id)
      },
      moveTodo() {
        this.$store.commit('updateNoteList', this.noteList)
        this.$store.commit('saveStateToLocalStorage')
        this.setArrLongWidthItem()
        this.$message('Todo перенесено')
      },
      showMoreTodoTextHandler({ title, text }) {
        this.title = title
        this.text = text
        this.showMoreModal = true
      },
      closeModal() {
        this.title = ''
        this.text = ''
        this.showMoreModal = false
      },
      checkItemWidth(i, idx) {
        for (let j = 0; j < this.arrLongWidthItem.length; j++) {
          if (this.arrLongWidthItem[j].container === i && this.arrLongWidthItem[j].item === idx) {
            return true
          }
        }
        return false
      },
      setArrLongWidthItem() {
        this.containerWidth = this.$refs.containerTodo[0].clientWidth
        this.arrLongWidthItem = []
        this.$refs.todo.forEach(el => {
          if (el.clientWidth >= this.containerWidth) {
            this.arrLongWidthItem.push({
              container: +el.dataset.idItem.split(':')[0],
              item: +el.dataset.idItem.split(':')[1]
            })
          }
        })
      }
    },
    mounted() {
      this.setArrLongWidthItem()
      addEventListener('resize', this.setArrLongWidthItem())
    },
    beforeDestroy() {
      removeEventListener('resize', this.setArrLongWidthItem())
    }
  }
</script>

<style scoped>
  .item-header {
    border-bottom: 1px solid rgba(44, 62, 80, 0.7);
    margin-bottom: 10px;
  }

  h4 {
    margin-top: 0;
    font-weight: 700;
    font-size: 20px;
    margin-bottom: 5px;
  }

  h3 {
    text-align: center;
    margin-top: 50px;
  }

  ul {
    padding-left: 0px;
    list-style-type: none;
  }

  li {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    width: 95%;
    position: relative;
  }

  label {
    max-width: 100%;
  }

  .text-todo-wrap {
    display: flex;
    overflow: hidden;
    max-width: inherit;
  }

  .moreInfoTodoText {
    position: absolute;
    width: 15px;
    height: 15px;
    display: block;
    bottom: 0;
    top: 0;
    right: -20px;
  }

  .moreInfoTodoText svg {
    width: 17px;
    max-height: 17px;
    fill: rgba(44, 62, 80, 0.7);
    cursor: pointer;
    transition: 0.3s;
  }

  .moreInfoTodoText svg:hover {
    fill: rgba(44, 62, 80, 1);
  }

  .container {
    padding-bottom: 70px;
  }

  .item {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    box-shadow: 0 3px 6px rgba(44, 62, 80, 0.5);
  }

  .item-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .item-buttons {
    width: 40px;
    display: flex;
    justify-content: space-between;
  }

  .item-header svg {
    width: 15px;
    fill: rgba(44, 62, 80, 0.7);
  }

  .item-btn svg {
    cursor: pointer;
    transition: 0.3s;
  }

  .item-btn:hover svg {
    fill: rgba(44, 62, 80, 1);
  }

  .text-todo {
    white-space: nowrap;
    display: inline-block;
    cursor: move;
  }

  .text-todo span {
    display: inline-block;
  }

  .title-done {
    position: relative;
    text-decoration: line-through;
  }

  .title-done:after {
    content: '';
    position: absolute;
    right: -25px;
    bottom: 5px;
    width: 20px;
    height: 20px;
    display: block;
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjE1cHgiIGhlaWdodD0iMTVweCI+PGxpbmVhckdyYWRpZW50IGlkPSJIb2lKQ3U0M1F0c2h6SXJZQ3hPZkNhIiB4MT0iMjEuMjQxIiB4Mj0iMy41NDEiIHkxPSIzOS4yNDEiIHkyPSIyMS41NDEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii4xMDgiIHN0b3AtY29sb3I9IiMwZDcwNDQiLz48c3RvcCBvZmZzZXQ9Ii40MzMiIHN0b3AtY29sb3I9IiMxMTk0NWEiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGZpbGw9InVybCgjSG9pSkN1NDNRdHNoeklyWUN4T2ZDYSkiIGQ9Ik0xNi41OTksNDEuNDJMMS41OCwyNi40MDFjLTAuNzc0LTAuNzc0LTAuNzc0LTIuMDI4LDAtMi44MDJsNC4wMTktNC4wMTkJYzAuNzc0LTAuNzc0LDIuMDI4LTAuNzc0LDIuODAyLDBMMjMuNDIsMzQuNTk5YzAuNzc0LDAuNzc0LDAuNzc0LDIuMDI4LDAsMi44MDJsLTQuMDE5LDQuMDE5CUMxOC42MjcsNDIuMTkzLDE3LjM3Myw0Mi4xOTMsMTYuNTk5LDQxLjQyeiIvPjxsaW5lYXJHcmFkaWVudCBpZD0iSG9pSkN1NDNRdHNoeklyWUN4T2ZDYiIgeDE9Ii0xNS43NyIgeDI9IjI2LjQwMyIgeTE9IjQzLjIyOCIgeTI9IjQzLjIyOCIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgxMzQuOTk5IDIxLjI4NyAzOC44NzMpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjMmFjNzgyIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMjFiODc2Ii8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBmaWxsPSJ1cmwoI0hvaUpDdTQzUXRzaHpJcllDeE9mQ2IpIiBkPSJNMTIuNTgsMzQuNTk5TDM5LjU5OSw3LjU4YzAuNzc0LTAuNzc0LDIuMDI4LTAuNzc0LDIuODAyLDBsNC4wMTksNC4wMTkJYzAuNzc0LDAuNzc0LDAuNzc0LDIuMDI4LDAsMi44MDJMMTkuNDAxLDQxLjQyYy0wLjc3NCwwLjc3NC0yLjAyOCwwLjc3NC0yLjgwMiwwbC00LjAxOS00LjAxOQlDMTEuODA3LDM2LjYyNywxMS44MDcsMzUuMzczLDEyLjU4LDM0LjU5OXoiLz48L3N2Zz4=')
      no-repeat center;
  }
</style>
