<template>
  <form v-bind="toggleSignup" method="post" action="">
    <fieldset>
      <legend>Création de compte</legend>
      <label for="email"> *Adresse email :</label>
      <input type="text" name="user_email" id="email" placeholder="ex : exemple@gmail.com" required />
        <label for="password"> *Votre mot de passe:</label>
      <input type="password" name="user_password" id="password" required>
        <label for="passwordConfirm"> *Confirmez votre mot de passe :</label>
      <input type="password" name="password_confirm" id="passwordConfirm" required>
      <label for="nom"> *Votre nom :</label>
      <input type="text" name="user_nom" id="nom" required>
      <label for="prenom"> *Votre prénom :</label>
      <input type="text" name="user_prenom" id="prenom" required>
      <label for="age"> *Votre age :</label>
      <input type="number" name="user_age" id="age" required>
      <label for="service"> Le service dans lequel vous travaillez :</label>
      <input type="text" name="user_service" id="service">
      <label id="imglabel" for="image">Selectionnez une image de profil</label>
      <input type="file" id="fileSelect" name="user_img">
      <input class="btn" type="submit" id="btn-signup" value="Créer le compte"/>
      <br>
      <p id="nb">*  champ requis</p>
    </fieldset>
  </form>
</template>

<script>
export default {

}
</script>

<style lang="scss">
legend{
    text-decoration: underline;
    margin-bottom: 8px;
}
#nb {
    margin-bottom:0;
    font-size : 12px;
    color : rgb(184, 184, 184);
    text-align: left;
}

#imglabel {
  margin-bottom: 2px;
}

#fileSelect {
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