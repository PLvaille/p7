<template>
  <form v-bind="toggleLogin" method="post" action="">
    <fieldset>
      <legend>Connexion </legend>
      <label for="email"> Adresse mail : </label>
      <input autofocus type="text" name="user_name" id="email" placeholder="ex: exemple@gmail.com" required size="32" />
      <br />
      <label for="mdp">Mot de passe :</label>
      <input name="user_password" type="password" id="mdp" minlength="8" size="32" />
      <input class="btn" type="submit" id="btn-login" value="Connexion"/>
     
    </fieldset>
  </form>
</template>

<script>
export default {

}
</script>

<style scoped>
legend{
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

</style>>