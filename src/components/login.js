import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {ReactSession} from "react-client-session";
import axios from "axios";
import "bulma/css/bulma.min.css";
import "./login.css";

const Login = () => {

  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  /* TOKEN */
  const token = ReactSession.get("login");


  const history = useHistory();

  /* Check table user di db */
  const login = async (e) => {
    
    if(username && password) {
      
      const devEnv = process.env.NODE_ENV !== "production";
      const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;
  
      await axios.get(`${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/user`, {
        params: {
          username:username,
          password:password
        }
      }).then((respon) => {

        if(respon.data.length !== 0) {
         /* set token kalau berhasil login */
          ReactSession.set("login", "true");
          history.push("/home");
        }
        else{
        
          window.alert("Invalid username or password");
        }

      }).catch((err) => console.log(err));

    }
    else{
      window.alert("Username or password can't be empty");
    }

  }
  /*  */
  return (

  <center>

    <div className="loginContainer">
      
      <div className="loginTitle">Log In</div>
      
      <div className="loginLabel">Username</div>
      <div className="loginInput"><input type="text" onChange={e => setUserName(e.target.value)} spellCheck="false" required/></div>

      <div className="loginLabel">Password</div>
      <div className="loginInput"><input type="password" onChange={e => setPassword(e.target.value)} required/></div>

      <button className="loginButton" onClick={login}>Login</button>
      
      <a href="/signup" className="linkButton"><button className="signupButton">Sign Up</button></a>
    
    </div>

  </center>

  )

}

export default Login;