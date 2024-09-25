import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./pages/routes";
import DefaultLayout from "./layouts";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


function App() {
  return (
    <GoogleOAuthProvider clientId="310764216947-glor2ci0tha7scaf77cgmiqrod6c58fq.apps.googleusercontent.com"> {/* Bọc bằng GoogleOAuthProvider */}
      <Router>
        <div className="App">
          <Routes>
            {publicRoutes.map((route, index) => {
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
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
