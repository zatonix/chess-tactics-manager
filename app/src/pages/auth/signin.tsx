import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next"
import { getServerSession } from "next-auth/next"
import { getProviders, signIn } from "next-auth/react"
import Image from 'next/image'
import { nextAuthConfig } from "@/pages/api/auth/[...nextauth]"

import '@/app/globals.css'

export default function SignIn({
    providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <>
            <div className="w-full h-screen flex">
                <Image src="/background.jpg" alt='background' width={250} height={250} className="object-cover object-center h-screen w-7/12" />
                <div className="flex flex-col justify-center items-center w-5/12 shadow-lg">
                    <h1 className="text-3xl font-bold text-orange-500 mb-2">LOGIN</h1>
                    <div className="w-1/2 text-center bg-dark">
                        <input type="text" name="username" placeholder="username"
                            className="shadow-md border w-full h-10 px-3 py-2 text-orange-500 focus:outline-none focus:border-orange-500 mb-3 rounded" />
                        <input type="password" name="password" placeholder="password"
                            className="shadow-md border w-full h-10 px-3 py-2 text-orange-500 focus:outline-none focus:border-orange-500 mb-3 rounded" />

                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-lg focus:outline-none shadow">Sign In</button>

                        {JSON.stringify(providers)}

                        {Object.values(providers).map((provider) => (
                            <div key={provider.name}>
                                <button onClick={() => signIn(provider.id)}>
                                    Sign in with {provider.name}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, nextAuthConfig)

    // If the user is already logged in, redirect.
    // Note: Make sure not to redirect to the same page
    // To avoid an infinite loop!
    if (session) {
        return { redirect: { destination: "/" } }
    }

    const providers = await getProviders()

    return {
        props: { providers: providers ?? [] },
    }
}
