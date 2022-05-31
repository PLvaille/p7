<template>
 <!-- verif de la session -->
  <div v-if="session()">
    <FeedHeader />
  
    <div id="feed">
      <PostsFeed />
    </div>
  
  </div>
  <div v-else>
    <router-link to="/" id="connectezvous"><span>Connectez vous</span></router-link>
  </div>
</template>

<script>
import FeedHeader from "../components/FeedHeader.vue";
import PostsFeed from "../components/PostsFeed.vue";
export default {
  components: {
    PostsFeed,
    FeedHeader,
  },
  data() {
    return {
      sessionTrue: 'Boolean',
    }
  },
  methods: {
    //fonction pour vérifier si la session storage a été créé 
    session() {
      const id = sessionStorage.getItem('id');
      if (id && id != null && id != undefined && id > 0) {
        return true;
      }
      else {
        return false;
      }
    },
  },
  // on lance la fonction à la création de la vue
  created() {
    this.session();
  },
}
</script>

<style lang="scss">

</style>