<template>
<img id="mainLogo" alt="logo" src="../assets/logoSmall.png"> 
  <h1 id="landingWelcome">Bienvenue</h1>
  <br>
  <div id="welcomeContainer">

    <!-- login -->
    <h2 @click="toggleLogin" v-bind:style="[toggleFormSignup ?
      { 'color': 'royalblue', 'text-decoration': 'underline', 'cursor': 'pointer' } :
      { 'color': 'black' }]">
      Connexion<br>
      <div v-if="toggleFormSignup">⬇️</div>
    </h2>


    <div v-if="toggleFormLogin">
        <!-- formulaire de loggin -->
      <LoginForm />
    </div>

    <!-- signup -->
    <h2 @click="toggleLogin" v-bind:style="[toggleFormLogin ?
      { 'color': 'royalblue', 'text-decoration': 'underline', 'cursor': 'pointer' } :
      { 'color': 'black' }
    ]">

      Pas de compte ? Créez en un ! <br>
      <div v-if="toggleFormLogin">⬇️</div>
    </h2>
    <div v-if="toggleFormSignup">
            <!-- formulaire de sign up -->
      <SignupForm @signup="toggleLogin()"/>
    </div>
  </div>

</template>

<script>
import SignupForm from "../components/SignupForm.vue";
import LoginForm from "../components/LoginForm.vue";

export default {
  components: {
    SignupForm, LoginForm,
  },
  data: () => {
    return {
      toggleFormLogin: true,
     
    }
  },
  methods: {
    //fonction pour afficher / cacher les parties login/signup
    toggleLogin() {
      this.toggleFormLogin = !this.toggleFormLogin;
      this.toggleFormSignup = !this.toggleFormSignup;
    },
  }
}
</script>

<style lang="scss">
#mainLogo {
  max-height: 200px;
}
#welcomeContainer {
  margin: 0 auto;
  border: solid 1px #999;
  & h2{
    max-width: 80%;
    margin:32px auto;
  }
  & form {
    margin:12px 0;
  }
}

#landingWelcome {
  color: darkred;
  border: 2px solid darkred;
  border-radius: 50px;
  padding: 12px 0px;
  width: 260px;
  margin: 0 auto;
}
fieldset {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  min-width: 300px;
  width: 50%;
}
</style>