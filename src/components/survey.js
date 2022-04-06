import React, {useEffect, useState} from "react";
import axios from "axios";
import {useHistory,useParams} from "react-router-dom";
import "bulma/css/bulma.min.css";
import "./survey.css";

const Mail = () => {
  const [passport2, setpassport] = useState("");
  const [passport, setSavepassport] = useState(null);
  const history = useHistory();
  const {url_mail} = useParams();
  const {username} = useParams();
  const [id, setid] = useState("");
  const [status, setstatus] = useState("");
  useEffect(() => {
    checkemail();
    checkid();
  }, []);
  
  function checkstatus(stat) {
    if(stat === "Section 1") {
      history.push(`/mail/${url_mail}/${username}`)
    }
    if(stat === "Section 3") {
      history.push(`/mail3/${url_mail}/${username}`)
    }
    if(stat === "Complete") {
      history.push(`/complete/${url_mail}/${username}`)
    }
  }
  
  function handleUploadChange(e) {
    let uploaded = e.target.files[0];
    setpassport(URL.createObjectURL(uploaded))
    // console.log(passport2);
    setSavepassport(uploaded);
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
      const stat = respon.data[0].status;
      /* checkstatus(stat); */
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
  const downloadFile = async(e) => {
    if(passport) {
      let formData = new FormData();
      formData.append("file", passport);
      formData.append("id", id)
      formData.append("name", username)
      const devEnv=process.env.NODE_ENV !== "production";
      const {REACT_APP_DEV_URL_sendmail, REACT_APP_PROD_URL} = process.env;
      e.preventDefault();
      fetch(`${devEnv ? REACT_APP_DEV_URL_sendmail : REACT_APP_PROD_URL}/download`, {
        method: "POST",
        body: formData,
      })
      .finally(() => {
        window.location.href=`/process1/${url_mail}/${username}`
      })
      .catch((err) => console.log(err));
    }
    else {
      window.alert("File input can't be empty")
    }
  }
    
  return (
    <center>
      <div className="surveyContainer mt-5 column is-6">
        <div className="is-size-2 mb-4">Form</div>
        <div>Upload your passport</div>
        <input className="mt-2 mb-2" onChange={handleUploadChange} type="file" accept="image/png, image/gif, image/jpeg"/>
        <button className="btn btn-primary mt-4 mb-4 w-100" onClick={downloadFile}>Next</button>
      </div>
    </center>
  )
}

export default Mail;