import React, { useEffect, useRef } from 'react'
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const baseHeight = 25; // your initial height (1 line)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputPrompt(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset

      // Only grow if it actually wrapped to another line
      const newHeight = Math.max(baseHeight, textareaRef.current.scrollHeight);
      textareaRef.current.style.height = `${Math.min(newHeight, 200)}px`;
    }
  };

  useEffect(() => {
    // run once on mount to adjust if there's already text
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.max(baseHeight, textareaRef.current.scrollHeight);
      textareaRef.current.style.height = `${Math.min(newHeight, 200)}px`;
    }
  }, []);

  return (
    <div className='rounded-[var(--border-radius-450)] bg-[var(--secondary-hover-bg)] py-3 px-3 border 
    border-[#343434] flex flex-col max-w-[640px] md:max-w-[760px] w-full '>
      {/* Input Field */}
      <textarea
        ref={textareaRef}
        placeholder='Ask anything'
        className='bg-transparent px-2 focus:outline-none placeholder:text-[var(--secondary-text)] resize-none'
        onChange={handleChange}
        value={inputPromt}
        autoFocus
        style={{ height: `${baseHeight}px`, maxHeight: "200px", overflowY: "auto" }}
      />

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
          <div className={`${inputPromt ? "bg-white" : "bg-[#858585]"} p-2 hover:bg-[var(--primary-hover-bg)] rounded-full cursor-pointer`}>
            <Image src={UpArrowIcon} alt="Arrow" className='cursor-pointer' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default InputComponent