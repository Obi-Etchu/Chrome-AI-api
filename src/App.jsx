import { useState } from 'react'

import './App.css'
import AITextProcessor from './component/APIs'
import { Globe2 } from 'lucide-react';

function App() {
  return (
    <>
    <header className="header">
          <h1 className="title">
            <Globe2 width="45px" height="45px" />
            LanguageSync
          </h1>
          <p className="subtitle">Detect, translate, and summarize text instantly</p>
    </header>
      <AITextProcessor/>
    </>
  )
}

export default App
