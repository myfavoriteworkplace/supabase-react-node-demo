import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
  }, []);

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) alert(error.message);
    else alert("Signup successful! Check your email for confirmation.");
  };

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else setSession(data.session);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) alert(error.message);
    else setUsers(data);
  };

  if (!session) {
    return (
      <div>
        <h1>Login / Signup</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={signUp}>Sign Up</button>
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome {session.user.email}</h1>
      <button onClick={logout}>Logout</button>
      <button onClick={fetchUsers}>Fetch Users</button>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}

export default App;
