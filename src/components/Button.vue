<template>
  <button @click="$emit('click')" :class="type">
    <slot></slot>
  </button>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: 'cancel'
      }
    }
  }
</script>

<style scoped>
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: content-box;
    height: content-box;
    color: black;
    padding: 3px;
    border: none;
    border-radius: 3px;
    outline: none;
    margin-left: 10px;
    cursor: pointer;
    transition: 0.3s;
    font-size: 13px;
  }

  button:hover {
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.5);
  }

  button:disabled {
    opacity: 0.3;
    pointer-events: none;
    background-color: #78909c;
  }

  .warning {
    background-color: #ff7043;
  }

  .success {
    background-color: #66bb6a;
  }

  .cancel {
    background-color: #78909c;
  }
</style>
