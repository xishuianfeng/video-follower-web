import {
  RouteObject,
  createBrowserRouter,
} from 'react-router-dom'
import Home from './pages/Home/Home'
import Follower from './pages/Follower/Follower'


const routes: Array<RouteObject> = [
  {
    element: <Home />,
    path: ''
  },
  {
    element: <Follower />,
    path: 'video/Follower'
  },
]

type Router = ReturnType<typeof createBrowserRouter>
const router: Router = createBrowserRouter(routes)

export default router