<template>
  <div class="header">
    <div class="header--img"></div>
    
    <!-- fonctionnalités  à mettre en place : deux bulles <aside> avec les derniers inscrit et les posts les plus commentés -->


    <!-- <div class="header--main"> -->
    <!--   <h1 class="header--welcome titre" id="welcome-msg">{User}, quoi de neuf aujourd'hui ?</h1>
     <aside class="header--container">
        <div class="newsContainer">
          <h4>Les posts les plus commentés</h4>
          <ul>
            <li>{titre du 1er post}</li>
            <li>{titre + long du second post le plus commenté}</li>
            <li>{post3}</li>
          </ul>
        </div>
      </aside>
      <img id="logo" src="../assets/logo.png" />
      <aside class="header--container">
        <div class="newUsers">
          <h4>Les derniers collaborateurs inscrits</h4>
          <ul>
            <li class="newUser--container">
              <div class="newUser--container--name">
                <p>{pierre-louis}</p>
                <p>{user_nom}</p>
              </div>
              <img class="newUser" alt="pohot de profile de {userid}"
                src="https://st.depositphotos.com/1909187/2297/i/600/depositphotos_22971972-stock-photo-blank-white-male-head-front.jpg" />
            </li>
          </ul>
        </div>
      </aside> -->

    <nav class="header--nav" id="headerNav">
      <router-link v-if="user_id" :to="{ name: 'UserProfile', params: { id: user_id } }">Mon profil 👤</router-link>
      <router-link @click="logout" to="/">Déconnexion 🔴</router-link>
    </nav>

    <!-- </div> -->
  </div>
</template>

<script>
export default {
  data(){
    return {
      user_id:"",
    }
  },
  methods:{
    logout(){
      sessionStorage.clear();
    },

   getUserId(){
       this.user_id = (sessionStorage.getItem('id'));
  },
  },
  created(){
    this.getUserId()
  },

}
</script>
<style scoped lang="scss">
.header {
  &--img {
    margin: 0 auto;
    margin-top:-32px;
    width: 200px;
    height: 200px;
    background-image: url("../assets/logoSmall.png");
    background-size: 200px;
    background-repeat: no-repeat;
    background-color: transparent;
  }

  display: flex;
  flex-direction: column;

  &--main {
    margin-block: 0;
    margin: 0 auto;
    margin-top: 40px;
    height: 200px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-content: flex-start;

  }

  &--container {
    width: 32%;
    height: 160px;
  }

  &--welcome {
    left: 30px;
    max-width: 800px;
    width: 60%;
    margin: 0 auto;
    margin-top: -30px;
    margin-bottom: 32px;
  }

  &--nav {
    display: flex;
    justify-content: space-around;
    margin-top: 24px;
    height: 72px;
    font-size: 18px;

    & a {
      box-shadow: 2px 1px;
      font-weight: bold;
      background: rgb(232, 245, 255);
      color: royalblue;
      padding: 12px;
      border: solid 2px royalblue;
      border-radius: 12px;
      text-decoration: none;
      display: inline-block;
      margin-bottom: 18px;

      &:hover {
        box-shadow: -1px -1px;
        background: rgb(186, 216, 255);
        text-underline-offset: 6px;
        text-decoration: underline;
      }
    }
  }
}

aside {
  width: 200px !important;

  & h4 {
    margin: 4px 0;
    color: royalblue;
  }

  & .newUsers,
  .newsContainer {
    display: flex;
    flex-direction: column;
    height: 220px;
    border-radius: 12px;
    background: rgb(232, 245, 255);
    margin: 0;
    margin-top: -32px;
    padding: 4px;
    border: 2px solid royalblue;

    & ul {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      text-align: center;
      padding: 0;
      list-style: none;
      height: 100%;
      margin: 2px;

      & li {
        font-weight: bold;
        text-align: center;
        border: 1px solid skyblue;
      }
    }
  }

  .newUser {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
    border: 1px black solid;
    margin-top: 4px;

    &--container {
      display: flex;
      height: 30%;
      overflow: hidden;

      & p {


        margin: 0 0 0 4px;
        text-align: left;
      }

      &--name {

        text-overflow: ellipsis;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width: 134px;
      }
    }


  }
}

#logo {
  opacity: 0.5;
  margin: 0;
  max-width: 140px;
  max-height: 140px;
  object-fit: cover;
}

@media screen and (max-width: 500px) {
  .header--welcome {
    width: 80%;
  }

  #logo {
    max-width: 100px;
    max-height: 100px;
  }

  aside {
    max-width: 160px !important;
    min-width: 100px;

    & li {
      font-size: 12px;
    }

    & img {
      width: 30px;
      height: 30px;
    }
  }
}
</style>