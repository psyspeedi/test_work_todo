<template>
  <div class="todolist-container">
    <Modal @closeHandler="closeModal" @successHandler="removeNote" v-if="modal">
      <h3>Вы действительно хотите удалить заметку?</h3>
    </Modal>
    <div class="search-input">
      <label for="search">
        <b>Поиск</b>
        <input id="search" type="text" placeholder="Начните вводить название..." v-model="search" />
      </label>
    </div>
    <fieldset>
      <legend><b>Фильтр</b></legend>
      <div class="filter-radio">
        <label class="label-radio" for="radio">
          <span>Все</span>
          <input v-model="filter" checked name="filter" type="radio" id="radio" value="all" />
          <span class="checkmark"></span>
        </label>
        <label class="label-radio" for="radio2">
          <span>Начатые</span>
          <input v-model="filter" name="filter" type="radio" id="radio2" value="started" />
          <span class="checkmark"></span>
        </label>
        <label class="label-radio" for="radio1">
          <span>Не начатые</span>
          <input v-model="filter" name="filter" type="radio" id="radio1" value="not_started" />
          <span class="checkmark"></span>
        </label>
        <label class="label-radio" for="radio3">
          <span>Завершенные</span>
          <input v-model="filter" name="filter" type="radio" id="radio3" value="completed" />
          <span class="checkmark"></span>
        </label>
      </div>
    </fieldset>
    <TodoListItem :filterSearch="search" :filter="filter" @openModal="openModal" />
  </div>
</template>

<script>
  import TodoListItem from '../components/TodoListItem.vue'
  import Modal from '@/components/Modal.vue'
  export default {
    name: 'TodoList',
    components: {
      TodoListItem,
      Modal
    },
    data: () => ({
      modal: false,
      removedId: undefined,
      search: '',
      filter: 'all'
    }),
    methods: {
      closeModal() {
        this.modal = false
        this.removedId = undefined
      },
      openModal(id) {
        this.modal = true
        this.removedId = id
        console.log(this.filter)
      },
      removeNote() {
        this.modal = false
        this.$store.commit('removeNote', this.removedId)
        this.$store.commit('saveStateToLocalStorage')
        this.removedId = undefined
        this.$message('Заметка удалена')
      }
    }
  }
</script>

<style scoped>
  div {
    width: 100%;
    margin: 0 auto;
    padding-left: 0;
    list-style-type: none;
  }

  .search-input {
    margin-bottom: 20px;
  }

  .search-input span {
    margin-right: 10px;
  }

  .search-input input {
    border: 1px solid #2c3e50;
    border-radius: 5px;
    outline: none;
    font-size: 14px;
    color: #2c3e50;
    position: relative;
    border-image-slice: 1;
    background: transparent;
    padding: 2px 4px;
    width: 100%;
  }

  fieldset {
    border: 1px solid;
    border-radius: 5px;
    padding: 7px;
    margin-bottom: 20px;
  }

  .filter-radio {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .filter-radio span,
  .filter-radio label {
    margin-right: 10px;
  }

  /* custom radio */

  .label-radio {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .label-radio input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 18px;
    width: 18px;
    background-color: #eee;
    border-radius: 50%;
  }

  .label-radio:hover input ~ .checkmark {
    background-color: #ccc;
  }

  .label-radio input:checked ~ .checkmark {
    background-color: #2196f3;
  }

  .checkmark:after {
    display: none;
  }

  .label-radio input:checked ~ .checkmark::after {
    display: block;
  }

  .checkmark:after {
    content: '';
    position: absolute;
    top: 6px;
    left: 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: white;
  }
</style>
