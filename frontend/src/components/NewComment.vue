<template>
  <form @submit="submitComment" method="post">
                <textarea class="comment--newComment--text" placeholder="Votre commentaire..."></textarea>
                <button type="submit" class="comment--newComment--btn">➕</button>
            </form>
</template>

<script>
import axios from 'axios';
export default {
    // data(){
    //     return {
                
    //     },
    // },
    props : ['id'],
    methods : {
      async submitComment(e) {
          e.preventDefault();
            const token = (sessionStorage.getItem("token"));
            const header = { headers: { "Authorization": `Bearer ${token}` } };
            const postId = this.id;
            await axios.post(`http://localhost:3000/api/comment/${postId}`, header)
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.log(error);
            });
      }
    },
}
</script>

<style>

</style>