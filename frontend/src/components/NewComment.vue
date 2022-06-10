<template>
  <form @submit="submitComment" method="post">
    <div id="newComment">
      <textarea v-model="comment_text" class="comment--newComment--text" placeholder="Votre commentaire..."></textarea>
      <button type="submit" class="comment--newComment--btn">➕</button>
    </div>
    <div class="comment--container">
      <span class="alertMessage" v-if="alertMsg">{{ alertMsg }}</span>
    </div>
  </form>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      comment_text: "",
      alertMsg: "",
    }
  },
  props: ['id'],
  methods: {
    //commenter
    async submitComment(e) {
      e.preventDefault();
      const token = (sessionStorage.getItem("token"));
      const header = { headers: { "Authorization": `Bearer ${token}` } };
      const postId = this.id;
      const body = {
        comment_text: this.comment_text,
        commented_post_id: postId,
      }
      await axios.post(`http://localhost:3000/api/comment/${postId}`, body, header)
        .then(() => {
          this.alertMsg = "";
          this.$parent.getComments();
          //ràz du contenue text
          this.comment_text = "";
        })
        .catch(error => {
          this.alertMsg = error.response.data.message ? (error.response.data.message) : (error.message);
        })
    }
  },
}
</script>

<style lang="scss" scoped>

#newComment {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: -4px;

}
</style>