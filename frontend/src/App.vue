<template>
<head>
  
</head>
  <router-view />  
</template>

<script>
export default {
  name: 'App',
  components: {
}
}
</script>

<style lang="scss">
.alertMessage {
  color : red;
}
#connectezvous {
  position: relative;
  top: 160px;
  margin: 0 auto;
  text-decoration: none;
  color: black;
  border: 2px solid black;
  border-radius: 16px;
  padding: 8px;
  display : inline-block;
  &:hover {
    background: royalblue;
    color : white;
  }
}

.btn {
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  background-color: lightgray;
  border-radius: 8px;
  padding: 8px 16px;
  margin: 0 auto;
  margin-top: 16px;
  max-width:180px;
  width:55%;

  &:hover {
    color: royalblue;
    text-decoration: underline;
    text-underline-offset: 4px;
    background-color: rgb(186, 216, 255);
  }
}

body{
  position: relative;
  background: linear-gradient(to left,rgb(56, 154, 214), white, white, white, white, rgb(56, 154, 214));
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
