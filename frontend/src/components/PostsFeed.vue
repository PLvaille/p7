<template>
  <h2 class="titre">Fil d'actualités</h2>
  <div class="post">
    <div class="post--author">
      <div class="post--author--info">
        <img class="post--author--img" alt="pohot de profile de {userid}"
          src="https://st.depositphotos.com/1909187/2297/i/600/depositphotos_22971972-stock-photo-blank-white-male-head-front.jpg" />
        <h3 class="post--author--name">{userPrenom} {userNom}</h3>
      </div>
      <p class="post--author--date">le {22/02/2022}</p>
    </div>
    <h2 class="post--title">{Un Titre Hello World}</h2>
    <div class="post--img--container">
      <img class="post--img"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Christophe_Lambert_et_Jean_Dujardin_%28Cropped%29.jpg/220px-Christophe_Lambert_et_Jean_Dujardin_%28Cropped%29.jpg"
        alt="Photo de jean dujardin">
    </div>
    <span class="post--text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga architecto soluta
      consequuntur nemo cumque ab ducimus fugit odio minima praesentium magni tempora, dolore ut impedit numquam
      expedita quo harum, quasi corporis sit possimus ullam! Mollitia soluta asperiores aut expedita
      aliquam.</span>

    <div class="post--reactions">
      <span class="post--reactions--likes" id="likes--count">{X} 👍🏼</span>
    </div>
    <div class="display--comments" id="lessComments" v-if="displayComments" @click="displayAllComments" v-bind:style="[displayAllComments ?
    { 'background': 'rgb(129, 175, 254)' } :
    {}]">
      Réduire <br>⬆️
    </div>
    <div class="display--comments" v-if="!displayComments" @click="displayAllComments">
      {x} commentaires 💬<br> ⬇️
    </div>
    <div class="comments--container" v-if="displayComments" v-bind:style="[displayAllComments ?
    { 'background': 'linear-gradient(rgb(129, 175, 254), white)' } :
    {}]">
      <PostComments />
    </div>

  </div>
</template>

<script>
import PostComments from "./PostComments.vue"

export default {
  components: {
    PostComments,

  },
  data: () => {
    return {
      displayComments: false,
    }
  },
  methods: {
    displayAllComments() { this.displayComments = !this.displayComments },
  }
}
</script>

<style lang="scss">
.titre {
  margin:0 auto;
  text-align: center;
  color: royalblue;
  border: 2px solid royalblue;
  border-radius: 12px;
  margin: 32px auto;
  padding: 8px;
  width: 20%;
  min-width:200px;
}

.display--comments {
  margin-top: 4px;
  padding: 4px 0px;
  border-top: solid 1px #999;
  cursor: pointer;
  background: rgb(200, 208, 252);

  &:hover {
    text-decoration: underline;
    background: rgb(129, 175, 254);
  }
}

.comments--container {
  background: rgb(200, 208, 252);
  display: flex;
  flex-direction: column;
}

.post {
  border: 2px solid #555;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  margin: 4px auto;
  margin-bottom: 12px;
  width: 90%;
  background: linear-gradient(to bottom, rgb(182, 198, 255), white);

  &--author {
    position: relative;
    text-align: left;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    background: rgb(161, 179, 252);
    padding: 6px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #555;

    &--info {
      display: flex;
    }

    &--name {
      font-weight: bold;
      margin-left: 6px;
    }

    &--date {
      margin: 0;
      text-align: right;
      align-self: flex-end;
      position: absolute;
      bottom: 0px;
      right: 2px;
    }

    &--img {
      cursor: pointer;
      border-radius: 50%;
      border: 1px solid black;
      min-width: 50px;
      max-width: 50px;
      min-height: 50px;
      max-height: 50px;
      object-fit: cover;
    }
  }

  &--title {
    margin-top: 0px;
    margin-bottom: 0;
    padding: 8px 0;
    border-bottom: 1px solid #555;
    background: rgb(173, 190, 255);
  }

  &--text {
    display: block;
    background: white;
    border-radius: 4px;
    border: 1px solid #999;
    margin: 0 8px;
    padding: 4px;
  }

  &--img {
    max-height: 300px;
    height: 300px;
    object-fit: contain;

    &--container {
      margin: 12px;
    }
  }

  &--reactions {
    padding: 6px 0;
    width: 100%;

    &--likes {
      border: 2px solid skyblue;
      ;
      border-radius: 8px;
      padding: 4px 16px;
      margin: 4px 12px;

      &:hover {
        cursor: pointer;
        background: rgb(129, 175, 254);
      }
    }
  }
}
</style>