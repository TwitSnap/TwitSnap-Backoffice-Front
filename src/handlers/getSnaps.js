export default async function getSnaps() {
    const res = {
        posts: [
            {
                post_id: "1",
                created_by: "u23",
                is_retweet: false,
                is_comment: false,
                username_creator: "Pepito",
                origin_post: "1",
                like_ammount: 40,
                retwit_ammount: 20,
                comment_ammount: 10,
                message: "Simple snap!",
                photo_creator: "https://reqres.in/img/faces/1-image.jpg",
            },
            {
                post_id: "2",
                created_by: "u30",
                is_retweet: false,
                is_comment: true,
                username_creator: "Juancito",
                origin_post: "1",
                like_ammount: 10,
                retwit_ammount: 8,
                comment_ammount: 3,
                message: "I comment :D",
                photo_creator: "https://reqres.in/img/faces/4-image.jpg",
            },
            {
                post_id: "3",
                created_by: "u23",
                is_retweet: false,
                is_comment: false,
                username_creator: "Pepito",
                origin_post: "1",
                like_ammount: 100,
                retwit_ammount: 89,
                comment_ammount: 27,
                message: "Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeery loooooooooooooooooooooooooong snaaaaaaaaaaaap" +
                    "that keeps goinggggggggggggggggggggggggggggggggggggggggggggggggggggg!!!!!!!!!!!!!!!!!!!!!!!!" +
                    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1" +
                    "!!!!!!!!!!!!!!!!!!!!1",
                photo_creator: "https://reqres.in/img/faces/1-image.jpg",
            },
        ],
    };

    return res;
}