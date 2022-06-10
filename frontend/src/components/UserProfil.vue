<template>
  <div v-if="session()">
    <div class="topContainer">
      <img id="logo" alt="logo" src="../assets/logoSmall.png" />
      <router-link to="/posts">
        <p>⬅️ </p>
        <p>Retour aux actus</p>
      </router-link>
    </div>
    <hr>

    <div class="container" v-if="isUser">
      <form @submit="modifyUser" id="modifyUserForm">
        <fieldset>
          <legend>Modifier votre compte</legend>
          <span class="container-user--date">Vous êtes inscrit(e) depuis le : {{ data.user_date }}</span>
          <label>Votre image actuelle :</label>
          <img :src="data.user_img" alt="votre image de profil" class="user-img">
          <label for="email"> *Adresse email :</label>
          <input type="text" name="user_email" id="user_email" v-model="data.user_email" />
          <label for="password"> *Votre mot de passe:</label>
          <input type="password" v-model="user_password" minlength="8" name="user_password" id="user_password">
          <label for="passwordConfirm"> *Confirmez votre mot de passe :</label>
          <input type="password" minlength="8" @change="confirmPassword()" v-model="password_confirm"
            name="password_confirm" id="passwordConfirm">
          <label for="nom"> *Votre nom :</label>
          <input type="text" minlength="2" maxlength="30" name="user_nom" id="user_nom" :value="data.user_nom" required>
          <label for="prenom"> *Votre prénom :</label>
          <input type="text" minlength="2" maxlength="30" name="user_prenom" id="user_prenom" :value="data.user_prenom"
            required>
          <label for="age"> *Votre age :</label>
          <input type="number" name="user_age" id="user_age" :value="data.user_age" required>
          <label for="service"> Le service dans lequel vous travaillez :</label>
          <input type="text" minlength="2" maxlength="30" name="user_service" id="user_service"
            :value="data.user_service">
          <label id="imgLabel" for="image">Modifiez votre image de profil</label>
          <input ref="file" @change="uploadFile()" accept=".jpg, .jpeg, .png, .gif" type="file" id="user_img"
            name="user_img">
          <span v-if="alertMsg" class="alertMessage" id="alrtMsg">{{ alertMsg }}</span>
          <span v-if="succesMessage" class="succesMessage" id="succesMessage">{{ succesMessage }}</span>
          <input class="btn btn--submit" type="submit" id="btn-signup" value="Modifier le compte ✔️" />
          <br>
          <p id="nb">* champ requis</p>
        </fieldset>
      </form>

      <form @submit="deleteUser" id="deleteUser" method="delete" action="">
        <fieldset>
          <legend>Supprimer votre compte</legend>
          <input class="btn btn--delete" type="submit" id="btn-delete" value="Supprimer le compte 🗑️" />
        </fieldset>
      </form>
    </div>

    <div class="container" v-else>
      <div class="container--user">
        <h2>Profil de {{ data.user_prenom }}</h2>
        <div class="container--user--img">
          <img :src="data.user_img" :alt="'photo de profil de ' + data.user_prenom">
        </div>
        <span class="container-user--prenom">{{ data.user_prenom }}</span>
        <span class="container-user--nom">{{ data.user_nom }}</span>
        <span class="container-user--age">{{ data.user_age }} ans</span>
        <span class="container-user--service" v-if="data.user_service">Service : {{ data.user_service }}</span>
        <span class="container-user--date">Inscrit(e) depuis le : {{ data.user_date }}</span>
      </div>
    </div>

  </div>
  <div v-else>
    <router-link to="/" id="connectezvous"><span>Connectez vous</span></router-link>
  </div>
