import React from "react";
import { login } from '../utils/api';
import { useHistory } from "react-router-dom";
import '../Login.css'

export default function Login() {
  const [loading, setLoad] = React.useState(true);
  const history = useHistory();

  React.useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
  
    if (params.code) {
      login(params.code)
      .then((res) => {
        if (!res) {
          setLoad(false);
        } else {
          document.cookie = `session=${res.access_token};max-age=604800;domain=42meme.fr`;
          history.push("/");
        }
      })
    } else {
      setLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <h2 style={{color: 'white'}}>Un moment...</h2>
  ) : (
    <div className="login-container">
      <a className="login" href="https://api.intra.42.fr/oauth/authorize?client_id=e7233ee8c8e4af846bda55aad3a6e99d9a2ff94e1e49c007f69320f647c55083&redirect_uri=https%3A%2F%2F42meme.fr%2Flogin&response_type=code">Login</a>
    </div>
  )
}