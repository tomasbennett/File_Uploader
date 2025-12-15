
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { GeneralHomeLayout } from './layouts/GeneralHomeLayout'
import { SignInLayout } from './layouts/SignInLayout'
import { LogIn } from './components/LoginComponent'
import { Register } from './components/Register'
import { NotAuthenticatedRoute, ProtectedRoute } from './services/ProtectedRoute'
import { FolderPage } from './features/folders/layouts/FolderPage'
import { ErrorElement } from './features/error/services/ErrorElement'
import { ErrorPageLayout } from './features/error/layouts/ErrorLayout'


const router = createBrowserRouter([
  {
    path: "/",
    element: <GeneralHomeLayout />,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <Navigate to="folder" replace />,
      },
      {
        path: "error",
        element: <ErrorPageLayout />,
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
          {
            path: "folder",
            children: [
              {
                index: true,
                element: <Navigate to="root" replace />
              },
              {
                path: ":folderId",
                element: <FolderPage />,
              }
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
