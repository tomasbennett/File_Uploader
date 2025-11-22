import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { GeneralHomeLayout } from './layouts/GeneralHomeLayout'


const router = createBrowserRouter([
  {
    path: "/",
    element: <GeneralHomeLayout />,
    children: [
      {
        index: true,
        element: <div>Home Page</div>,
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
