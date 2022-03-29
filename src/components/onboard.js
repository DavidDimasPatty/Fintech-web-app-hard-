import React from 'react'
import {useState} from 'react'
import axios from "axios";
import { useHistory} from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol,
  MDBCard,MDBBtn } from "mdbreact";
  import { Button,Section } from 'react-bulma-components';
  import moment from "moment";
  import './onboard.css';
  import randomstring from 'randomstring'; 
import 'bulma/css/bulma.min.css';
const Onboard = () => {
    const [username, setusername]=useState('');
    const [email, setemail]=useState('');
    const history=useHistory();
    const date_create= moment().format("DD-MM-YYYY hh:mm:ss")
    
    const saveUrl= async(e)=>{
      const randomUrl=Math.floor(100000000 + Math.random() * 900000000);
      const devEnv=process.env.NODE_ENV !== "production";
      const {REACT_APP_PROD_URL,REACT_APP_DEV_URL} =process.env;
      await axios.post(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/mail_url`,
         { 
                    url:randomUrl
              
            })

        savecustomer();
        sendemail(randomUrl);
    }

    const savecustomer= async(e)=>{
      const devEnv=process.env.NODE_ENV !== "production";
      const {REACT_APP_PROD_URL,REACT_APP_DEV_URL} =process.env;
      await axios.post(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer`,{
        name: username,
      email: email,
      birth: "",
      country: "",
      status:"Section 1",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      })
      
    }


    const sendemail = async (random)=>{
      const devEnv=process.env.NODE_ENV !== "production";
      const {REACT_APP_PROD_URL_mail,REACT_APP_PROD_URL,REACT_APP_DEV_URL_mail,REACT_APP_DEV_URL_sendmail} =process.env;
        await axios.post(`${devEnv  ? REACT_APP_DEV_URL_sendmail : REACT_APP_PROD_URL}/send-mail`,{
          data:{
           target:email,
           subject:`Fintech new Customer`,
           html:`<h3>Welcome aboard ${username}<h3>
                <div>Halo, ${username}, welcome to fintech, use this link to process next step</div>
                <div><a href="${devEnv  ? REACT_APP_DEV_URL_mail : REACT_APP_PROD_URL_mail}/${random}/${username}">Click Here</a><div>
           
           `
          }
       }).then((respon)=>{
         setusername('')
         setemail('')
         console.log(respon.data);
           })
     }

    
  return (
    <center>
    <MDBContainer size="20" >
      <MDBCard className='mt-5 column is-10'>
    <MDBCol>
    <MDBRow className='mb-2'>
      <MDBCol><h2 className='is-size-2'>Customer Form</h2></MDBCol>
    </MDBRow>
    <MDBRow>
      <MDBCol>Username</MDBCol>
    </MDBRow>
    <MDBRow>
      <MDBCol><input className="input is-info is-small column is-6"
                     type="text"
                     placeholder="username"
                     value={username}
                     onChange={(e) =>setusername(e.target.value)}
                     /></MDBCol>
    </MDBRow>
    <MDBRow>
      <MDBCol>Email</MDBCol>
    </MDBRow>
    <MDBRow>
      <MDBCol><input className="input is-info is-small column is-6"
                     type="email"
                     placeholder="email"
                     value={email}
                     onChange={(e) =>setemail(e.target.value)}
                     /></MDBCol>
    </MDBRow>
    
   
    <MDBRow className='mt-2 pb-4'>
      <MDBCol>
    
      <Button color="info" onClick={saveUrl}>Generate Link</Button>
  
        </MDBCol>
     </MDBRow>
    </MDBCol>
    </MDBCard>
  </MDBContainer>
            
    </center>  
  )
}

export default Onboard