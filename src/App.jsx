import { createHashRouter, RouterProvider } from 'react-router'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Join from './pages/Join'
import Waiting from './pages/Waiting'
import Results from './pages/Results'

const router = createHashRouter([
  { path: '/', element: <Home /> },
  { path: '/admin/:sessionId', element: <Admin /> },
  { path: '/join/:sessionId', element: <Join /> },
  { path: '/waiting/:sessionId', element: <Waiting /> },
  { path: '/results/:sessionId', element: <Results /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
