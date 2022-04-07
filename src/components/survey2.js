import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import axios from "axios";
import "bulma/css/bulma.min.css";
import "./survey.css";
import {ReactSession} from "react-client-session";

const Mail2 = () => {
  /* set variable */
  var [passport2, setpassport] = useState(null);
  const [passport, setSavepassport] = useState("");
  const history = useHistory();
  const {url_mail} = useParams();
  const {username} = useParams();
  const [id, setid] = useState("");
  const [filename, setfilename] = useState("");
  const [name, setname] = useState("");
    var tokenup=ReactSession.get("upload")
  /*  */
  
  setTimeout(() => {
    window.location.reload();
  }, 10000);

    useEffect(() => {
  /* check token kalo udah ada file */
     if(tokenup==true){
    document.getElementById("vid").disabled = true;
    document.getElementById("btnsubmit").disabled = false
  } 
  /*  */

    checkemail();
    checkid();
    checkvideo();
  }, []);
  
  /* check video ke db */
  const checkvideo = async(e) => {
    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL_sendmail, REACT_APP_PROD_URL} = process.env;
    await axios.post(`${devEnv ? REACT_APP_DEV_URL_sendmail : REACT_APP_PROD_URL}/checkfile`, {
      name:username
    })
    .then((res) => {
     console.log(res.data.check)
     
      if(res.data.check=="ok"){
        ReactSession.set("upload",true)
        document.getElementById("vid").disabled = true;
        document.getElementById("btnsubmit").disabled = false
      }
      else{
        document.getElementById("vid").disabled = false;
        document.getElementById("btnsubmit").disabled = true;
      }
    })
    .catch((err) => console.log(err));
  }
  /*  */
  
  function checkstatus(stat) {
    if(stat === "Section 1"||stat === "Pending") {
      history.push(`/mail/${url_mail}/${username}`)
    }
    if(stat === "Section 3") {
      history.push(`/mail3/${url_mail}/${username}`)
    }
    if(stat === "Complete") {
      history.push(`/complete/${url_mail}/${username}`)
    }
  } 
  
  /* handle change input file */
  async function handleUploadChange(e) {
    let uploaded = e.target.files[0];
    passport2 = uploaded
    setpassport(uploaded)
    downloadFile().then(()=>checkvideo())
  }
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
      //checkstatus(respon.data[0].status);
      passport2=respon.data[0].videourl
   
       if(tokenup!== "") {
        document.getElementById("vid").disabled = true;
        document.getElementById("btnsubmit").disabled = false
      }
      else{
        document.getElementById("vid").disabled = false;
        document.getElementById("btnsubmit").disabled = true
      } 
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

/* put file to server */
  const downloadFile = async(e) => {
    
   ReactSession.set("upload",true)
    let formData = new FormData();
    formData.append("video", passport2);
    formData.append("id", id)
    formData.append("name", username)
    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL_sendmail, REACT_APP_PROD_URL} = process.env;
    await fetch(`${devEnv ? REACT_APP_DEV_URL_sendmail : REACT_APP_PROD_URL}/download2`, {
      method: "POST",
      body: formData,
    }).then((res)=>{
      if(res.data.check=="ok"){
        ReactSession.set("upload",true)
        document.getElementById("vid").disabled = true;
        document.getElementById("btnsubmit").disabled = false
      }
    })
    .catch((err) => console.log(err));
  }
  /*  */
  const next = async(e) => {
    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;
    await axios.patch(`${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer/${id}`, {
        status:"Section 3"
    })
    .then((respon) => {
      window.location.href=`/mail3/${url_mail}/${username}`
    }).catch((err) => console.log(err));
  }
/*  */
  return (
    <center>
      <div className="surveyContainer mt-5 column is-6">
        <div className="is-size-2 mb-4">Form</div>
        <div>Upload Video (maximum 5 second)</div>
        <input className="mt-2 mb-2" onChange={handleUploadChange} type="file" id="vid" accept="video/*"/>
        <button className="btn btn-primary mt-4 mb-4 w-100" id="btnsubmit" onClick={next}>Next</button>
      </div>
    </center>
  )

  
}

export default Mail2;