interface IRetroGamePost {
    camping_spots_by_id: {
        title: string,
        description: string,
        hashtags: string[],
        image: {
            id: number
        },
        comment_fk: {
            id: number,
            first_name: string,
            comment: string,
            date_created: string,
            user_created: {
                first_name: string,
                avatar: {
                    id : number
                }
            },
        }
    }
}