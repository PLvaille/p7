<template>
    <div class="notFound">
        <h1>404 NOT FOUND</h1>
        <span>La page demandée n'existe pas !</span>
        <router-link to="/posts">Retour au fil d'actualités</router-link>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.notFound {
    margin-top:64px;
    display: flex;
    flex-direction: column;

    & a {
        max-width: 300px;
        width: 30%;
        min-width: 160px;
        margin: 0 auto;
        padding: 24px 8px;
        border-radius: 18px;
        border: 1px solid royalblue;
        font-weight: bold;
        font-size: 24px;
        color: royalblue;
        text-decoration: none;
        margin-top: 36px;

        &:hover {
            background: rgb(186, 216, 255);
        }
    }
}
</style>