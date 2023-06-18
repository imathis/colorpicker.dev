import './App.css'

import { ColorProvider, Picker } from './color'

function App() {
  return (
    <ColorProvider>
      <div className="card">
        <div style={{width: '300px', height: '300px', background: `var(--color)` }} />
        <Picker />
      </div>
    </ColorProvider>
  )
}

export default App
