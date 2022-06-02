<template>
    <img class="post--author--img" :alt="'photo du profil de ' + fullname" :src="userImg" :title="'photo du profil de ' + fullname" />
    <h3 class="post--author--name">{{ fullname }} </h3>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            userData: {},
            userNom: "",
            userPrenom: "",
            userImg: require('../assets/defaulthuman.jpg'),
        }
    },
    props: ['id'],

    methods: {

        async getUsers() {
            // console.log("==============postAuthor | postData ================")
            // console.log(this.id);
            // console.log(this.postData);
            const token = (sessionStorage.getItem('token'));
            const header = { headers: { "Authorization": `Bearer ${token}` } };
            const paramsId = this.id;
            //const path = 'http://localhost:3000/images/'
            await axios.get('http://localhost:3000/api/users/' + paramsId, header)
                .then(res => {
                    this.userData = res.data;
                    this.userNom = this.userData[0].user_nom;
                    this.userPrenom = this.userData[0].user_prenom;
                    if(this.userData[0].user_img && this.userData[0].user_img.length > 1){
                        this.userImg = this.userData[0].user_img;
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        },
    },
    computed: {
        fullname() {
            return this.userPrenom + ' ' + this.userNom
        }
    },
    created() {
        this.getUsers();
    }
}
</script>
<style lang="scss">
.post--author {
    &--name {
        font-weight: bold;
        margin-left: 6px;
    }

    &--img {
        cursor: pointer;
        border-radius: 50%;
        border: 1px solid black;
        min-width: 50px;
        max-width: 50px;
        min-height: 50px;
        max-height: 50px;
        object-fit: cover;
        overflow: hidden;
    }

    & h3 {
        margin: 0;
        margin-left: 8px;
    }
}

@media screen and (max-width: 500px) {
    .post--author h3 {
        font-size: 14px;
    }
}
</style>