import ReactDOM from 'react-dom/client'
import App from './App'
import router from './router'
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App>
    <RouterProvider router={router} />
  </App>
)
