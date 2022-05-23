<template>
  <div class="topContainer">
    <img id="logo" alt="logo" src="../assets/logoSmall.png" />
    <router-link to="/posts">⬅️ Retour aux actus</router-link>
  </div>
  <hr>


  <div class="container">
    <form id="modifyUser" method="put" action="">
      <fieldset>
        <legend>Modifier votre compte</legend>
        <label>Votre image actuelle :</label>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Chimpanzee-Head.jpg/640px-Chimpanzee-Head.jpg"
          alt="votre image de profile" class="user-img">
        <label for="email"> *Adresse email :</label>
        <input type="text" name="user_email" id="email" value="{usermail}" required />
        <label for="password"> *Votre mot de passe:</label>
        <input type="password" name="user_password" id="password" required>
        <label for="passwordConfirm"> *Confirmez votre mot de passe :</label>
        <input type="password" name="password_confirm" id="passwordConfirm" required>
        <label for="nom"> *Votre nom :</label>
        <input type="text" name="user_nom" id="nom" value="{usernom}" required>
        <label for="prenom"> *Votre prénom :</label>
        <input type="text" name="user_prenom" id="prenom" value="{userprenom}" required>
        <label for="age"> *Votre age :</label>
        <input type="number" name="user_age" id="age" value="18" required>
        <label for="service"> Le service dans lequel vous travaillez :</label>
        <input type="text" name="user_service" id="service" value="{userservice}">
        <label id="imglabel" for="image">Selectionnez une image de profil</label>
        <input type="file" id="fileSelect" name="user_img">
        <input class="btn" type="submit" id="btn-signup" value="Modifier le compte ✔️" />
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
</template>
<script>


export default {
  components: {
  },
}
</script>

<style scoped>


#logo {
  width: 120px;
  margin: 0 auto;
}
</style>

<style lang="scss">
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
</style>