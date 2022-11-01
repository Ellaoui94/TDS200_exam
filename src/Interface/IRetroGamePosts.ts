interface IRetroGamePosts {
    retroGames_posts: [{
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