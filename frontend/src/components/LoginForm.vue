<template>
  <form @submit="submitForm">
    <!--method="post"  action="http://localhost:8080/posts" -->
    <fieldset>
      <legend>Connexion </legend>
      <label for="user_email"> Adresse mail : </label>
      <input v-model="user_email" autofocus type="text" name="user_email" id="user_email"
        placeholder="ex: exemple@gmail.com" required size="32" />
      <br />
      <label for="user_password">Mot de passe :</label>
      <input v-model="user_password" name="user_password" type="password" id="user_password" minlength="8" size="32" />
      <p v-if:="messageError.length > 2" class="alertMessage">{{ messageError }}</p>
      <input class="btn" type="submit" id="btn-login" value="Connexion" />
    </fieldset>
  </form>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import router from '@/router/router';
import axios from 'axios';
export default {
  data: function () {

    return {
      messageError: [],
      user_email: "",
      user_password: "",
    }
  },
  methods: {
    async submitForm(e) {
      e.preventDefault();
      const formulaire = {
        user_email: this.user_email,
        user_password: this.user_password
      }
      axios.post('http://localhost:3000/api/users/login', formulaire)
    
      .then(res => {
        if (res.status == 200) {
          console.log(res.data.token);
          //  enregistrer le token dans la session
          sessionStorage.token = res.data.token;
          // rediriger vers /posts
          router.push("/posts");
        }
        else {
          //autre erreur inconnue : afficher le message dans le v if
          this.messageError = "Erreur.";
        }
      })
       .catch(error => {
        // message du backend
        if(error.response.data.message){
          this.messageError = error.response.data.message;
        }
        else{
        this.messageError = error;
        console.log(error);
        }
      })
    }
  }

}
</script>

<style scoped>
legend {
  text-decoration: underline;
  margin-bottom: 8px;
}

label {
  text-align: left;
}

label,
input {
  margin-top: 2px;
}

input {
  margin-bottom: 4px;
}

#btn-login {
  margin-top: 24px;
}
</style>>