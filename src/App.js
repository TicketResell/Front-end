import { Fragment,useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { publicRoutes, privateRoutes } from "./pages/routes";
import DefaultLayout from "./layouts/DefaultLayout";
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from '../src/pages/routes/ProtectedRoute';
import { apiWithoutPrefix } from "./config/axios";

function App() {
  const specifiedRoutes = [...publicRoutes, ...privateRoutes];
  const [user,setUser] = useState();

  const fetchUserLogin = () =>{
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }
  const handleBrowserClose = async (status) =>{
    
    await apiWithoutPrefix.post(`/set-user-status/${status}/${user.id}`)
  }
  useEffect(() => {
    fetchUserLogin();
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      handleBrowserClose("offline");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Gỡ bỏ sự kiện khi component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  return (
    <GoogleOAuthProvider clientId="310764216947-glor2ci0tha7scaf77cgmiqrod6c58fq.apps.googleusercontent.com">
      <Router>
        <div className="App">
          <Routes>
            {specifiedRoutes.map((route, index) => {
              const Page = route.component;
              let Layout = DefaultLayout;

              if (route.layout) {
                Layout = route.layout;
              } else if (route.layout === null) {
                Layout = Fragment;
              }

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    route.role ? (
                      <ProtectedRoute role={route.role}>
                        <Layout>
                          <Page />
                        </Layout>
                      </ProtectedRoute>
                    ) : (
                      <Layout>
                        <Page />
                      </Layout>
                    )
                  }
                />
              );
            })}

            {/* Catch-all route for 404 Error Page */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
