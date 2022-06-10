<template>
    <hr>
    <div class="newPost--container">
        <form class="newPost" id="newPost">
            <h2 class="titre">Dites quelque chose !</h2>
            <form class="newPost--form" @submit="newPost" method="" action="">
                <input class="newPost--title" type="text" v-model="post_title" max-length="100" id="post_title"
                    name="post_title" placeholder="Titre du post">
                <textarea class="newPost--text" v-model="post_text" id="post_text" type="text" max-length="500"
                    name="post_text" placeholder="Dites quelque chose..."></textarea>
                <div class="newPost--file--container">
                    <input class="newPost--file--container--file" ref="file" @change="uploadFile()" type="file"
                        id="formFile">
                </div>
                <div class="newPost--file--container--btn">
                    <button class="btn" type="submit" id="publishBtn">Poster !</button>
                    <p class="alertMessage" v-if="alertMsg">{{ alertMsg }}</p>
                </div>
            </form>
        </form>
    </div>
</template>

<script>

import axios from 'axios';
export default {

    data() {
        return {
            post_title: "",
            post_text: "",
            file: "",
            alertMsg: "",
        }
    },
    methods: {
        uploadFile() {
            this.file = this.$refs.file.files[0];
        },
        async newPost(e) {
            e.preventDefault();
            const token = (sessionStorage.getItem('token'));
            const header = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            const body = {
                post_title: this.post_title,
                post_text: this.post_text,
                image: this.file,
            }
            axios.post('http://localhost:3000/api/posts/', body, header)
                .then((res) => {
                    if (res.status == 201) {
                        //rafraichir la vue posts
                        this.$parent.getPosts();
                        //vider les champs
                        this.post_title = "";
                        this.post_text = "";
                        this.file = "";
                        this.alertMsg = "";
                    }
                    else {
                        this.alertMsg = res;
                    }
                })
                .catch(error => {
                    this.alertMsg = error.response.data.message ? 
                    (error.response.data.message) : (error.message) ? 
                    (error.message) : ("Une erreur est survenue.");
                })
        }
    },
}
</script>

<style lang="scss">

.newPost {
    background: linear-gradient(to left, rgb(186, 216, 255), white, rgb(186, 216, 255));
    border: solid 2px #999;
    border-radius: 12px;
    padding: 16px 24px 24px 24px;
    width: 86%;
    margin: 0 auto;

    &--text {
        margin: 0 auto;
        width: 90%;
        min-width: 90%;
        max-width: 90%;
        min-height: 100px;
    }

    &--container {
        margin: 12px auto;
        width: 90%;
    }

    &--form {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    &--title {
        margin: 0 auto;
        width: 90%;
        min-width: 90%;
        max-width: 90%;
        margin-bottom: 6px;
    }

    &--file--container {
        margin-top: 12px;
        width: 100%;

        &--file {
            margin-left: 0 auto;
        }
    }
}
</style>