<template>
    <!-- INFOS MSG -->
    <div>
        <p class="alertMessage" v-if="alertMsg">{{ alertMsg }}</p>
        <p v-if="!postExist" class="succesMessage">{{ succesMessage }}</p>
    </div>

    <!-- BLOCK REACTIONS -->
    <div>
        <span class="alertMessage" v-if="reactAlertMsg">{{ reactAlertMsg }}</span>
        <div class="post--reactions" v-if="postExist">
            <span v-if="isAuthor" @click="modifyRequest" class="modifyPost" id="modifyPost">🖊️</span>
            <span @click="likePost" class="post--reactions--likes" id="likes--count">{{ likesCounter }} 👍🏼</span>
            <span v-if="isAuthor" @click="deletePost" class="deletePost" id="deletePost">❌</span>
        </div>
    </div>

    <!-- POST FORM SI CLICK @MODIFIER  -->
    <div class="modifyRequest" v-if="modifyReq">
        <form class="newPost--form" @submit="modifyPost">
            <input class="newPost--title" type="text" max-length="100" id="post_title" name="post_title"
                v-model="postTitle">
            <textarea class="newPost--text" v-model="postText" id="post_text" type="text" max-length="500"
                name="post_text" placeholder="Dites quelque chose..."></textarea>
            <div class="newPost--file--container">
                <input class="newPost--file--container--file" ref="file" @change="uploadFile()" type="file"
                    id="formFile" name="file">
            </div>
            <div class="newPost--file--container--btn">
                <button class="btn" type="submit" id="modifBtn">Modifier ! ✔️</button>
                <p class="alertMessage" v-if="alertMsgModif">{{ alertMsgModif }}</p>
            </div>
        </form>
    </div>

    <!-- BOUTON AFFICHER MOINS -->
    <div class="display--comments--on" id="lessComments" v-if="displayComments" @click="displayAllComments"
        v-bind:style="[displayAllComments ?
        { 'background': 'linear-gradient(to top, rgb(124, 205, 255), rgb(56, 154, 214), white)' } : {}]">
        Réduire <br>⬆️
    </div>

    <!-- BOUTON AFFICHER PLUS -->
    <div class="display--comments--off" v-if="!displayComments" @click="displayAllComments">
        <span v-if="!comments[0]">Aucun</span>
        <span v-else-if="comments.length >= 1">{{ comments.length }}</span> commentaire<span
            v-if="comments.length > 1">s</span> <span>💬</span>
        <br> <span>⬇️</span>
    </div>

    <!-- BLOCK COMMENTAIRES -->
    <div class="comment--container" v-if="displayComments" :style="[displayAllComments ?
    { 'background': 'linear-gradient(rgb(124, 205, 255), white)' } : {}]">
        <div class="singlecomment" v-for:="comment in comments" :key="comments.comment_id" :id="comment.comment_id">
            <div class="comment--user">
                <router-link :to="{ name: 'UserProfile', params: { id: comment.comment_author_id } }">
                    <img id="user-image" class="comment--user--img" :src="comment.user_img"
                        :alt="'photo de profil de ' + comment.user_prenom + ' ' + comment.user_nom"
                        :title="'photo de profil de ' + comment.user_prenom + ' ' + comment.user_nom" />

                    <div class="comment--user--info">
                        <p class="comment--user--info--firstname" id="user-prenom"> {{ comment.user_prenom }} </p>
                        <p class="comment--user--info--name" id="user-nom">{{ comment.user_nom }}</p>
                        <p class="comment--user--info--date" id="comment-date">{{ comment.comment_date }}</p>

                    </div>
                </router-link>

            </div>
            <span v-if="!modifyCommentReq" :id="comment.comment_id" class="comment--text">{{ comment.comment_text
            }}</span>

            <!-- FORM modifyComment -->
            <div v-else class="modifyComment" :id="comment.comment_id">
                <form @submit="modifyComment(comment.comment_id)"></form>
                <textarea v-model="comment.comment_text"></textarea>
                <input class="modifyComment--submit" type="submit" value="➕" />
            </div>

            <!-- BOUTONS MODIFIER / SUPPRIMER UN COMMENTAIRES -->
            <div class="comment--btn" v-if="isCommentAuthor" :key="comment.comment_id">
                <span @click="modifyCommentRequest(comment.comment_id)" class="modifyComment--btn"
                    id="modifyComment">🖊️</span>
                <span @click="deleteComment" class="deleteComment--btn" id="deleteComment">❌</span>
            </div>
        </div>

        <!-- NOUVEAU COMMENTAIRE -->
        <div class="comment--newComment">
            <NewComment :id="this.id" />

        </div>
    </div>
</template>

