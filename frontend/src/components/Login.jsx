import { useState } from "react";
import API from "../services/api";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {

    const res = await API.post(
      "/auth/login",
      {
        email,
        password
      }
    );

    localStorage.setItem(
      "token",
      res.data.token
    );
  }

  return (
    <div className="panel">

      <h2>LOGIN</h2>

      <input
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button onClick={login}>
        Login
      </button>

    </div>
  );
}