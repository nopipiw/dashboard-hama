import React from "react";

import Login from "./Login.jsx";

export default function LoginAdmin({ setAuth }) {
  return <Login setAuth={setAuth} loginAs="admin" />;
}

