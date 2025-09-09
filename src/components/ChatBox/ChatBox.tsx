import React from 'react'
import InputComponent from './InputComponent'

interface Props{
  setInputPrompt: React.Dispatch<React.SetStateAction<string>>;
  inputPromt: string;
}

const ChatBox = ({setInputPrompt, inputPromt}: Props) => {
  return (
    <div className='w-full h-full flex-center'>
      <div className='flex-col-center gap-8 w-full px-3'>
        <span className='text-[28px]'>Ready when you are.</span>
        <div className='w-full flex-center'>
          <InputComponent setInputPrompt={setInputPrompt} inputPromt={inputPromt}/>
        </div>

      </div>
    </div>
  )
}

export default ChatBox