<template>
  <div class="container" ref="popup">
    <div class="content-wrap">
      <div class="content">
        <slot></slot>
      </div>
      <div class="buttons">
        <Button v-show="showLeftBtn" @click="closeHandler">Отмена</Button>
        <Button type="success" @click="successHandler">
          {{ textRightBtn }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
  import Button from '@/components/Button.vue'
  export default {
    components: {
      Button
    },
    props: {
      textRightBtn: {
        type: String,
        default: 'Да'
      },
      showLeftBtn: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      listener: undefined
    }),
    methods: {
      closeHandler() {
        this.$emit('closeHandler')
      },
      successHandler() {
        this.$emit('successHandler')
      }
    },
    mounted() {
      this.listener = document.addEventListener('click', e => {
        if (e.target === this.$refs['popup']) {
          this.closeHandler()
        }
      })
    },
    destroyed() {
      removeEventListener('click', this.listener)
    }
  }
</script>

<style scoped>
  .buttons {
    align-self: flex-end;
    display: flex;
    justify-content: space-between;
  }

  .container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content-wrap {
    width: calc(100vw - 20%);
    min-height: calc(100vh - 75%);
    max-width: 500px;
    background: white;
    padding: 15px;
    box-shadow: 0 5px 10px rgba(44, 62, 80, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 200px;
  }

  .content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

</style>
