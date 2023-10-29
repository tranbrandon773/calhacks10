import { api } from "../convex/_generated/api";
import "./Login.css";
import { LoginForm } from "./LoginForm";
import { LogoutButton } from "./LogoutButton";
import { useQuery } from "./usingSession";
import Upload from "./Upload";

function Login() {
  const user = useQuery(api.users.get, {});
  return (
    <main>
      {user === undefined ? (
        <div>Loading...</div>
      ) : user == null ? (
        <LoginForm />
      ) : (
        <Upload />
      )}
    </main>
  );
}

export default Login;