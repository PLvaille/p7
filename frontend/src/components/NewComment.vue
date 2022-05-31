<template>
  <form  @submit="submitComment" method="post">
    <div id="newComment">
    <textarea v-model="comment_text" class="comment--newComment--text" placeholder="Votre commentaire..."></textarea>
    <button type="submit" class="comment--newComment--btn">➕</button>
    </div>
     <div class="comment--container">
    <span class="alertMessage" v-if="alertMsg">{{ alertMsg }}</span>
    <span class="succesMessage" v-if="succesMessage">{{ succesMessage }}</span>
    </div>
  </form>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      comment_text: "",
      alertMsg:"",
      succesMessage:"",
     
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
      console.log(body);
      await axios.post(`http://localhost:3000/api/comment/${postId}`, body, header)
        .then(res => {
          this.alertMsg ="";
          this.succesMessage = res.data;
          console.log(res);
          this.$parent.getComments();
          //ràz du contenue text
          this.comment_text="";
        })
        .catch(error => {
          if(error.response){
          this.alertMsg = error.response.data;
          }
          else {
            this.alertMsg = error;
          }
          this.succesMessage = "";
          console.log(error);
        });
    }
  },
}
</script>

<style lang="scss" scoped>
.succesMessage {
  margin: 8px auto;
}
#newComment {
  display : flex;
  justify-content: space-around;
  width:100%;
  margin-bottom:-4px;

}
</style>