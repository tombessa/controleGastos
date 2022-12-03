import {GetServerSideProps,
    GetServerSidePropsContext,
    GetServerSidePropsResult} from "next";

import {parseCookies} from "nookies";


//páginas de visitantes
export function canSSRGuest<P>(fn: GetServerSideProps<P>){
    return async(ctx: GetServerSidePropsContext):Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);
        //página com usuario logado --> redireciona
        if(cookies['@nextauth.token']){
            return{
                redirect:{
                    destination:'/dashboard',
                    permanent: false
                }
            }
        }

        return await fn(ctx);
    }
}