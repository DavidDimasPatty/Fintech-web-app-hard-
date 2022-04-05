import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import axios from "axios";
import {MDBContainer, MDBCard} from "mdbreact";
import "bulma/css/bulma.min.css";

const CompleteSurvey = () => {
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
  
  const checkid = async(e) => {
    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;
    await axios.get(`${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer`, {
      params: {
        name:username
      }
    })
    .then((respon) => {
      // console.log(respon.data[0].id);
      setid(respon.data[0].id);
      const stat = respon.data[0].status;
      setphoto(respon.data[0].imagearray);
      //checkstatus(stat);
      //getface(respon.data[0].imagearray,respon.data[0].filename);
    })
  }
  
  function checkstatus(stat) {
    // console.log(stat);
    if(stat === "Section 2") {
      history.push(`/mail2/${url_mail}/${username}`)
    }
    if(stat === "Section 3") {
      history.push(`/mail3/${url_mail}/${username}`)
    }
    if(stat === "Section 1") {
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
  
  async function getface(image, filename) {
    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL_sendmail, REACT_APP_PROD_URL} = process.env;
    await axios.post(`${devEnv ? REACT_APP_DEV_URL_sendmail : REACT_APP_PROD_URL}/facecrop`, {      
      image:image,
      name:username,
      id:id,
      filename:filename
    }).then((res) => console.log(res.status))
    .finally(() => console.log("done"))
    .catch((err) => console.log(err));
  }
  
  return (
    <center>
      <MDBContainer>
        <MDBCard className="mt-5 column is-6">
          Thank you for filling this survey!
        </MDBCard>
      </MDBContainer>
    </center>
  )
}

export default CompleteSurvey;