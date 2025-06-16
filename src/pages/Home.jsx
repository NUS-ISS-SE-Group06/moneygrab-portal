// Home.jsx
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");

    if (code) {
      // Exchange code for tokens
      const domain = "ap-southeast-1xi7lg9t1f.auth.ap-southeast-1.amazoncognito.com/";
      const clientId = "4lcfgcumiu5derbjmd2fm1io34";
      const redirectUri = "https://d1yicjgl958p45.cloudfront.net/";

      const body = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        redirect_uri: redirectUri,
        code: code,
      });

      fetch(`https://${domain}/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("idToken", data.id_token);
          localStorage.setItem("accessToken", data.access_token);
          navigate("/account", { replace: true }); // Redirect to main screen
        })
        .catch((err) => console.error("Token exchange error:", err));
    }
  }, [location.search, navigate]);

  return (
    <div className="text-gray-600 text-xl p-4">
      Welcome to Money Exchange App
    </div>
  );
};

export default Home;
