import React, {useEffect, useState} from "react";
import {ReactSession} from "react-client-session";
import {useHistory, useParams} from "react-router-dom";
import axios from "axios";
import "bulma/css/bulma.min.css";
import "./survey.css";

const OCRPROCESS = () => {
  /* set variable */
  const history = useHistory();
  const {url_mail} = useParams();
  const {username} = useParams();
  const [id, setid] = useState("");
  const [filename, setfilename] = useState("");
  const [name, setname] = useState("");
  /*  */

  useEffect(() => {
    checkemail();
    checkid();
  }, []);

  /* process ocr ke server (tesseract) */  
  async function ocr(image) {
    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL_sendmail, REACT_APP_PROD_URL} = process.env;
    await axios.post(`${devEnv ? REACT_APP_DEV_URL_sendmail : REACT_APP_PROD_URL}/ocr`, {
      image:image
    })
    .then((res) => {
      ReactSession.set("upload","")
       console.log(res);
      if(res.data.name.length != 0) {
        ReactSession.set("name", res.data.name[0].name)
      }
      if(res.data.country.length != 0) {
        ReactSession.set("country", res.data.country[0].name)
      }
      if(res.data.date.length != 0) {
        ReactSession.set("birthdate", res.data.date[0].date)
      }
      window.location.href=`/mail2/${url_mail}/${username}`
    })
    .catch((err) => console.log(err));
  }
   /*  */

   /* page validation */
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
      setfilename(respon.data[0].filename)
      ocr(respon.data[0].filename);
    })
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
        history.push("/error")
        return("blank");
      }
    }).catch((err) => console.log(err));
  }
  /*  */
  
  return (
    <center>
      <div className="loadingContainer">
        <div className="is-size-3 onProgress">Please wait...</div>
      </div>
    </center>
  )

}

export default OCRPROCESS;