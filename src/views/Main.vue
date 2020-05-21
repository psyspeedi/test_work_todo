<template>
  <div class="main">
    <div class="main-content">
      <div class="title">
        <h4>Ваши заметки</h4>
        <p>
          <router-link to="/create"><Button type="success">Создать новую</Button></router-link>
        </p>
      </div>
      <h3 v-if="!noteList.length">У Вас пока нет ни одной заметки!</h3>
      <TodoList v-else/>
    </div>
  </div>
</template>

<script>
  import TodoList from '@/components/TodoList.vue'
  import { mapGetters } from 'vuex'
  import Button from '@/components/Button.vue'
  export default {
    name: 'Main',
    components: {
      Button,
      TodoList
    },
    computed: { ...mapGetters(['noteList']) },
    created() {
      this.$store.commit('getStateByLocalStorage')
    }
  }
</script>

<style scoped>
  h3 {
    text-align: center;
    margin-top: 50px;
  }

  .main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
  }

  .main-content {
    width: 100%;
    margin: 0 auto;
    padding: 5px;
  }

  .title {
    text-align: center;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .title button {
    margin-left: 0;
    margin-top: 10px;
  }

  .title p {
    text-align: center;
  }

  .title p a {
    font-size: 12px;
    text-decoration: none;
    color: rgba(44, 62, 80, 0.8);
    transition: 0.3s;
  }

  .title p a:hover {
    color: rgba(44, 62, 80, 1);
    text-shadow: 0 1px 2px rgba(44, 62, 80, 0.3);
  }

  @media screen and (min-width: 560px) {
    .main-content {
      max-width: 560px;
    }
  }

  @media screen and (min-width: 1024px) {
    .main-content {
      max-width: 768px;
    }
  }
</style>
