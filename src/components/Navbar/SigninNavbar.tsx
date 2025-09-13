import React from 'react'

import Logo from '@/public/gpt_logo.png'
import Image from 'next/image'
import { SignInButton, SignUpButton } from '@clerk/nextjs'

const SigninNavbar = () => {
  return (
    <div className='w-full flex items-center justify-between p-2'>
      <div className="p-1 hover:bg-[var(--secondary-hover-bg)] rounded-[var(--border-radius-200)] cursor-pointer">
        <Image
          src={Logo}
          alt="logo"
          style={{ minHeight: 32, minWidth: 32, maxHeight: 32, maxWidth: 32 }}
        />
      </div>
      <div className="flex items-center space-x-2">
        <SignInButton>
          <button className='bg-white hover:bg-[#ececec] rounded-full px-3 py-[6px] text-black text-[14px] font-medium'>Log in</button>
        </SignInButton>
        <SignUpButton>
          <button className='bg-[#212121] border border-[var(--tertiary-hover-bg)] hover:bg-[#2f2f2f] rounded-full px-3 py-[6px] text-[14px] font-medium' >Sign up for free</button>
        </SignUpButton>

      </div>
    </div>
  )
}

export default SigninNavbar