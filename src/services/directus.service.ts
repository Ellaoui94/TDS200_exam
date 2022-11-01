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
    async register(firstName: string, email: string, password: string): Promise<boolean> {
        const createUserResult = await directus.users.createOne({
            first_name: firstName,
            email,
            password,
            role: "33686bc6-3b6b-438c-ad00-f3f51b018fbe"
        });

        //createUSerResult && createUserResult.email | les kunn hvis createUserResult har en verdi
        return !!createUserResult?.email
    },
    async logout(){
        return await directus.auth.logout()
    },
    async currentUser(){
        return await directus.users.me.read({
            fields: ['email', 'first_name', 'avatar']
        });
    }
}