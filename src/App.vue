<template>
  <!--<div id="app">
    <img src="./assets/index.png">
    <hello></hello>
  </div>-->
  <lie></lie>
</template>

<script>
import Hello from './components/Hello'
import Lie from './components/Lie'

export default {
  name: 'app',
  components: {
    Hello,
    Lie
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  font-family:"microsoft yahei";
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
