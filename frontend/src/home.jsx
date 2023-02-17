import React from 'react'
import InputShortener from './compo/input'
import { useState } from 'react';
import LinkResult from './link';
const home = () => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div>
        <InputShortener setInputValue={setInputValue}/>
        <LinkResult inputValue={ inputValue }/>
        
    </div>
  )
}

export default home