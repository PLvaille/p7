<template>
    <div class="post--reactions">
        <span class="post--reactions--likes" id="likes--count">{{ likesCounter }} 👍🏼</span>
    </div>
    <div class="display--comments" id="lessComments" v-if="displayComments" @click="displayAllComments" v-bind:style="[displayAllComments ?
    { 'background': 'rgb(129, 175, 254)' } :
    {}]">
        Réduire <br>⬆️
    </div>
    <div class="display--comments" v-if="!displayComments" @click="displayAllComments">
        
         <span v-if="comments.length == 0">aucun</span>
        <span v-else-if="comments.length >= 1">{{comments.length}}</span> commentaire<span v-if="comments.length > 1">s</span> 💬
        <br> ⬇️
    </div>
    <div class="comments--container" v-if="displayComments" v-bind:style="[displayAllComments ?
    { 'background': 'linear-gradient(rgb(129, 175, 254), white)' } :
    {}]">
        <div class="singlecomment" id="commentId" v-for:="comment in comments" :key="comment_id">
            <div class="comment--user">
                <img id="user-image" class="comment--user--img"
                    src="https://st.depositphotos.com/1909187/2297/i/600/depositphotos_22971972-stock-photo-blank-white-male-head-front.jpg"
                    alt="{usernom} + {userprenom} photo de profil" />
                <div class="comment--user--info">
                    <p class="comment--user--info--firstname" id="user-prenom"> {{comment.user_prenom}} </p>
                    <p class="comment--user--info--name" id="user-nom">{{comment.user_nom}}</p>
                    <p class="comment--user--info--date" id="comment-date">{{comment.comment_date}}</p>
                </div>
            </div>
            <span class="comment--text" id="comment-text">{{ comment.comment_text }}</span>
        </div>

        <div class="comment--newComment">
            <form action="" method="">
                <textarea class="comment--newComment--text" placeholder="Votre commentaire..."></textarea>
                <button class="comment--newComment--btn">➕</button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            comments : {},
            displayComments: false,
            commentAuthorNom: "",
            commentAuthorPrenom: "",
            commentAuthorImg: "",
            commentText: "",
            commentsCounter: "",
            likesCounter: "",
        }
    },
    props: ['id'],
    methods: {
        async getPostById() {
            const token = (sessionStorage.getItem('token'));
            const header = { headers: { "Authorization": `Bearer ${token}` } };
            const paramsId = this.id;
            await axios.get('http://localhost:3000/api/posts/' + paramsId, header)
                .then(res => {
                    console.log('==== getPostById  ' + this.id + '--- response ====')
                    console.log(res.data);
                    // if(res.data.length > 1){
                    //     this.commentText = res.data.comment_text;
                    // }


                })
                .then(this.getLikes())
                .then(this.getComments())
                .catch(error => {
                    console.log(error);
                })

        },

        async getLikes() {

            const token = (sessionStorage.getItem('token'));
            const header = { headers: { "Authorization": `Bearer ${token}` } };
            const paramsId = this.id;
            await axios.get(`http://localhost:3000/api/comment/${paramsId}/likes`, header)
                .then(res => {
                    console.log('==== getLikes ' + this.id + '--- response ====');
                    console.log(res.data);
                    this.likesCounter = res.data.length;
                    console.log(this.likesCounter);

                })

                .catch(error => {
                    console.log(error);
                });

        },

        async getComments() {
            const token = (sessionStorage.getItem('token'));
            const header = { headers: { "Authorization": `Bearer ${token}` } };
            const paramsId = this.id;
            await axios.get(`http://localhost:3000/api/comment/${paramsId}`, header)
                .then(res => {
                    if(res.data.length > 0){
                    console.log("===> COMMENTAIRES TROUVES !")
                    console.log(res);
                    this.comments = res.data;
                    }
                })
                .catch(error => {
                    console.log(error);
                });
                console.log("===== thiscomments ========");
                console.log(this.comments);
        },

        displayAllComments() { this.displayComments = !this.displayComments },
    },
    created() {
        this.getPostById();

    }

}
</script>

<style lang="scss">
.singlecomment {
    background: rgb(219, 233, 253);
    margin: 2px 4px;
    display: flex;
    border: 2px solid white;
    border-radius: 12px;
}

.comment {
    &--newComment {
        margin-top: 4px;
        margin-bottom: 4px;

        & form {
            display: flex;
            justify-content: space-evenly;
        }

        &--text {
            min-height: 48px;
            margin-left: 4px;
            justify-content: flex-start;
            min-width: 84%;
            max-width: 84%;
        }

        &--btn {
            padding: 4px;
            align-self: center;
        }
    }

    &--text {
        margin: 4px 0;
        text-align: left;
        padding-left: 6px;
    }

    &--user {
        cursor: pointer;
        display: flex;
        border-radius: 12px;
        width: auto;

        img {
            max-width: 30px;
            width: 30px;
            height: 30px;
            max-height: 30px;
            border-radius: 50%;
            border : solid 1px black;
            object-fit: cover;
            align-self: center;
            margin: 0 4px;
        }

        &--info {
            text-align: left;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding-right: 6px;
            border-right: 1px solid white;

            &--name{

                margin: 1px 0;
                
            }
            &--firstname {
                margin: 1px 0;
                font-weight: bold;
            }

            &--date {
                font-size : 12px;
                margin: 0;
            }
        }

        &--text {
            text-align: left;
            padding-left: 2px;
            border-radius: 12px;
        }
    }

    &--newComment {
        &--btn {
            cursor: pointer;
            border-radius: 4px;

            &:hover {
                background: rgb(129, 175, 254);
            }
        }

    }
}
</style>