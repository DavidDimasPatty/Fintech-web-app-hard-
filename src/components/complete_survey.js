import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import axios from "axios";
import {MDBContainer, MDBCard} from "mdbreact";
import "bulma/css/bulma.min.css";
import "./survey.css";

const CompleteSurvey = () => {
  /* set variable */
  const history = useHistory();
  const [id, setid] = useState("");
  const [photo, setphoto] = useState([]);
  const {username} = useParams();
  const [status, setstatus] = useState("");
  const {url_mail} = useParams();
  const [passport, setpassport] = useState("");
  useEffect(() => {
    checkemail();
    checkid();
    // checkstatus();
  }, []);
  /*  */

  /* validation for page display */
  const checkid = async(e) => {
    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;
    await axios.get(`${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer`, {
      params: {
        name:username
      }
    })
    .then((respon) => {
      setid(respon.data[0].id);
      checkstatus(respon.data[0].status);
      setphoto(respon.data[0].imagearray);
    })
  }
  
  function checkstatus(stat) {
    if(stat === "Section 2") {
      history.push(`/mail2/${url_mail}/${username}`)
    }
    if(stat === "Section 3") {
      history.push(`/mail3/${url_mail}/${username}`)
    }
    if(stat === "Section 1"||stat === "Pending") {
      history.push(`/mail/${url_mail}/${username}`)
    }
  }
  
  const checkemail = async(e) => {
    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;
    await axios.get(`${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/mail_url`, {
      params: {
        url:url_mail
      }
    })
    .then((respon) => {
      if(respon.data.length == 0) {   
        history.push("/error");
        return("blank");
      }
    }).catch((err) => console.log(err));
  }
  /*  */
  
  return (
    <center>
      <div className="surveyContainer column is-6">
        <div className="is-size-3 mb-5">Thank you for filling this survey!</div>
      </div>
    </center>
  )
}

export default CompleteSurvey;