import { nextAuthConfig } from "@/pages/api/auth/[...nextauth]"
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next"
import { getServerSession } from "next-auth/next"
import { getProviders, signIn } from "next-auth/react"
import Image from 'next/image'

import '@/app/globals.css'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// export const metadata = {
//     title: 'Chess Tactics Manager',
//     description: 'A great analysis application of chess tactics',
// }

export default function SignIn({
    providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <>
            <div className="w-full min-h-screen bg-foreground flex text-white items-center justify-center border-none">
                <Image src="/login.jpg" alt='background' width={1920} height={1080} className="object-cover object-center h-screen w-7/12 hidden lg:block" />
                <div className="flex flex-col justify-around items-center w-full lg:w-5/12">
                    <h1 className="scroll-m-20 border-b pb-2 mb-10 text-3xl font-semibold tracking-tight first:mt-0">
                        Chess Tactics Manager
                    </h1>
                    <div className="w-1/2 text-left">
                        <Label htmlFor="email">Email</Label>
                        <Input type="text" name="username" placeholder="Type your Email address"
                            className="shadow-md border mt-2 w-full h-10 px-3 py-2 bg-background border-background mb-4 rounded-none" />
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" name="password" placeholder="Type your Password"
                            className="shadow-md border mt-2 w-full h-10 px-3 py-2 bg-background border-background mb-4 rounded-none" />
                        <div className="flex flex-row justify-between text-xs mb-8">
                            <div className="flex justify-center items-center gap-2"><Checkbox checked /> Remerber me </div>
                            <div>Forgot your password?</div>
                        </div>
                        <Button className="btn btn-primary dark mt-4 w-full rounded-none" size='lg'> Connexion </Button>
                        <Separator className="mt-12 mb-12" />
                        <div className="flex items-center justify-center flex-col gap-2">
                            <Button
                                className="text-black border-none bg-[#fefefe] w-full font-medium rounded-none text-sm px-5 py-6 text-center inline-flex items-center dark:hover:bg-[#050708]/40 dark:focus:ring-gray-600 me-2 mb-2"
                                onClick={() => signIn('google')}
                                variant='outline'
                            >
                                <svg className="w-5 h-5 me-2 -ms-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
                                Continue with Google
                            </Button>
                            <Button
                                type="button"
                                className="text-white w-full font-medium rounded-none bg-[#050708] hover:bg-[#050708]/80 text-sm px-5 py-6 text-center inline-flex items-center dark:hover:bg-[#050708]/40 dark:focus:ring-gray-600 me-2 mb-2">

                                <svg className="w-5 h-5 me-2 -ms-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path></svg>
                                Continue with Apple
                            </Button>
                            <p className="text-sm mt-10"> Don’t have an account? <a className="text-primary">Sign up now</a> </p>
                        </div>
                        <div className="text-center mt-5">
                            <p className="text-xs mt-10"> © Chess Tactics Manager 2024 </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, nextAuthConfig)

    if (session) {
        return { redirect: { destination: "/" } }
    }

    const providers = await getProviders()

    return {
        props: { providers: providers ?? [] },
    }
}
