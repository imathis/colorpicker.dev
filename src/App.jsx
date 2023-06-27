import './App.css'

import { ColorProvider, Picker } from './color'

function App() {
  return (
    <div>
      <div className="banner">
        <div className="preamble">A Most Excellent</div>
        <h1>Color Picker</h1>
        <div className="credit">Created for your enjoyment by <a rel="noreferrer" href="https://twitter.com/imathis" target="_blank">Brandon&nbsp;Mathis</a></div>
      </div>
      <ColorProvider>
        <Picker />
      </ColorProvider>
    </div>
  )
}

export default App
