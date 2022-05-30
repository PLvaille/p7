<template>
  <form @submit="createAccount" method="post" action="">
    <fieldset>
      <legend>Création de compte</legend>
      <p v-if="alertMsg.length > 1" class="alertMessage">{{ alertMsg }}</p>
      <label for="user_email"> *Adresse email :</label>
      <input type="text" v-model="user_email" name="user_email" id="user_email" placeholder="ex : exemple@gmail.com"
        required />
      <label for="user_password"> *Votre mot de passe:</label>
      <input type="password" minlength="8" v-model="user_password" name="user_password" id="user_password" required>
      <label for="passwordConfirm"> *Confirmez votre mot de passe :</label>
      <input type="password" minlength="8" @change="confirmPassword()" v-model="passwordConfirm" name="passwordConfirm"
        id="passwordConfirm" min="8" required>
      <label for="user_nom"> *Votre nom :</label>
      <input type="text" minlength="2" maxlength="30" v-model="user_nom" name="user_nom" id="user_nom" required>
      <label for="user_prenom"> *Votre prénom :</label>
      <input type="text" minlength="2" maxlength="30" v-model="user_prenom" name="user_prenom" id="user_prenom" required>
      <label for="user_age"> *Votre age :</label>
      <input type="number" v-model="user_age" name="user_age" id="user_age" required>
      <label for="user_service"> Le service dans lequel vous travaillez :</label>
      <input type="text" minlength="2" maxlength="30" v-model="user_service" name="user_service" id="service">
      <label for="user_img">Selectionnez une image de profil</label>
      <input type="file" ref="file" @change="uploadFile()" accept=".jpg, .jpeg, .png, .gif" id="user_img" name="user_img">
      <input class="btn" type="submit" id="btn-signup" value="Créer le compte" />
      <br>
      <p id="nb">* champ requis</p>
    </fieldset>
  </form>
</template>

<script>
import axios from 'axios'
export default {

  data() {
    return {
      user_nom: "",
      user_prenom: "",
      user_age: "",
      user_email: "",
      user_password: "",
      passwordConfirm: "",
      user_service: "",
      alertMsg: "",
      file: "",
    }
  },

  methods: {
    //verifi du password confirm
    confirmPassword() {
      if (this.user_password != this.passwordConfirm) {
        this.alertMsg = "Votre confirmation de mot de passe n'est pas identique !"
      }
      else {
        this.alertMsg = "";
      }
    },
    //emit 'signup' pour l'event togglelogin du parent quand l'user à signup avec succes
    openLogin() {
      this.$emit('signup')
    },

    uploadFile() {
      //on prend le file avec $refs
      //files est un tableau de l'objet file dont on prend l'index 0 = premier fichier
      this.file = this.$refs.file.files[0];  
   
    },
    // methode pour envoyer au back
    async createAccount(e) {
      // eviter le rechargement de page
      e.preventDefault();
      // body de la requete
      const body = {
        user_nom: this.user_nom,
        user_prenom: this.user_prenom,
        user_age: this.user_age,
        user_email: this.user_email,
        user_password: this.user_password,
        user_service: this.user_service,
        // le champs doit s'appeler image pour multer (et pas file)
        image : this.file,
      }
      // header multipart pour gérer le fichier entrant
      const header = { headers: {'Content-Type': 'multipart/form-data'}};
      await axios.post('http://localhost:3000/api/users/signup', body, header)
        //201
        .then(res => {
          if (res.status == 201) {
            this.alertMsg = "";
            window.alert("Compte créé avec succès, veuillez maintenant vous connecter !");
            this.openLogin();
          }
          else {
            this.alertMsg = "Erreur inatendue !"
            console.log("error")
          }
        
        })
        //affichage des erreurs au dessus du form
        .catch(error => {
          if (error.response.data.message) {
            this.alertMsg = error.response.data.message
          }
         
          else {
            this.alertMsg = error;
          }
        })
    }
  },
}
</script>

<style lang="scss">
legend {
  text-decoration: underline;
  margin-bottom: 8px;
}

#nb {
  margin-bottom: 0;
  font-size: 12px;
  color: rgb(184, 184, 184);
  text-align: left;
}

#imglabel {
  margin-bottom: 2px;
}

#user_img {
  margin: 0 auto;
  margin-top: 12px;
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
</style>