</template>
<script>
import router from '@/router/router';
import axios from 'axios';
export default {
  data() {
    return {
      isUser: false,
      data: "",
      user_password: "",
      password_confirm: "",
      user_email: "",
      user_nom: "",
      user_prenom: "",
      user_age: "",
      user_service: "",
      file: "",
      alertMsg: "",
      succesMessage: "",
      imgPath: 'http://localhost:3000/images/',
    }
  },
  methods: {
    session() {
      const id = sessionStorage.getItem('id');
      if (id && id != null && id != undefined && id > 0) {
        return true;
      }
      else {
        return false;
      }
    },
    uploadFile() {
      //on prend le file avec $refs
      //files est un tableau de l'objet file dont on prend l'index 0 = premier fichier
      this.file = this.$refs.file.files[0];
    },
    confirmPassword() {
      if (this.user_password != this.password_confirm) {
        this.alertMsg = "Votre confirmation de mot de passe n'est pas identique !"
      }
      else {
        this.alertMsg = "";
      }
    },
    async modifyUser(e) {
      e.preventDefault();
      const token = (sessionStorage.getItem('token'));
      let params = (new URL(document.location)).searchParams;
      let searchId = parseInt(params.get('id'));
      const header = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };
      //utiliser ref ???
      const user_nom = document.getElementById('user_nom').value;
      const user_prenom = document.getElementById('user_prenom').value;
      const user_email = document.getElementById('user_email').value;
      const user_age = document.getElementById('user_age').value;
      const user_service = document.getElementById('user_service').value;
      const user_password = document.getElementById('user_password').value;

      const body = {
        user_nom: user_nom,
        user_prenom: user_prenom,
        user_email: user_email,
        user_password: user_password,
        user_age: user_age,
        user_service: user_service,
        image: this.file,
      }

      await axios.put(`http://localhost:3000/api/users/${searchId}`, body, header)
        .then(() => {
          // router.push('/posts')
          setTimeout(this.getUser(), 300);
          this.succesMessage = "Compte modifié !";
          this.alertMsg = "";
        })
        .catch(error => {
          this.succesMessage = "";
          this.alertMsg = error.response.data.message ? (error.response.data.message) : (error.message);
        })
    },
    async deleteUser(e) {
      e.preventDefault();
      const token = (sessionStorage.getItem('token'));
      const header = { headers: { "Authorization": `Bearer ${token}` } };
      let params = (new URL(document.location)).searchParams;
      let searchId = parseInt(params.get('id'));
      await axios.delete('http://localhost:3000/api/users/' + searchId, header)
        .then(() => {
          alert("Compte supprimé !");
          sessionStorage.clear();
          router.push('/');
        })
        .catch(error => {
          this.succesMessage = "";
          this.alertMsg = error.response.data.message ? (error.response.data.message) : (error.message);
        })
    },
    async getUser() {
      const token = (sessionStorage.getItem('token'));
      const header = { headers: { "Authorization": `Bearer ${token}` } };
      const defaultImgPath = require('../assets/defaulthuman.jpg');
      let params = (new URL(document.location)).searchParams;
      let searchId = parseInt(params.get('id'));
      await axios.get('http://localhost:3000/api/users/' + searchId, header)
        .then(res => {
          this.data = res.data[0];
          if (this.data.user_img == "" || this.data.user_img == null || this.data.user_img == undefined) {
            this.data.user_img = defaultImgPath;
          }
          else {
            this.data.user_img = this.imgPath + res.data[0].user_img;
          }
          this.data.user_date = (this.data.user_date.slice(0, 16).replace('T', ' à ').replace('"', ''));
          //s'il sagit du compte de l'user, le back renvoi le mail
          if (res.data[0].user_email || sessionStorage.getItem('id') == 1) {
            return this.isUser = true;
          }
        })
        .catch(error => {
          return this.alertMsg = error;
        })
    },
  },
  components: {
  },
  created() {
    this.session();
    this.getUser();
  }
}
</script>

<style lang="scss" scoped>
#deleteUser {
  margin-top: 32px;
}
#imgLabel {
  margin-top: 8px;
}

#user_img {
  cursor: pointer;
  text-align: center;
}

#alrtMsg,
.succesMessage {
  margin-top: 32px !important;
}

.btn--submit {
  margin-top: 32px;

}

.container {
  & h2 {
    margin: 24px 0 4px 0;
    font-size: 32px;
    font-weight: bold;
  }

  & span {
    margin: 4px 0;
  }

  &--user {
    padding-bottom: 16px;
    display: flex;
    flex-direction: column;
    border: 2px solid #555;
    border-radius: 16px;
    margin: 4px auto;
    margin-bottom: 24px;
    width: 90%;
    background-color: #044eff26;

    &--img {
      margin: 8px auto;

      & img {
        border-radius: 42px;
        max-width: 400px;
      }
    }

  }
}

#logo {
  width: 120px;
  margin: 0 auto;
}

.btn--delete {
  width:60%;
  border: none;
  border: 2px solid black;

  &:hover {
    border: 2px solid red;
    background: rgb(219, 145, 145);
  }
}


.user-img {
  margin: 8px auto;
  border-radius: 50%;
  max-width: 200px;
  width: 200px;
}

.topContainer {
  margin-top: -70px;
  width: 100%;
  display: flex;
  flex-direction: column;

  & a {
    padding :24px 8px;
    display: flex;
    justify-content: space-around;
    align-items : center;
    margin: 24px auto;
    width: 30%;
    min-width: 260px;
    border: 2px solid royalblue;
    border-radius: 24px;
    box-shadow: 3px 1px;
    color: royalblue;
    font-size: 32px;
    font-weight: bold;
    text-decoration: none;
    background-color: rgba(245, 245, 245, 0.858);

    &:hover {
      box-shadow: 0px -1px;
      background-color: rgb(186, 216, 255);
      text-decoration: underline;
    }
    & p {
      margin : 0;
    }
  }

}

@media screen and (max-width: 500px) {
  .container--user--img img {
    width: 270px;
  }
}
</style>
