import React from 'react'
import InputComponent from './InputComponent'
import MessagesScreen from './MessagesScreen';
import { sampleMessages } from '@/public/data/chats';

interface Props {
  setInputPrompt: React.Dispatch<React.SetStateAction<string>>;
  inputPromt: string;
}

const ChatBox = ({ setInputPrompt, inputPromt }: Props) => {
  return (
    <div className={`w-full h-full ${sampleMessages.length > 0 ? 'flex flex-col items-center justify-start' : 'flex-col-center'} relative px-3`}>
      {sampleMessages.length > 0 &&
        <div className='w-full flex-center max-h-[76vh] overflow-y-scroll pt-5'>
          <MessagesScreen chatMessages={sampleMessages} />
        </div>}
      <div className='flex-col-center gap-8 w-full px-3 mb-[60px] '>
        {sampleMessages.length === 0 && <span className='text-[28px] max-[540px]:mb-[30px]'>Ready when you are.</span>}
        <div className={`w-full gap-1 flex-col-center max-[540px]:absolute max-[540px]:bottom-3 max-[540px]:w-[94%] ${sampleMessages.length > 0 ? 'absolute bottom-3 w-[94%]' : ''}`}>
          <InputComponent setInputPrompt={setInputPrompt} inputPromt={inputPromt} />
          <span className='text-[12px] text-center w-[90%]'>ChatGPT can make mistakes. Check important info. See Cookie Preferences.</span>
        </div>
      </div>
    </div>
  )
}

export default ChatBox