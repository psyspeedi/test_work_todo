<template>
  <div id="app">
    <h2>
      <router-link class="header-link" to="/list/1">Todo App</router-link>
    </h2>
    <router-view />
  </div>
</template>

<script>
  export default {
    // created() {
    //   if (JSON.parse(localStorage.getItem('vuex'))) {
    //     this.$store.commit('setStateOfLocalStorage', JSON.parse(localStorage.getItem('vuex')))
    //   }
    // }
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin: 0 auto;
    position: relative;
    max-width: 1366px;
  }
  h2 {
    text-align: center;
    margin-bottom: 10px;
    margin-top: 15px;
  }

  .header-link {
    text-decoration: none;
    color: inherit;
  }

  #toast {
    position: absolute;
    top: 0;
    right: 0;
    width: content-box;
    z-index: 1;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    padding-top: 80px;
    padding-right: 50px;
    pointer-events: none;
  }

  .message-toast {
    display: inline-block;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 10px 20px;
    border-radius: 3px;
    margin: 3px 0;
    position: relative;
    z-index: 5;
    cursor: default;
  }

  .text-done {
    text-decoration: line-through;
    opacity: 0.5;
    transition: 0.3s;
  }

  .custom-checkbox {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }

  .custom-checkbox + label {
    display: inline-flex;
    align-items: center;
    user-select: none;
  }
  .custom-checkbox + label::before {
    content: '';
    display: inline-block;
    width: 1em;
    height: 1em;
    flex-shrink: 0;
    flex-grow: 0;
    border: 1px solid #adb5bd;
    border-radius: 0.25em;
    margin-right: 0.5em;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 50% 50%;
  }

  .custom-checkbox:checked + label::before {
    border-color: #0b76ef;
    background-color: #0b76ef;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
  }

  .custom-checkbox:not(:disabled):not(:checked) + label:hover::before {
    border-color: #b3d7ff;
  }

  .custom-checkbox:not(:disabled):active + label::before {
    background-color: #b3d7ff;
    border-color: #b3d7ff;
  }

  .custom-checkbox:disabled + label::before {
    background-color: #e9ecef;
  }
</style>
