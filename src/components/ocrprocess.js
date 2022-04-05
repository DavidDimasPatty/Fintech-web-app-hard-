import React, {useEffect, useState} from "react";
import {ReactSession} from "react-client-session";
import {useHistory, useParams} from "react-router-dom";
import axios from "axios";
import "bulma/css/bulma.min.css";
//import Tesseract from "tesseract.js";

const OCRPROCESS = () => {
  
  const history = useHistory();
  const {url_mail} = useParams();
  const {username} = useParams();
  const [id, setid] = useState("");
  const [filename, setfilename] = useState("");
  const [name, setname] = useState("");
  
  useEffect(() => {
    checkemail();
    checkid();
  }, []);


  /* PROCESS OCR di front end */
  /* async function ocr(imagee) {
   await Tesseract.recognize(
      imagee,
      'eng',
      { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
      console.log(text);
      tex(text);
    })
  } */
  
  async function ocr(image) {
    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL_sendmail, REACT_APP_PROD_URL} = process.env;
    await axios.post(`${devEnv ? REACT_APP_DEV_URL_sendmail : REACT_APP_PROD_URL}/ocr`, {
      image:image
    })
    .then((res) => {
      // console.log(res);
      if(res.data.name.length != 0) {
        // console.log(res.data.name[0].name);
        ReactSession.set("name", res.data.name[0].name)
      }
      ;
      window.location.href=`/mail2/${url_mail}/${username}`
    })
    .catch((err) => console.log(err));
  }
  
  async function tex(e, text) {
    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL_sendmail, REACT_APP_PROD_URL} = process.env;
    e.preventDefault();
    await axios.post(`${devEnv ? REACT_APP_DEV_URL_sendmail : REACT_APP_PROD_URL}/getname`, {
      text:text
    })
    .then((res) => {
      const fullname = res.data.name[0].name;
      setname(fullname)
      // console.log(fullname);
      // history.push(`/mail2/${url_mail}/${username}`)
    })
    .catch((err) => console.log(err));
  }
  
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
      setfilename(respon.data[0].filename)
      // console.log("file: " + respon.data[0].filename);
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
  
  return (
    <center>
      WAIT
    </center>
  )

}

export default OCRPROCESS;