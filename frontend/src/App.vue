<template>

  <router-view></router-view>  
  
</template>
<script>
export default {
  name: 'App',
  components: {
}
}
</script>
<style lang="scss">
.btn {
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  background-color: lightgray;
  border-radius: 8px;
  padding: 8px 24px;
  margin: 0 auto;
  margin-top: 16px;
  max-width:180px;
  width:50%;

  &:hover {
    color: royalblue;
    text-decoration: underline;
    text-underline-offset: 4px;
    background-color: rgb(186, 216, 255);
  }
}


body{
  position: relative;
  background: linear-gradient(to left,skyblue, white, white, white, white, skyblue);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
