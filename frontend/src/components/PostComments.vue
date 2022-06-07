<template>
    <!-- INFOS MSG -->
    <div>
        <p class="alertMessage" v-if="alertMsg">{{ alertMsg }}</p>
    </div>
    <!-- BLOCK REACTIONS / MODIF / DELETE POST -->
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
            <span v-if="comment.comment_id != commentToModif" :id="comment.comment_id" class="comment--text">
                {{ comment.comment_text }}</span>

           
            <div v-else class="modifyComment">
                <form class="modifyComment--form" @submit="submitModifyComment($event, comment.comment_id)">
                    <textarea v-model="comment.comment_text" ref="modifiedText"></textarea>
                    <input class="modifyComment--submit" type="submit" value="➕" />

                </form>
                <span class="alertMessage" v-if="commentAlertMsg">{{ commentAlertMsg }}</span>
            </div>


           <!-- BOUTONS MODIFIER / SUPPRIMER UN COMMENTAIRES  -->
            <div class="comment--btn" v-if="isAuthorLogin(comment.comment_author_id)">
                <span @click="clickModifyComment(comment.comment_id)" class="modifyComment--btn"
                    id="modifyComment">🖊️</span>
                <span @click="deleteComment(comment.comment_id)" class="deleteComment--btn" id="deleteComment">❌</span>
            </div>
            <div v-else class="comment--btn"></div>
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
            commentAlertMsg: "",
            alertMsgModif: "",
            postExist: true,
            modifyReq: false,
            postTitle: this.post.post_title,
            postText: this.post.post_text,
            file: "",
            isCommentAuthor: false,
            commentToModif: "",
            modifiedText: "",
            imgPath : 'http://localhost:3000/images/',
        };
    },
    props: ['post', 'id', 'fullname'],
    methods: {
        //posts
        //recupere un post ses likes ses commentaires en plusieurs fonctions
        async getPostById() {
            const token = (sessionStorage.getItem("token"));
            const header = { headers: { "Authorization": `Bearer ${token}` } };
            const paramsId = this.id;
            const userId = sessionStorage.getItem("id");
            await axios.get("http://localhost:3000/api/posts/" + paramsId, header)
                .then(res => {
                    if (res.data[0].post_author_id == userId || sessionStorage.getItem('id') == 1) {
                        return this.isAuthor = true;
                    }
                    else {
                        return this.isAuthor = false;
                    }
                })
                .then(this.getLikes())
                .then(this.getComments())
                .catch(() => {
                    console.log("Erreur lors du chargement de l'id du post.");
                });
        },
        displayAllComments() {
            this.displayComments = !this.displayComments;
        },
        uploadFile() {
            //on prend le file avec $refs
            //files est un tableau de l'objet file dont on prend l'index 0 = premier fichier
            this.file = this.$refs.file.files[0];
        },
        //fonction pour modifier un post
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
                })
                .catch(error => {
                      this.alertMsg = error.response.data.message ? 
                    (error.response.data.message) : (error.message) ? 
                    (error.message) : ("Erreur lors de la modification du post.");
                })
        },
        //pour ouvrir le formulaire de modif
        modifyRequest() {
            this.modifyReq = !this.modifyReq;
        },
        //suppression d'un post
        async deletePost() {
            const token = (sessionStorage.getItem("token"));
            const header = { headers: { "Authorization": `Bearer ${token}` } };
            const paramsId = this.id;
            await axios.delete("http://localhost:3000/api/posts/" + paramsId, header)
                .then(res => {
                    if (res.status == 200) {
                        this.postExist = false;
                        setTimeout(this.$parent.getPosts(), 500);
                        window.alert("Post supprimé !");
                    }
                })
                .catch(() => {
                    console.log("Erreur lors de la suppression du post.");
                })
        },

        //likes
        //recuperer les likes
        async getLikes() {
            const token = (sessionStorage.getItem("token"));
            const header = { headers: { "Authorization": `Bearer ${token}` } };
            const paramsId = this.id;
            await axios.get(`http://localhost:3000/api/comment/${paramsId}/likes`, header)
                .then(res => {
                    this.likesCounter = res.data.length;
                })
                .catch(() => {
                    console.log("Erreur lors du comptage des likes.");
                });
        },
        //envoyer / retirer un like
        async likePost() {
            const token = (sessionStorage.getItem("token"));
            const header = { headers: { "Authorization": `Bearer ${token}` } };
            const paramsId = this.id;
            const body = {};
            await axios.post(`http://localhost:3000/api/comment/${paramsId}/likes`, body, header)
                .then(() => {
                    this.reactAlertMsg = "";
                    this.getLikes();
                })
                .catch(error => {
                      this.reactAlertMsg = error.response.data.message ? 
                    (error.response.data.message) : (error.message) ? 
                    (error.message) : ("Erreur lors du like du post.");
                });
        },

        //commentaires
        //recupérer les commentaires d'un post
        async getComments() {
            const token = (sessionStorage.getItem("token"));
            const header = { headers: { "Authorization": `Bearer ${token}` } };
            const paramsId = this.id;
            const userId = sessionStorage.getItem('id');
            const defaultImgPath = require('../assets/defaulthuman.jpg');
            await axios.get(`http://localhost:3000/api/comment/${paramsId}`, header)
                .then(res => {
                    // gestion des images
                    res.data.forEach(data => {
                        if (data.user_img == "" || data.user_img == null || data.user_img == undefined) {
                            data.user_img = defaultImgPath;
                        }
                        else if(data.user_img){
                            data.user_img = this.imgPath + data.user_img;
                        }
                        if (data.comment_author_id == userId) {
                            this.isCommentAuthor = true;
                        }
                    });
                    // gestion propriété du commentaire
                    if (res.data.length > 0) {
                        this.comments = res.data;
                    }
                    else {
                        this.comments = "";
                    }
                })
                .catch(() => {
                    console.log("Erreur lors du chargement des commentaires.");
                });

        },
        //verifier si l'user est le propriétaire du commentaire ou si l'user est l'admin
        isAuthorLogin(id) {
            if (sessionStorage.getItem('id') == id || sessionStorage.getItem('id') == 1) {
                return true;
            }
            else {
                return false;
            }
        },
        //bouton pour modifier le commentaire
        clickModifyComment(commentId) {
            if (this.commentToModif == commentId) {
                this.commentToModif = "";
            }
            else {
                this.commentToModif = commentId;
            }
        },
        //requete de modification de commentaire
        async submitModifyComment($event, commentId) {
            $event.preventDefault();
            const modifText = this.$refs.modifiedText[0].value;
            const token = (sessionStorage.getItem("token"));
            const header = { headers: { "Authorization": `Bearer ${token}` } };
            const body = {
                comment_text: modifText,
            }
            await axios.put(`http://localhost:3000/api/comment/${commentId}`, body, header)
                .then(()=> {
                    this.clickModifyComment();
                    this.commentAlertMsg = "";
                })
                .catch(error => {
                    this.commentAlertMsg = error.response.data.message;
                })
        },
        //supprimer un commentaire
        async deleteComment(id) {
            const token = (sessionStorage.getItem("token"));
            const header = { headers: { "Authorization": `Bearer ${token}` } };
            axios.delete(`http://localhost:3000/api/comment/${id}`, header)
                .then(() => {
                    this.getComments();
                })
                .catch(() => {
                    console.log("Erreur lors de la suppression du commentaire.");
                })
        }
    },
    created() {
        this.getPostById();
    },
    components: { NewComment, }
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
    width: 81%;
    display: flex;
    align-items: center;
    margin: 2px 0;

    & textarea {
        width: 100%;
        height: 60px;
        margin-left: 4px;
    }

    &--submit {
        align-self: center;
        cursor: pointer;
        margin: 0 4px;
        padding: 4px;
        border-radius: 4px;

        &:hover {
            border-radius: 4px;
            background: rgb(129, 175, 254);
        }
    }

    &--form {
        display: flex;
        width: 100%;
        margin-right: 5%;
    }


}

.singlecomment {
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
        margin-right: 14px;
        width: 24px;

        span {
            border-radius: 4px;
            cursor: pointer;
        }
    }


    &--container {
        margin-top: -2px;
        padding-bottom: 4px;

        & a {
            border-right: 1px solid white;
            text-decoration: none;
            color: black;
            display: flex;
            width: 100%;
            max-width: 196px;
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
        width: 80%;
        margin: 4px 0;
        margin-right: 8px;
        text-align: left;
        padding-left: 4px;
        word-wrap: break-word
    }

    &--user {
        background: linear-gradient(to left, rgb(219, 233, 253), white);
        cursor: pointer;
        display: flex;
        border-top-left-radius: 12px;
        border-bottom-left-radius: 12px;
        min-width: 156px;
        max-width: 196px;

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
            align-self: center;

            width: 100%;
            padding-right: 8px;

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