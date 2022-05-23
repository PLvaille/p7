<template>
    <div class="newPost--container">
        <div class="newPost" id="newPost">
            <h2 class="titre">Dites quelque chose !</h2>
            <form class="newPost--form" method="" action="">
                <input class="newPost--title" type="text" max-length="100" id="post_title" name="title"
                    placeholder="Titre du post">
                <textarea class="newPost--text" id="post_text" type="text" max-length="500" name="text"
                    placeholder="Dites quelque chose..."></textarea>
                <div class="newPost--file--container">
                    <input class="newPost--file--container--file" type="file" id="formFile">
                </div>
                <div class="newPost--file--container--btn">
                    <button class="btn" id="publishBtn">Poster !</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
}
</script>

<style lang="scss">
.newPost {
    background: whitesmoke;
    border: solid 2px #999;
    border-radius: 12px;
    padding: 16px 24px 24px 24px;
    & h2 {
      padding:8px;
      margin:0 auto;
      margin-bottom:8px;
    }
    &--text {
        width: 99%;
        min-width: 99%;
        max-width: 99%;
        min-height: 100px;
    }

    &--container {
        margin: 12px auto;
        width: 90%;
    }

    &--form {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    &--title {
        width: 99%;
        min-width: 99%;
        max-width: 99%;
        margin-bottom: 6px;
    }

    &--file--container {
        margin-top: 12px;
        width: 100%;

        &--file {
            margin-left: 0 auto;
        }
    }
}
</style>