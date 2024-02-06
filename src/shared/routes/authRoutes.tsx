import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { privateRoute, publicRoute } from "./allRoutes";
import Layout from "./layout";

function AuthRoute() {
  const { user } = useSelector((state: any) => state.root);

  return (
    <>
      <Routes>
        {!user?.isLoggedIn
          ? publicRoute.map((route, inx) => {
              return (
                <React.Fragment key={inx}>
                  <Route
                    path={route.path}
                    key={inx}
                    element={<Layout {...route} />}
                  />
                  <Route path={"*"} element={<Navigate to="/" replace />} />
                </React.Fragment>
              );
            })
          : privateRoute.map((route, inx) => {
              return (
                <React.Fragment key={inx}>
                  <Route
                    path={route.path}
                    key={inx}
                    element={<Layout {...route} />}
                  />
                  <Route path={"*"} element={<Navigate to="/" replace />} />
                </React.Fragment>
              );
            })}
      </Routes>
    </>
  );
}

export default AuthRoute;
