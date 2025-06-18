import { Routes, Route } from 'react-router-dom'

import AuthGuard from './AuthGuard'

import routes from './routes'

export default function AppRoutes() {
  return (
    <Routes>
      {
        routes.map(route => {
          let element
          if(route.userLevel > 0) {
            element = <AuthGuard userLevel={route.userLevel}>
              {route.element}
            </AuthGuard>
          }
          else element = route.element
          
          return <Route 
            key={route.route} 
            path={route.route}
            element={element}
          />
        })
      }
    </Routes>
  )
}
