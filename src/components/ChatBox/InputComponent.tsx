import React from 'react'
import Image from 'next/image'
import AddIcon from "@/public/icons/AddIcon.svg"
import ToolsIcon from "@/public/icons/ToolsIcon.svg"
import MicIcon from "@/public/icons/MicIcon.svg"
import UpArrowIcon from "@/public/icons/UpArrowIcon.svg"

interface Props {
  setInputPrompt: React.Dispatch<React.SetStateAction<string>>;
  inputPromt: string;
}

const InputComponent = ({ setInputPrompt, inputPromt }: Props) => {
  return (
    <div className='rounded-[var(--border-radius-450)] bg-[var(--secondary-hover-bg)] py-3 px-3 border border-[var(--border-color)] flex flex-col max-w-[750px] w-full gap-4'>
      {/* Input Field */}
      <input placeholder='Ask anything' className='bg-transparent px-2 focus:outline-none placeholder:text-[var(--secondary-text)]' onChange={(e) => setInputPrompt(e.target.value)} value={inputPromt}/>

      {/* Input Feature Icons */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='p-2 hover:bg-[var(--primary-hover-bg)] rounded-full cursor-pointer'>
            <Image src={AddIcon} alt="add" className='' />
          </div>
          <div className='flex items-center gap-2 p-2 hover:bg-[var(--primary-hover-bg)] rounded-full cursor-pointer'>
            <Image src={ToolsIcon} alt="tools" className='' />
            <span className='text-[14px]'>Tools</span>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <div className='p-2 hover:bg-[var(--primary-hover-bg)] rounded-full cursor-pointer'>
            <Image src={MicIcon} alt="mic" className='cursor-pointer' />
          </div>
          <div className={`${inputPromt ? "bg-white": "bg-[#858585]"} p-2 hover:bg-[var(--primary-hover-bg)] rounded-full cursor-pointer`}>
            <Image src={UpArrowIcon} alt="Arrow" className='cursor-pointer' />
          </div>

        </div>

      </div>
    </div>
  )
}

export default InputComponent