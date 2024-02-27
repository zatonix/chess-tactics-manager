import { nextAuthConfig } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"
import Image from 'next/image'

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { redirect } from "next/navigation"
import { GoogleButton } from "@/components/auth/GoogleButton"
import { AppleButton } from "@/components/auth/AppleButton"

export default async function SignIn() {
    const session = await getServerSession(nextAuthConfig)
    if (session) {
        return redirect('/')
    }

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
                        <div className="flex flex-col sm:flex-row items-end sm:justify-between gap-2 text-xs mb-6">
                            <div className="flex justify-center items-center gap-2"><Checkbox checked/> Remerber me </div>
                            <div>Forgot your password?</div>
                        </div>
                        <Button className="btn btn-primary dark mt-4 w-full rounded-none" size='lg'> Connexion </Button>
                        <Separator className="mt-12 mb-12" />
                        <div className="flex items-center justify-center flex-col gap-2">
                            <GoogleButton />
                            <AppleButton />
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
