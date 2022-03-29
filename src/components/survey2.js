import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useHistory,useParams,Link} from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol,
  MDBCard,MDBBtn } from "mdbreact";
  import { Button,Section } from 'react-bulma-components';


import 'bulma/css/bulma.min.css';
const Mail2 = () => {
  const [passport2, setpassport] = useState('');
  const [passport, setSavepassport]=useState('');
  const history=useHistory();
  const {url_mail}=useParams();
  const {username}=useParams();
  const [id, setid]=useState('');
  const [filename,setfilename]=useState('');


  useEffect(() => {
    checkemail();
    checkid();
  }, []);

  function checkstatus(stat){
    
    if(stat==="Section 2"){
      history.push(`/mail2/${url_mail}/${username}`)
    }
    if(stat==="Section 3"){
      history.push(`/mail3/${url_mail}/${username}`)
    }
    if(stat==="Complete"){
      history.push(`/complete/${url_mail}/${username}`)
    }
  }

  function handleUploadChange(e) {
    let uploaded = e.target.files[0];
    setpassport(URL.createObjectURL(uploaded))
    console.log(passport2)
    setSavepassport(uploaded);
  }

  const checkid=async(e)=>{
    const devEnv=process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL,REACT_APP_PROD_URL} =process.env;
    await axios.get(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer`,{
      params:{
        name:username
      }  
    
    })
    .then((respon)=>{
      console.log(respon.data[0].id)
      setid(respon.data[0].id);
      const stat=respon.data[0].status;
       checkstatus(stat);
    })
    }

    const checkemail=async(e)=>{
      const devEnv=process.env.NODE_ENV !== "production";
      const {REACT_APP_DEV_URL,REACT_APP_PROD_URL} =process.env;
      await axios.get(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/mail_url`,{
        params:{
          url:url_mail
        }  
      
      })
      .then((respon)=>{
        
        if(respon.data.length==0){   
          history.push('/error')
          return("blank");
          
        }
        
     }).catch((err) => console.log(err));
    }

    const downloadFile=async(e)=>{
      if(passport){
      let formData = new FormData();
      formData.append("video", passport);
      formData.append("id",id)
      const devEnv=process.env.NODE_ENV !== "production";
      const {REACT_APP_DEV_URL_sendmail ,REACT_APP_PROD_URL} =process.env;
      e.preventDefault();
      fetch(`${devEnv  ? REACT_APP_DEV_URL_sendmail : REACT_APP_PROD_URL}/download2`, {
        method: "POST",
        body: formData,
      }
      )
      .then( 
        history.push(`/mail3/${url_mail}/${username}`))
      .catch((err) => console.log(err));
      
  }
    } 
    

   
  

    
  return (
    <center>
    <MDBContainer size="12" >
      <MDBCard className='mt-5 column is-6'>
    <MDBCol>
    <MDBRow className='mb-2'>
      <MDBCol><h2 className='is-size-2'>Form</h2></MDBCol>
    </MDBRow>
    <MDBRow>
      <MDBCol>Upload Video (maximum 5 second)</MDBCol>
    </MDBRow>
    <MDBRow>
      <MDBCol><input onChange={handleUploadChange}
                      type="file"
                      accept="video/*"
                               /></MDBCol>
    </MDBRow>
   
    <MDBRow className='mt-2 pb-4'>
      <MDBCol>
      <button onClick={downloadFile} className="btn btn-primary mt-2 w-100">
              Next
            </button>
        </MDBCol>
     </MDBRow>
    </MDBCol>
    </MDBCard>
  </MDBContainer>
            
    </center>  
  )
}

export default Mail2