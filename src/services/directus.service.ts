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
            role: "d4e6742f-4c66-4eaa-a0c1-0118090b7134"
        });

        return !!createUserResult?.email
    },
    async logout(){
        return await directus.auth.logout()
    },
    async currentUser(){
        return await directus.users.me.read({
            fields: ['id', 'email', 'first_name', 'avatar', 'status']
        });
    }
}