<template>

  <h2 class="titre">Fil d'actualités</h2>
  <div class="post" v-for="post in postsData" :key="post.post_id" :id="post.post_id">
    <div class="post--author">
      <div class="post--author--info" :id="post.post_author_id">

        <router-link :to="{ name: 'UserProfile', params: { id: post.post_author_id } }">
          <PostAuthor :id="post.post_author_id"/>

        </router-link>
      </div>
      

      <p class="post--author--date">{{ post.post_date }}</p>
    </div>
    <h2 class="post--title">{{ post.post_title }} [id : {{post.post_id}}]</h2>
    <span class="post--text">{{ post.post_text }}</span>
    <div class="post--img--container">
      <img class="post--img" :src="post.post_img" alt="image du post">
    </div>
    


      <PostComments :id="post.post_id"  />
    
  </div>
</template>

<script>
import axios from 'axios';
import PostComments from "./PostComments.vue"
import PostAuthor from './PostAuthor.vue';

export default {
 
  components: {
    PostComments,
    PostAuthor
  },
 
  data: () => {
    return {
      postsData: {},
    }
  },
  methods: {
    async getPosts() {
      const token = (sessionStorage.getItem('token'));
      const header = { headers: { "Authorization": `Bearer ${token}` } }
      axios.get('http://localhost:3000/api/posts', header).then(res => {
        //console.log("---- res.data ----- ")
        //console.log(res.data);
        this.postsData = res.data;
      })
    },
  },
  created() {
    this.getPosts();
  },
  computed: {

  }
}

</script>

<style lang="scss">
.titre {
  margin: 0 auto;
  text-align: center;
  color: royalblue;
  border: 2px solid royalblue;
  border-radius: 12px;
  margin: 32px auto;
  padding: 8px;
  width: 20%;
  min-width: 200px;
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
  margin-bottom: 24px;
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

    & a {
      display: flex;
      align-items: center;
      text-decoration: none;
      color :black;
      & :hover {
        color : royalblue;
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
    background: rgb(173, 190, 255);
  }

  &--text {
    font-weight: bold;
    display: block;
    background: white;
    border-radius: 4px;
    border: 1px solid #999;
    margin: 12px auto 0 auto;
    padding: 24px;
    width:74%;
  }

  &--img {
    object-fit: contain;
    height:100%;
    max-height:580px;
    width:100%;
    
    &--container {    
      margin:0 auto;
      width:74%;
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

  @media screen and (max-width: 500px) {
    .post--author--date {
      font-size: 12px;
    }
    .post--img--container{
      height: 220px;        
    }
  }
}
</style>