<script>
import axios from 'axios';
import NewComment from './NewComment.vue';
export default {
    data() {
        return {
            comments: {},
            displayComments: false,
            likesCounter: "",
            isAuthor: false,
            succesMessage: "",
            alertMsg: "",
            reactAlertMsg: "",
            alertMsgModif: "",
            postExist: true,
            modifyReq: false,
            postTitle: this.post.post_title,
            postText: this.post.post_text,
            file: "",
            isCommentAuthor: false,
            modifyCommentReq: false,

        };
    },
    props: ['post', 'id', 'fullname'],
    methods: {
        async getPostById() {
            const token = (sessionStorage.getItem("token"));
            const header = { headers: { "Authorization": `Bearer ${token}` } };
            const paramsId = this.id;
            const userId = sessionStorage.getItem("id");
            await axios.get("http://localhost:3000/api/posts/" + paramsId, header)
                .then(res => {
                    if (res.data[0].post_author_id == userId) {
                        return this.isAuthor = true;
                    }
                    else {
                        return this.isAuthor = false;
                    }
                })
                .then(this.getLikes())
                .then(this.getComments())
                .catch(error => {
                    console.log(error);
                });
        },
        async getLikes() {
            const token = (sessionStorage.getItem("token"));
            const header = { headers: { "Authorization": `Bearer ${token}` } };
            const paramsId = this.id;
            await axios.get(`http://localhost:3000/api/comment/${paramsId}/likes`, header)
                .then(res => {
                    // console.log("==== getLikes " + this.id + "--- response ====");
                    // console.log(res.data);
                    this.likesCounter = res.data.length;
                    //console.log(this.likesCounter);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        async likePost() {
            const token = (sessionStorage.getItem("token"));
            const header = { headers: { "Authorization": `Bearer ${token}` } };
            const paramsId = this.id;
            const body = {};
            await axios.post(`http://localhost:3000/api/comment/${paramsId}/likes`, body, header)
                .then(res => {
                    console.log(res);
                    this.reactAlertMsg = "";
                    this.getLikes();
                })
                .catch(error => {
                    if (error.response.data.message) {
                        this.reactAlertMsg = error.response.data.message;
                    }
                    else if (error.response.data) {
                        this.reactAlertMsg = error.response.data;
                    }
                    else {
                        this.reactAlertMsg = error;
                    }
                    console.log(error);
                })

        },
        async getComments() {
            const token = (sessionStorage.getItem("token"));
            const header = { headers: { "Authorization": `Bearer ${token}` } };
            const paramsId = this.id;
            const userId = sessionStorage.getItem('id');
            const path = 'http://localhost:3000/images/'
            await axios.get(`http://localhost:3000/api/comment/${paramsId}`, header)
                .then(res => {
                    // gestion des images
                    res.data.forEach(data => {
                        if (data.user_img && data.user_img != "defaulthuman.jpg") {
                            data.user_img = `${path}${data.user_img}`;
                        }

                        if (data.comment_author_id == userId) {
                            this.isCommentAuthor = true;
                        }

                    });
                    // gestion propriété du commentaire
                    // console.log("response")
                    // console.log(userId);
                    // console.log(res.data);
                    if (res.data.length > 0) {
                        this.comments = res.data;
                    }
                })
                .catch(error => {
                    console.log(error);
                });

        },

        async modifyCommentRequest(commentId) {
            console.log("demande de modif");
            console.log('comment id : ' + commentId)
            console.log('post id :' + this.id);
            this.modifyCommentReq = !this.modifyCommentReq;

        },
        modifyComment() {
            console.log("post du comment");
        },
        async deletePost() {
            const token = (sessionStorage.getItem("token"));
            const header = { headers: { "Authorization": `Bearer ${token}` } };
            const paramsId = this.id;
            await axios.delete("http://localhost:3000/api/posts/" + paramsId, header)
                .then(res => {
                    if (res.status == 200) {
                        this.succesMessage = res.data;
                        this.alertMsg = "";
                        this.postExist = false;
                        this.
                            setTimeout(this.$parent.getPosts(), 500);
                    }
                    else {
                        this.succesMessage = "";
                        this.alertMsg = res.error ? (res.error) : (res.data) ? (res.data) : (res);
                        console.log(res);
                    }
                })
                .catch(error => {
                    console.log(error);
                })

        },
        async modifyRequest() {
            this.modifyReq = !this.modifyReq;
        },
        uploadFile() {
            //on prend le file avec $refs
            //files est un tableau de l'objet file dont on prend l'index 0 = premier fichier
            this.file = this.$refs.file.files[0];
        },
        async modifyPost(e) {
            e.preventDefault();
            const token = (sessionStorage.getItem("token"));
            const header = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            };
            const paramsId = this.id;
            const body = {
                post_title: this.postTitle,
                post_text: this.postText,
                image: this.file,
            }
            await axios.put("http://localhost:3000/api/posts/" + paramsId, body, header)
                .then(res => {
                    if (res.status == 200) {
                        this.alertMsgModif = "";
                        setTimeout(this.$parent.getPosts(), 500);
                        this.modifyReq = false;
                        this.$router.push('/posts');

                    }
                    else {
                        this.succesMessageModif = "";

                        if (res.response.data.message) {
                            this.alertMsgModif = res.response.data.message;
                        }
                        else {
                            this.alertMsgModif = res.error ? (res.error) : (res);
                        }
                        console.log(res.response.data.message)
                    }
                })
                .catch(error => {
                    if (error.response != undefined) {
                        this.alertMsgModif = error.response.data;
                    } else {
                        this.alertMsgModif = error;
                    }
                    console.log(error);
                })
        },
        displayAllComments() { this.displayComments = !this.displayComments; },
    },
    created() {
        this.getPostById();
    },
    components: { NewComment }
}
</script>

<style lang="scss">
#modifBtn {
    margin-bottom: 24px;
}

