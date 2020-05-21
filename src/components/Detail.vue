<template>
  <div class="detail">
    <Modal @closeHandler="closeModalRemove" @successHandler="removeNoteHandler" v-if="modalRemove">
      <h3>Вы действительно хотите удалить заметку?</h3>
    </Modal>
    <Modal @closeHandler="closeModalEdit" @successHandler="cancelEditHandler" v-if="modalEdit">
      <h3>Вы действительно хотите отменить сохраненные изменения?</h3>
    </Modal>
    <Modal class="modal-edit-todo" textRightBtn="Сохранить" @closeHandler="closeModalEditTodo" @successHandler="saveEditTodoHandler" v-if="modalEditTodo">
      <h3>Отредактируйте Todo</h3>
      <label for="titleTodo">
        Название Todo
        <input id="titleTodo" v-model="currentTodoItem.title" type="text">
      </label>
      <label for="todoText">
        Текст Todo
        <textarea width="100" v-model="currentTodoItem.text" id="todoText" type="text"></textarea>
      </label>

    </Modal>
    <h3>
      {{ this.$router.history.current.name === 'Detail' ? 'Редактирование' : 'Создание' }} заметки
    </h3>

    <div class="title-wrap">
      <label for="title">
        <p>Название</p>
        <input
          type="text"
          id="title"
          class="input"
          v-model="currentNote.title"
          placeholder="Введите название заметки"
          @change="edited = true"
          :class="{ emptyInput: !currentNote.title.length }"
        />
      </label>
    </div>

    <div class="item" v-for="item in currentTodoList" :key="item.id">
      <div class="item-text">
        <input
          type="checkbox"
          class="custom-checkbox"
          v-model="item.done"
          @change="edited = true"
          :id="item.id"
        />
        <label :for="item.id">
          <span :class="item.done ? 'text-done' : null">
            <strong>{{ item.title }}: </strong>
            <span v-if="!item.edit">{{ item.text }}</span>
            <div v-else>
              <input
                type="text"
                class="input"
                @blur="item.edit = false"
                @change="edited = true"
                v-model="item.text"
              />
              <input
                type="text"
                class="input"
                @blur="item.edit = false"
                @change="edited = true"
                v-model="item.title"
              />
            </div>
          </span>
        </label>
      </div>
      <div class="item-btn">
        <i @click="modalEditTodoHandler(item.id)">
          <EditIcon />
        </i>
        <i @click="todoRemovedIdHandler(item.id)">
          <RemoveIcon />
        </i>
      </div>
    </div>

    <div class="add-todo">
      <input class="input" type="text" placeholder="Введите название Todo" v-model="title" />
      <input class="input" type="text" placeholder="Введите текст Todo" v-model="text" />
      <Button @click="addTodoHandler" type="success" :disabled="!text.length">Добавить Todo</Button>
    </div>

    <div class="buttons">
      <Button @click="saveNoteHandler" type="success" :disabled="!currentNote.title || !edited">
        Сохранить изменения
      </Button>
      <Button @click="openModalEdit" :disabled="!saved">Отменить сохранение</Button>
      <Button @click="openModalRemove" type="warning">Удалить заметку</Button>
      <Button @click="cancelEditLocalHandler" :disabled="!edited">
        Отменить внесенное изменение
      </Button>
      <Button @click="repeatEditLocalHandler" type="success" :disabled="!cancelEdited">
        Повторить отмененное изменение
      </Button>
    </div>
  </div>
</template>

