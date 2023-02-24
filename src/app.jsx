import React from 'react'
import { createRoot } from 'react-dom/client'

function App () {
  return <h1>Hello</h1>
}

const domContainer = document.querySelector('#app');
const root = createRoot(domContainer);
root.render(<App />)
