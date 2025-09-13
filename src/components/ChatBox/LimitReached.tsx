import React from 'react'
import { DismissRegular } from '@fluentui/react-icons'

const LimitReached = () => {
  return (
    <div className=' max-w-[640px] md:max-w-[760px] w-full border border-[var(--border-color)] rounded-[var(--border-radius-400)] p-4 flex items-center justify-between bg-[var(--primary-bg)]'>
      <div className='flex flex-col max-[480px]:w-[55%]'>
        <div className='font-semibold text-[14px]'>You-ve reached your today's limit</div>
        <div className='text-[var(--secondary-text)] text-[14px]'>Upgrade to ChatGPT Plus or try again tomorrow.</div>
      </div>
      <div className='flex items-center gap-2'>
        <button className='bg-white hover:bg-[#ececec] rounded-full px-3 py-[6px] text-black text-[14px] font-medium' >Get Plus</button>
        <DismissRegular fontSize={16} className='cursor-pointer' />
      </div>
    </div>
  )
}

export default LimitReached
// 