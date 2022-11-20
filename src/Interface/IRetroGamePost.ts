interface IRetroGamePost {
    retroGames_posts_by_id: {
        id: number,
        images: {
            directus_files_id: {
                id: number
            }
        }
        title: string,
        description: string,
        plattform: string[],
        price: number,
        state: string,
        location: {
            type: string,
            coordinates: [
                lat: number,
                long: number
            ]
        }
        retroGame_post_comments_fk: {
            id: number,
            comment: number,
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

interface IRetroGamePosts {
    retroGames_posts: IRetroGamePost[]
}