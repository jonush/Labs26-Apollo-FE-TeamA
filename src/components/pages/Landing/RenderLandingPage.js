import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "antd";

function RenderLandingPage(props) {
  const history = useHistory();

  const signup = () => {
    history.push("/signup");
  };

  const login = () => {
    history.push("/login");
  };

  return (
    <div className="landing">
      <div className="welcome">
        <h1>Apollo</h1>

        <p>
          Automate your stand ups with Apollo. Create a topic and define a
          context to align your team towards a unified goal. Reply to topic
          responses to remove blockers and streamline your team efficiency.
        </p>
      </div>

      <div className="user-buttons">
        <Button type="primary" onClick={signup}>
          Sign Up
        </Button>

        <Button type="secondary" onClick={login}>
          Log In
        </Button>
      </div>
    </div>
  );
}
export default RenderLandingPage;
