<template>
  <FeedHeader />
  <NewPost />
  <hr>
  <div id="feed">
    <PostsFeed />
  </div>
</template>

<script>
import FeedHeader from "../components/FeedHeader.vue";
import PostsFeed from "../components/PostsFeed.vue";
import NewPost from "../components/NewPost.vue";
export default {
  components: {
    PostsFeed,
    FeedHeader,
    NewPost
  },
}
</script>

<style lang="scss">
</style>