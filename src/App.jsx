import './App.css'
import AITextProcessor from './component/APIs'
import { Globe2 } from 'lucide-react';

function App() {
  return (
    <>
    <header className="header">
          <h2 className="title" style={{fontSize:"40px"}}>
            <Globe2 width="45px" height="45px" />
            GlobaLingo
          </h2>
          <p className="subtitle">Detect, translate, and summarize text instantly</p>
    </header>
      <AITextProcessor/>
    </>
  )
}

export default App
