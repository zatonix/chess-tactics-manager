import Image from 'next/image'

export const AuthImage = () => {
    return (<Image
        src='/login.jpg' alt='background'
        width={1920} height={1080}
        className='hidden object-cover object-center w-7/12 h-screen lg:block'
    />)
}
