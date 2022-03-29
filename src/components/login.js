import React, { useEffect, useState,Fragment } from 'react';
import { Button,Section } from 'react-bulma-components';
import axios from "axios";
import { useHistory,useParams} from 'react-router-dom';
import {Link} from "react-router-dom";
import { ReactSession } from 'react-client-session';
import { MDBContainer, MDBRow, MDBCol,
  MDBCard,MDBBtn } from "mdbreact";

import 'bulma/css/bulma.min.css';


const Login = () => {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const token=ReactSession.get("login");
    console.log(token);
    const history=useHistory();
    
    const login = async (e)=>{
        const devEnv=process.env.NODE_ENV !== "production";
        const {REACT_APP_DEV_URL,REACT_APP_PROD_URL} =process.env;
         await axios.get(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/user`,{
            params: {
              username:username,
              password:password
            }
        }).then((respon)=>{
           if(respon.data.length!==0){
          console.log(respon.data);
            ReactSession.set("login", "true");
            history.push("/home");
           }
           else{
             
           }
        }).catch((err) => console.log(err));
          
        
      }
     
    return (
      <center>
      <MDBContainer size="12" >
        <MDBCard className='mt-5 column is-6'>
      <MDBCol>
      <MDBRow className='mb-2'>
        <MDBCol><h2 className='is-size-2'>Log In</h2></MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>Username</MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol><input className="input is-info is-small column is-6" type="text" onChange={e => setUserName(e.target.value)} /></MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol><p>Password</p></MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol><input className="input is-info is-small column is-6" type="password" onChange={e => setPassword(e.target.value)}/></MDBCol>
      </MDBRow>
      <MDBRow className='mt-2'>
        <MDBCol>
      
        <Button color="success" onClick={login}>Login</Button>
    
          </MDBCol>
      </MDBRow>
      <MDBRow className='mt-2 pb-3'>
        <MDBCol><Link to={`/signup`} className='button is-small is-info'>Sign Up</Link></MDBCol>
      </MDBRow>
      </MDBCol>
      </MDBCard>
    </MDBContainer>
    </center>
        )
  }


export default Login
