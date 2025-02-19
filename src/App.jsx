import { useState } from 'react'

import './App.css'
import LanguageDetector from './detect'
import Translator from './translate'
import Summarizer from './summerizer'


function App() {
  return (
    <>
      <h1>Multilingual App</h1>
      <LanguageDetector/>
      <Translator />
      <Summarizer/>
    </>
  )
}

export default App
