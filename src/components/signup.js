import React from 'react'
import {useState} from 'react'
import axios from "axios";
import { useHistory} from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol,
  MDBCard,MDBBtn } from "mdbreact";
  import { Button,Section } from 'react-bulma-components';
  import moment from "moment";


import 'bulma/css/bulma.min.css';
const AddUser = () => {
    const [username, setusername]=useState('');
    const [password, setpassword]=useState('');
    const [email, setemail]=useState('');
    const history=useHistory();
    const date_create= moment().format("DD-MM-YYYY hh:mm:ss")
    const checkusername = async (e)=>{
      const devEnv=process.env.NODE_ENV !== "production";
      const {REACT_APP_DEV_URL,REACT_APP_PROD_URL} =process.env;
        await axios.get(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/user`,{
          params:{
           username:username
          }
       }).then((respon)=>{
         console.log(respon.data);
          if(respon.data.length===0){
           saveUser();
          }
          else{
              window.alert('username already taken');
          }
       })
     }

    const saveUser = async (e)=>{
      const devEnv=process.env.NODE_ENV !== "production";
      const {REACT_APP_DEV_URL,REACT_APP_PROD_URL} =process.env;
        await axios.post(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/user`,{     
            username:username,
            password:password,
            email:email,
            createdAt:date_create,
            updatedAt:date_create
        })
        history.push("/");
    }
  return (
    <center>
    <MDBContainer size="12" >
      <MDBCard className='mt-5 column is-6'>
    <MDBCol>
    <MDBRow className='mb-2'>
      <MDBCol><h2 className='is-size-2'>Sign Up Form</h2></MDBCol>
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
    
    <MDBRow>
      <MDBCol><p>Password</p></MDBCol>
    </MDBRow>

    <MDBRow>
      <MDBCol> <input className="input is-info is-small column is-6" 
                    type="password"
                     placeholder="password"
                     value={password}
                     onChange={(e) =>setpassword(e.target.value)}
                     />
      </MDBCol>
    </MDBRow>
    <MDBRow className='mt-2 pb-4'>
      <MDBCol>
    
      <Button color="info" onClick={checkusername}>Sign Up</Button>
  
        </MDBCol>
     </MDBRow>
    </MDBCol>
    </MDBCard>
  </MDBContainer>
            
    </center>  
  )
}

export default AddUser