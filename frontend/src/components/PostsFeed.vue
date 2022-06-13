<template>
  <!-- composant NewPost -->
  <NewPost />
  <hr>

  <!-- fil d'actualités -->
  <h2 class="titre">Fil d'actualités</h2>
  <div class="allposts">
    <div class="post" v-for="post in postsData" :key="post.post_id">
      <div class="post--author">
        <div class="post--author--info">
          <router-link :to="{ name: 'UserProfile', params: { id: post.post_author_id } }">
            <!-- composant PostAuthor -->
            <PostAuthor :id="post.post_author_id" />
          </router-link>
        </div>

        <p class="post--author--date">{{ post.post_date }}</p>
      </div>
      <h2 class="post--title">{{ post.post_title }}</h2>
      <span class="post--text">{{ post.post_text }}</span>
      <div v-if="post.post_img" class="post--img--container">
        <img class="post--img" :src="post.post_img" alt="image du post">
      </div>
      <!-- composant PostComments -->
      <PostComments :post="post" :id="post.post_id" />
    </div>
  </div>
      <!-- <button class="loadMore" @click="morePosts">↕️ Afficher plus de post ↕️</button> -->

</template>

<script>
import axios from 'axios';
import NewPost from "../components/NewPost.vue"
import PostComments from "./PostComments.vue"
import PostAuthor from './PostAuthor.vue';

export default {
  components: {
    NewPost,
    PostComments,
    PostAuthor
  },
  data: () => {
    return {
      postsData:[],
      //lazy: 0,
    }
  },
  methods: {
    //fonction pour recuperer les posts de la db
    // lazy load finalement abandonné.
    async getPosts() {
      const token = (sessionStorage.getItem('token'));
      const header = { headers: { "Authorization": `Bearer ${token}` } };
      const path = 'http://localhost:3000/images/';
      axios.get(`http://localhost:3000/api/posts/all/`, header)
      //+this.lazy
        .then(res => {
          // gestion du path des images
          res.data.forEach(data => {
            if (data.post_img) {
              data.post_img = path + data.post_img;
            }
          //   if(this.postsData.length > 1){
          //   this.postsData.push(data)
          // }
          });
          this.postsData = res.data;
        })
    },
    // morePosts() {
    //   this.lazy++;
    //   this.getPosts();
    // },
  },
  //a la creation de la page on lance la fonction tout de suite
  created() {
    this.getPosts();
  },
}
</script>

<style lang="scss">
.titre {
  margin: 0 auto;
  text-align: center;
  color: rgb(56, 154, 214);
  padding: 8px;
  width: 30%;
  min-width: 200px;
}

.comments--container {
  background: rgb(200, 208, 252);
  display: flex;
  flex-direction: column;
}

.post {
  border: 3px solid rgb(56, 154, 214);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  margin: 4px auto;
  margin-bottom: 32px;
  width: 90%;
  background-color: #044fff20;

  &--author {
    position: relative;
    text-align: left;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    padding: 6px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #555;
    // background-color: #1591ff5e;

    & a {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: black;

      & :hover {
        color: royalblue;
      }
    }

    &--info {
      display: flex;
    }

    &--date {
      margin: 0;
      text-align: right;
      align-self: flex-end;
      position: absolute;
      bottom: 0px;
      right: 2px;
    }
  }

  &--title {
    margin: 0;
    padding: 8px 4px;
    border-bottom: 1px solid #555;
    background: linear-gradient(to left, rgb(56, 154, 214), white, rgb(56, 154, 214));
  }

  &--text {
    font-weight: bold;
    display: block;
    background: white;
    border-radius: 24px;
    border: 1px solid #999;
    margin: 12px auto;
    padding: 24px;
    width: 50%;
  }

  &--img {
    object-fit: contain;
    height: 100%;
    max-height: 500px;
    width: 100%;

    &--container {
      margin: 0 auto;
      width: 74%;
    }
  }

  &--reactions {
    margin: 8px auto;
    padding: 6px 0;
    width: 50%;
    display: flex;
    justify-content: space-around;


    &--likes {
      border: 2px solid skyblue;
      border-radius: 8px;
      padding: 4px 16px;
      margin: 4px 12px;
      min-width: 40px;

      &:hover {
        cursor: pointer;
        background: rgb(129, 175, 254);
      }
    }
  }

  @media screen and (max-width: 500px) {
    .post--author--date {
      font-size: 12px;
    }

    .post--img--container {
      height: 220px;
    }
  }
}
</style>