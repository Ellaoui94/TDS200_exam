interface IRetroGamePost {
    retroGames_posts_by_id: {
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
    }
}