import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { GeneralHomeLayout } from './layouts/GeneralHomeLayout'
import { SignInLayout } from './layouts/SignInLayout'
import { LogIn } from './components/LoginComponent'
import { Register } from './components/Register'
import { NotAuthenticatedRoute, ProtectedRoute } from './services/ProtectedRoute'


const router = createBrowserRouter([
  {
    path: "/",
    element: <GeneralHomeLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="folder" replace />,
      },
      {
        element: <NotAuthenticatedRoute />,
        children: [
          {
            path: "sign-in",
            element: <SignInLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="login" replace />,
              },
              {
                path: "login",
                element: <LogIn />,
                handle: {
                  title: "Login",
                }
              },
              {
                path: "register",
                element: <Register />,
                handle: {
                  title: "Register",
                }
              }
            ]
          }
        ]
      },
      {
        // path: "auth",
        element: <ProtectedRoute />,
        children: [
          // {
          //   index: true,
          //   element: <Navigate to="folder" replace />,
          // },
          {
            path: "folder",
            element: <div>Folder Page</div>,
            children: [
              {
                index: true,
                element: <div>Folder Index Page</div>,
              },
            ]
          }
        ]
      }
    ]
  }
]);






function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
