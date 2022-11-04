interface IRetroGamePosts {
    retroGames_posts: [{
        id: number,
        title: string,
        description: string,
        images: {
            directus_files_id: {
                id: number
            }
        }
        location: {
            type: string,
            coordinates: [
                lat: number,
                long: number
            ]
        }
    }]
}