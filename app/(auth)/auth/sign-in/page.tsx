import SignInFormClient from '@/modules/auth/components/sign-in-form-client'
import Image from 'next/image'
import React from 'react'

function Page() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 p-6">

            <div className="mb-8 flex flex-col items-center gap-2">
                <Image
                    src="/logo.svg"
                    alt="Orbit Logo"
                    width={380}
                    height={380}
                    priority
                />
                <h1 className="text-2xl font-bold text-white tracking-tight">Orbit</h1>
            </div>

            <SignInFormClient />

        </div>
    )
}

export default Page