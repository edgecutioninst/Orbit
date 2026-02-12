import SignInFormClient from '@/modules/auth/components/sign-in-form-client'
import Image from 'next/image'
import React from 'react'

function Page() {
    return (
        <div>

            <Image src="/logo.svg" alt="login-image" width={300} height={200} className='m-6 object-cover' />
            <SignInFormClient />

        </div>
    )
}

export default Page