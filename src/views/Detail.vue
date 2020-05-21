<template>
  <div>
    <p class="back-link">
      <router-link to="/"><Button>Назад к списку заметок</Button></router-link>
    </p>
    <h3 class="not-found" v-if="notFound">Записи с таким ID не сушествует</h3>
    <Detail v-else />
  </div>
</template>

<script>
  import Detail from '@/components/Detail.vue'
  import { mapGetters } from 'vuex'
  import Button from '@/components/Button.vue'

  export default {
    components: {
      Button,
      Detail
    },
    data: () => ({
      notFound: false
    }),
    computed: { ...mapGetters(['noteList', 'currentNoteId', 'currentNote']) },
    created() {
      this.$store.commit('getStateByLocalStorage')
      this.$store.commit('setCurrentNoteId', +this.$route.params.id || Date.now())
      if (this.$router.history.current.name === 'Detail') {
        localStorage.setItem('prevState', JSON.stringify(this.currentNote))
        if (!this.noteList.find(n => +n.id === +this.currentNoteId)) {
          this.notFound = true
          setTimeout(() => {
            this.$router.push('/')
          }, 3000)
        }
      }
      if (this.$router.history.current.name === 'Create') {
        this.$store.commit('createNote', { id: this.currentNoteId, title: '', todoList: [] })
      }
    }
  }
</script>

<style scoped>
  h3 {
    margin-bottom: 15px;
    text-align: center;
  }

  .back-link {
    text-align: center;
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
  }

  .back-link a {
    font-size: 12px;
    text-decoration: none;
    color: rgba(44, 62, 80, 0.8);
    transition: 0.3s;
  }

  .back-link a:hover {
    color: rgba(44, 62, 80, 1);
    text-shadow: 0 1px 2px rgba(44, 62, 80, 0.3);
  }
</style>
