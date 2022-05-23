<template>
    <div class="singlecomment" id="commentId">
        <div class="comment--user">
            <img id="user-image" class="comment--user--img"
                src="https://st.depositphotos.com/1909187/2297/i/600/depositphotos_22971972-stock-photo-blank-white-male-head-front.jpg"
                alt="{usernom} + {userprenom} photo de profil" />
            <div class="comment--user--info">
                <p class="comment--user--info--firstname" id="user-prenom">{userprénomlong} </p>
                <p class="comment--user--info--name" id="user-nom">{username}</p>
                <p class="comment--user--info--date" id="comment-date">le {20/02/2022}</p>
            </div>
        </div>
        <span class="comment--text" id="comment-text">{text} Lorem ipsum dolor sit.</span>
    </div>

    <div class="comment--newComment">
        <form action="" method="">
            <textarea class="comment--newComment--text" placeholder="Votre commentaire..."></textarea>
            <button class="comment--newComment--btn">➕</button>
        </form>
    </div>
</template>

<script>
export default {
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
        cursor:pointer;
        display: flex;
        border-radius: 12px;
        width: auto;

        img {
            max-width: 30px;
            width: 30px;
            height: 30px;
            max-height: 30px;
            border-radius: 50%;
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

            &--name,
            &--firstname {
                margin: 1px 0;
                font-weight: bold;
            }

            &--date {
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