.display--comments {
    & span {
        cursor: pointer;
    }

    &--on {
        height: 64px;
        padding-top: 4px;
        border-top: solid 1px #fff;

        &:hover {
            cursor: pointer;
            text-decoration: underline;
            //background surligné déployé
            background: linear-gradient(white, rgb(56, 154, 214), rgb(56, 154, 214), rgb(124, 205, 255)) !important;
        }
    }

    &--off {
        height: 64px;
        padding-top: 4px;
        border-top: solid 1px #999;
        cursor: pointer;
        //background de base
        background: linear-gradient(rgb(56, 154, 214), rgb(56, 154, 214), rgb(56, 154, 214), white);

        &:hover {
            text-decoration: underline;
            background: linear-gradient(rgb(56, 154, 214), rgb(56, 154, 214), rgb(65, 182, 255), white);
        }
    }
}


.deletePost {
    border: 2px solid red;
    padding: 4px 16px;
    border-radius: 8px;
    margin: 4px 12px;
    cursor: pointer;

    &:hover {
        background: rgb(219, 145, 145);
    }
}

.modifyPost {

    margin: 4px 12px;
    border: 2px solid orange;
    padding: 4px 16px;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
        background: rgb(238, 210, 157);
        ;
    }

}

.modifyComment--btn {
    border: solid 1px orange;


    &:hover {
        border: solid 1px orange;
        background: rgb(238, 210, 157);
    }
}

.deleteComment--btn {
    border: solid 1px red;

    &:hover {
        border: solid 1px red;
        background: rgb(219, 145, 145);
    }
}


.modifyComment {
    width: 76%;
    display: flex;
    align-items: center;
    margin: 2px 0;

    & textarea {
        width: auto;
        max-width: 76%;
        min-width: 76%;
        height: 60px;
    }

    &--submit {
        cursor: pointer;
        margin: 0 4px;
        padding: 1px;

        &:hover {
            border-radius: 4px;
            background: rgb(186, 216, 255);
        }
    }

}

.singlecomment {
    height: 70px;
    background: rgb(219, 233, 253);
    margin: 2px auto;
    width: 98%;
    display: flex;
    border: 2px solid white;
    border-radius: 12px;
    justify-content: space-between;

}

.comment {
    &--btn {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-right: 8px;

        span {
            border-radius: 4px;
            margin: 2px 0;
            padding: 1px;
            cursor: pointer;
        }
    }


    &--container {
        margin-top: -2px;
        padding-bottom: 4px;

        & a {
            text-decoration: none;
            color: black;
            display: flex;
            width: 100%;
        }
    }

    &--newComment {
        margin-bottom: 4px;

        &--text {
            min-height: 48px;
            margin-left: 4px;
            justify-content: flex-start;
            min-width: 84%;
            max-width: 84%;
            margin-bottom: 8px;
        }

        &--btn {
            padding: 4px;
            align-self: center;
        }
    }

    &--text {
        padding-left: 4px;
        width: 100%;
        margin: 4px 0;
        text-align: left;
    }

    &--user {
        cursor: pointer;
        display: flex;
        border-radius: 12px;
        width: 30%;
        min-width: 150px;
        max-width: 272px;

        img {
            overflow: hidden;
            max-width: 30px;
            min-width: 30px;
            width: 30px;
            height: 30px;
            max-height: 30px;
            border-radius: 50%;
            border: solid 1px black;
            object-fit: cover;
            align-self: center;
            margin: 0 8px 0 4px;
        }

        &--info {
            text-align: left;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            border-right: 1px solid white;
            width: 100%;

            &--name {
                margin: 1px 0;
            }

            &--firstname {
                margin: 1px 0;
                font-weight: bold;
            }

            &--date {
                font-size: 12px;
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