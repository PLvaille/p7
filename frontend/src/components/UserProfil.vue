<template>
  <div v-if="session()">
    <div class="topContainer">
      <img id="logo" alt="logo" src="../assets/logoSmall.png" />
      <router-link to="/posts">⬅️ Retour aux actus</router-link>
    </div>
    <hr>


    <div class="container" v-if="isUser">
      <form @submit="modifyUser" id="modifyUser">
        <fieldset>
          <legend>Modifier votre compte</legend>
          <label>Votre image actuelle :</label>
          <img :src="data.user_img" alt="votre image de profil" class="user-img">
          <label for="email"> *Adresse email :</label>
          <input type="text" name="user_email" id="user_email" :value="data.user_email" required />
          <label for="password"> *Votre mot de passe:</label>
          <input type="password" minlength="8" v-model="user_password" name="user_password" id="user_password" required>
          <label for="passwordConfirm"> *Confirmez votre mot de passe :</label>
          <input type="password" minlength="8" @change="confirmPassword()" v-model="password_confirm"
            name="password_confirm" id="passwordConfirm" required>
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
          <label id="imglabel" for="image">Selectionnez une image de profil</label>
          <input type="file" id="fileSelect" name="user_img">
          <span v-if="alertMsg" class="alertMessage" id="alrtMsg">{{ alertMsg }}</span>
          <input class="btn btn--submit" type="submit" id="btn-signup" value="Modifier le compte ✔️" />
          <br>
          <p id="nb">* champ requis</p>
        </fieldset>
      </form>

      <form id="deleteUser" method="delete" action="">
        <fieldset>
          <legend>Supprimer votre compte</legend>
          <input class="btn btn--delete" type="" id="btn-delete" value="Supprimer le compte 🗑️" />
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
import axios from 'axios';
export default {
  data() {
    return {
      isUser: false,
      data: "",
      user_password: "",
      password_confirm: "",
      alertMsg: "",

    }
  },
  methods: {
    modifyUser(e) {
      e.preventDefault();
    },

    confirmPassword() {
      console.log(this.user_password)
      console.log(this.password_confirm)
      if (this.user_password != this.password_confirm) {
        this.alertMsg = "Votre confirmation de mot de passe n'est pas identique !"
      }
      else {
        this.alertMsg = "";
      }
    },
    async getUser() {
      const token = (sessionStorage.getItem('token'));
      const header = { headers: { "Authorization": `Bearer ${token}` } };
      const searchId = window.location.href.slice(27);
      await axios.get('http://localhost:3000/api/users/' + searchId, header)
        .then(res => {
          this.data = res.data[0];
          this.data.user_date = (this.data.user_date.slice(0, 16).replace('T', ' à ').replace('"', ''));
          //s'il sagit du compte de l'user, le back renvoi le mail
          if (res.data[0].user_email) {
            return this.isUser = true;
          }
          
        })
        .catch(error => {
          this.alertMsg = "Erreur du server, fichier probablement trop volumineux (max 5Mb)";
          console.log(error);
        })
    },

    session() {
      const id = sessionStorage.getItem('id');
      if (id && id != null && id != undefined && id > 0) {
        return true;
      }
      else {
        return false;
      }
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
#alrtMsg {
  margin-top: 32px;
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
    color: royalblue;
    font-size: 24px;
    font-weight: bold;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

}

@media screen and (max-width: 500px) {
  .container--user--img img {
    width: 270px;
  }
}
</style>
