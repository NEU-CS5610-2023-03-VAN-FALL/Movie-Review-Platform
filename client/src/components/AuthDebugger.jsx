import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import "../style/profile.css";

export default function AuthDebugger() {
  const { user } = useAuth0();
  const { accessToken } = useAuthToken();

  return (
    <div className="profile-container">
      <div className="token-info">
        <p>Access Token:</p>
        <pre>{JSON.stringify(accessToken, null, 2)}</pre>
      </div>
      <div className="user-info">
        <p>User Info</p>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
}