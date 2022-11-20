interface IPostChat{
    retroGames_posts_by_id: {
        retroGame_post_chat_fk: {
            message: string,
            date_created: Date,
            user_created: {
                first_name: string,
                email: string,
                avatar: {
                    id: number
                }
            }
        }
    }
}

interface IPostChats {
    retroGames_post_chat: IPostChat[]
}