import React from "react";
import {ReactSession} from "react-client-session";
import {useHistory} from "react-router-dom";
import "./home.css";

const Home = () => {

  const token = ReactSession.get("login");
  // console.log(token);
  const history = useHistory();

  if(token != "true") {
    history.push("/");
    return(
      <div style={"height:100"}></div>
    );
  }

  return (

  <div className="container column is-20">

    <nav className="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><a href="/home">Home</a></li>
      </ul>
    </nav>

    <div className="cardContainer column is-10">
      <center>
        <div className="is-size-2">Welcome</div>
      </center>
    </div>

  </div>

  )

}

export default Home;