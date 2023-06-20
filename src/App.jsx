import './App.css'

import { ColorProvider, Picker } from './color'

function App() {
  return (
    <ColorProvider>
      <div className="card">
        <Picker />
      </div>
    </ColorProvider>
  )
}

export default App
