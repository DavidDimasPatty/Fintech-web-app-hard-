import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import axios from "axios";
import moment from "moment";
import "bulma/css/bulma.min.css";
import "./onboard.css";
import {ReactSession} from "react-client-session";

const Onboard = () => {

  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const history = useHistory();
  const date_create = moment().format("DD-MM-YYYY hh:mm:ss");
  const randomUrl = Math.floor(100000000 + Math.random() * 900000000);
  
  const saveUrl = async(e) => {

    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_PROD_URL, REACT_APP_DEV_URL} = process.env;

    await axios.post(`${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/mail_url`, { 
      url:randomUrl
    })
    validate();
 


  }
  const token = ReactSession.get("login");
  if(token != "true") {
    history.push("/");
    return(
      <div style={"height:100"}></div>
    );
  }
  const validate = async (e) => {

    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;

    await axios.get(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer`, {
      params: {
        username:username,
        email:email
      }
    }).then((respon) => {
      console.log(respon.data);
      if(respon.data.length === 0) {
        sendemail(randomUrl);
        savecustomer();
      }
      else{
        window.alert("Username or email has been taken");
      }

    })

  }
  
  const savecustomer = async(e) => {

    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_PROD_URL, REACT_APP_DEV_URL} = process.env;

    await axios.post(`${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer`, {
      name: username,
      email: email,
      birth: "",
      country: "",
      status:"Pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      filename:"" ,
      videourl: "",
      passnum: "",
      occupation: "",
      address: "",
      phone: "",
      profile_picture: "",
      value: ""
    })

  }
  
  const sendemail = async (random) => {

    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_PROD_URL_mail, REACT_APP_PROD_URL, REACT_APP_DEV_URL_mail ,REACT_APP_DEV_URL_sendmail} = process.env;
    console.log(email);

    if(email.includes("@")){
      await axios.post(`${devEnv ? REACT_APP_DEV_URL_sendmail : REACT_APP_PROD_URL}/send-mail`, {
        data: {
          target:email,
          subject:`Fintech new Customer`,
          html:
          `<h3>Welcome aboard ${username}<h3>
          <div>Halo, ${username}, welcome to fintech, use this link to process next step</div>
          <div><a href="${devEnv ? REACT_APP_DEV_URL_mail : REACT_APP_PROD_URL_mail}/${random}/${username}">Click Here</a><div>`
          
        }
      }).then((respon) => {
        setusername("")
        setemail("")
        // console.log(respon.data);
      })
    }
    else{
      window.alert("email must have '@'")
    }
  }
  
  return (
  
    <center>
      
      <div className="container column is-20">
        
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/customers">Customer</a></li>
          </ul>
        </nav>
      
      </div>

      <div className="customerForm mt-5 column is-10">
        <div className="mb-2">
          <div className="is-size-3 mb-5">Customer Form</div>
          <div className="mt-2">Username</div>
          <input className="input is-info is-small column is-8" type="text" placeholder="username" value={username} onChange={(e) => setusername(e.target.value)}></input>
          <div className="mt-2">Email</div>
          <input className="input is-info is-small column is-8" type="email" placeholder="email" value={email} onChange={(e) => setemail(e.target.value)}></input>
          <button className="mt-5" color="info" onClick={saveUrl}>Generate Link</button>
        </div>
      </div>
    
    </center>
  
  )

}

export default Onboard;