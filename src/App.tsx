import { FC, PropsWithChildren } from "react"
import './App.scss'
import Modal from 'react-modal'

Modal.setAppElement('#root')
Modal.defaultStyles.content = {
  inset: 'auto',
  top: 0,
  left: 0,
  backgroundColor: '#ffffff',
  borderRadius: 4,
  padding: 10,
}
Modal.defaultStyles.overlay = {
  position: 'fixed',
  zIndex: 1,
  left: 0,
  top: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(255, 255, 255, .3)',
}

const App: FC<PropsWithChildren> = ({ children }) => {
  return <div id="container">{children}</div>
}

export default App
