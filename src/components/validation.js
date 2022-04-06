import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import axios from "axios";
import * as faceapi from "face-api.js";
import "bulma/css/bulma.min.css";
import "./survey.css";

const ValidationSurvey = () => {
  const history = useHistory();
  const [id, setid] = useState("");
  const {username} = useParams();
  const {url_mail} = useParams();
  const [passport, setpassport] = useState("");
  useEffect(() => {
    checkemail();
    // checkstatus();
    checkid();
  }, []);
  
  /* function loadImage(pass) {
    if(pass) {
      const devEnv = process.env.NODE_ENV !== "production";
      const {REACT_APP_DEV_URL_sendmail, REACT_APP_PROD_URL} = process.env;
      const MODEL_URL = `${devEnv ? REACT_APP_DEV_URL_sendmail : REACT_APP_PROD_URL}`+'/models/';
      var descriptions = [];
      const faceImage = new Image()
      faceImage.src = pass
      const res = faceapi.detectAllFaces(faceImage).withFaceLandmarks().withFaceDescriptors()
      if(res) {
        descriptions = [res.descriptor]
      }
      console.log(descriptions);
      console.log(res);
      const labeledDescriptors = [new faceapi.LabeledFaceDescriptors(username, descriptions )]
      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)
      console.log('faceMatcher:', faceMatcher);
    }
    descriptions.push(detections.descriptor)
    console.log(descriptions);
  } */
  
  async function loadImage(pass, id) {
    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL_sendmail, REACT_APP_PROD_URL} = process.env;
    await axios.post(`${devEnv ? REACT_APP_DEV_URL_sendmail : REACT_APP_PROD_URL}/validation`, {
      image:pass,
      name:username,
      id:id,
      urlmail:url_mail
    })
    .then((res) => {
      // console.log(res);
      window.location.href=`/complete/${url_mail}/${username}`
    })
  }
  
  function loadLabeledImages() {
    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL_sendmail, REACT_APP_PROD_URL} = process.env;
    const MODEL_URL = `${devEnv ? REACT_APP_DEV_URL_sendmail : REACT_APP_PROD_URL}`+'/models/';
    const labels = [`${username}`]
    return Promise.all(
      labels.map(async label => {
        const descriptions = []
        for (let i = 1; i <= 3; i++) {
          const img = await faceapi.fetchImage(`${devEnv ? REACT_APP_DEV_URL_sendmail : REACT_APP_PROD_URL}/customerPhoto/${label}/${label}_${i}.png`)
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
          // console.log(detections);
          descriptions.push(detections.descriptor)
        }
        return new faceapi.LabeledFaceDescriptors(labels, descriptions)
      })
    )
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
      const pass = respon.data[0].filename;
      setpassport(pass);
      // checkstatus(stat);
      loadImage(pass, respon.data[0].id);
      // getface(respon.data[0].imagearray,respon.data[0].filename);
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
        history.push("/error")
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
    }).then((res) => {
      setpassport(res.filename)
      loadImage();
    })
    .catch((err) => console.log(err));
  }
  return (
    <center>
      <div className="loadingContainer">
        <div className="is-size-3 onProgress">Please wait...</div>
      </div>
    </center>
  )
}

export default ValidationSurvey;