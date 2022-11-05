import {Directus} from "@directus/sdk";

export const directus = new Directus("https://7qp4jl4l.directus.app/", {
    auth: {
        mode: "json"
    }
})


export const authService = {
    async login(email: string, password: string){
        return await directus.auth.login({email, password})
    },
    async register(firstName: string, email: string, password: string, avatar: {id: number}): Promise<boolean> {
        const createUserResult = await directus.users.createOne({
            first_name: firstName,
            email,
            password,
            avatar,
            role: "33686bc6-3b6b-438c-ad00-f3f51b018fbe"
        });

        return !!createUserResult?.email
    },
    async logout(){
        return await directus.auth.logout()
    },
    async currentUser(){
        return await directus.users.me.read({
            fields: ['id', 'email', 'first_name', 'avatar']
        });
    }
}