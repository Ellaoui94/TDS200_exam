interface IRetroGamePosts {
    retroGames_posts: [{
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
    }]
}