<script>
  import EditIcon from '@/assets/icons/EditIcon.vue'
  import RemoveIcon from '@/assets/icons/RemoveIcon.vue'
  import Modal from '@/components/Modal.vue'
  import Button from '@/components/Button.vue'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      EditIcon,
      RemoveIcon,
      Modal,
      Button
    },
    data: () => ({
      text: '',
      title: '',
      saved: false,
      edited: false,
      cancelEdited: false,
      modalRemove: false,
      modalEdit: false,
      notFound: false,
      modalEditTodo: false
    }),
    computed: {
      ...mapGetters(['currentNote', 'currentNoteId', 'currentTodoList', 'noteList', 'currentTodoItem'])
    },
    methods: {
      modalEditTodoHandler(id) {
        this.modalEditTodo = true
        this.$store.commit('setCurrentTodoItem', id)
      },
      saveEditTodoHandler() {
        this.$store.commit('updateTodoItem', this.currentTodoItem)
        this.edited = true
        this.closeModalEditTodo()
        this.$message('Todo обновлено')
      },
      closeModalRemove() {
        this.modalRemove = false
      },
      openModalRemove() {
        this.modalRemove = true
      },
      closeModalEdit() {
        this.modalEdit = false
      },
      closeModalEditTodo() {
        this.modalEditTodo = false
      },
      openModalEdit() {
        this.modalEdit = true
      },
      todoRemovedIdHandler(id) {
        this.$store.commit('filteredRemovedTodoList', +id)
        this.edited = true
        this.$message('Todo удалено')
      },
      addTodoHandler() {
        this.$store.commit('addTodo', {
          id: Date.now(),
          title: this.title,
          text: this.text,
          done: false,
          edit: false
        })
        this.text = ''
        this.title = ''
        this.edited = true
        this.$message('Todo добавлено')
      },
      saveNoteHandler() {
        this.$store.commit('editNote', this.currentNote)
        this.$store.commit('saveStateToLocalStorage')
        this.saved = true
        this.edited = false
        this.cancelEdited = false
        this.$message('Заметка сохранена')
        if (this.$router.history.current.name === 'Create') {
          this.$router.replace('/detail/' + this.currentNoteId)
        }
      },
      removeNoteHandler() {
        this.$store.commit('removeNote', this.currentNoteId)
        this.$store.commit('saveStateToLocalStorage')
        this.closeModalRemove()
        this.$router.push('/')
        this.$message('Заметка удалена')
      },
      cancelEditHandler() {
        const prevState = JSON.parse(localStorage.getItem('prevState'))
        prevState
          ? this.$store.commit('editNote', {
              id: prevState.id,
              title: prevState.title,
              todoList: prevState.todoList
            })
          : this.$store.commit('editNote', { id: this.currentNoteId, title: '', todoList: [] })

        this.saved = false
        this.$store.commit('saveStateToLocalStorage')
        localStorage.setItem('prevState', JSON.stringify(this.currentNote))
        this.closeModalEdit()
        this.$message('Сохраненные изменения отменены')
      },
      cancelEditLocalHandler() {
        localStorage.setItem(
          'nextState',
          JSON.stringify({
            id: this.currentNoteId,
            title: this.currentNote.title,
            todoList: this.currentTodoList
          })
        )
        this.$router.history.current.name === 'Create'
          ? this.$store.commit('editNote', { id: this.currentNoteId, title: '', todoList: [] })
          : this.$store.commit('editNote', JSON.parse(localStorage.getItem('prevState')))
        this.$message('Внесенные изменения отменены')
        this.edited = false
        this.cancelEdited = true
      },
      repeatEditLocalHandler() {
        this.$store.commit('editNote', JSON.parse(localStorage.getItem('nextState')))
        this.cancelEdited = false
        this.edited = true
        this.$message('Внесенные изменения возвращены')
      }
    },
    destroyed() {
      localStorage.removeItem('prevState')
      localStorage.removeItem('nextState')
      if (!this.currentNote.title && !this.currentNote.todoList) {
        this.$store.commit('removeNote', this.currentNoteId)
        this.$store.commit('saveStateToLocalStorage')
      }
    }
  }
</script>

<style scoped>
  .modal-edit-todo textarea {
    height: 100%;
    max-width: 100%;
    min-height: 50px;
    max-height: 300px;
    width: 100%;
    border: 1px solid #2c3e50;
    border-radius: 5px;
    outline: none;
    font-size: 14px;
    color: #2c3e50;
    padding: 5px;
  }

  .modal-edit-todo input {
    border: 1px solid #2c3e50;
    border-radius: 5px;
    outline: none;
    font-size: 14px;
    color: #2c3e50;
    width: 100%;
    min-height: 15px;
    padding: 5px;
  }

  .detail {
    padding: 5px;
    margin: 0 auto;
  }

  h3 {
    margin-bottom: 20px;
  }

  .title-wrap label {
    display: flex;
    margin-bottom: 15px;
    justify-content: space-between;
  }

  .title-wrap label p {
    margin-right: 10px;
  }

  .emptyInput {
    border-color: red !important;
    position: relative;
  }

  .input {
    border: 1px solid #2c3e50;
    border-radius: 5px;
    outline: none;
    font-size: 14px;
    color: #2c3e50;
    position: relative;
    border-image-slice: 1;
    background: transparent;
    padding: 2px 4px;
    min-width: 200px;
    width: 85%;
  }
  .add-todo {
    display: flex;
    margin-top: 15px;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .add-todo input:first-child {
    min-width: 50px;
    width: 50%;
    margin-right: 5px;
  }

  .item {
    display: flex;
    justify-content: space-between;
  }

  .item-text {
    display: flex;
    align-items: center;
    width: 92%;
  }

  .item-text input {
    margin-right: 10px;
  }

  .item-text label {
    width: inherit;
    overflow: hidden;
  }

  .item-text label span {
    width: inherit;
    white-space: nowrap;
  }

  .item-btn {
    width: 40px;
    display: flex;
    justify-content: space-between;
  }

  .item-btn i {
    display: flex;
    align-items: center;
  }

  .item-btn svg {
    width: 15px;
    fill: rgba(44, 62, 80, 0.7);
    transition: 0.3s;
    cursor: pointer;
  }

  .item-btn svg:hover {
    fill: rgba(44, 62, 80, 1);
  }

  .buttons {
    display: flex;
    flex-direction: column;
  }
  .buttons button {
    margin: 5px 0;
  }

  @media screen and (min-width: 560px) {
    .detail {
      max-width: 560px;
    }
  }

  @media screen and (min-width: 1024px) {
    .detail {
      max-width: 768px;
    }
  }
</style>
