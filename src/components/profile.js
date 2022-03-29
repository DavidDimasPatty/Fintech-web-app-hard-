import React from 'react'
import {useState,useEffect} from 'react'
import axios from "axios";
import {Link} from "react-router-dom";
import { useHistory,useParams} from 'react-router-dom';
import "./profile.css"
import { MDBContainer, MDBRow, MDBCol,
  MDBCard,MDBBtn } from "mdbreact";

import { ReactSession } from 'react-client-session';
import { Button } from 'react-bulma-components';

const Profile = () => {
    const [name, setName]=useState('');
    const [email, setEmail]=useState('');
    const [birth, setBirth]=useState('');
    const [country, setCountry]=useState('');
    const [filename, setfilename]=useState(''); 
    const [video, setvideo]=useState(''); 
    const [passnum, setpassnum]=useState(''); 
    const [occupation, setoccupation]=useState(''); 
    const [address, setaddress]=useState(''); 
    const [phone, setphone]=useState('');  
    const [status, setstatus]=useState('');  
    const {id}=useParams();
   
    const history=useHistory();
    useEffect(()=>{
        getProfile();
    },[]);

    function download(links){
      const link = document.createElement('a');
      link.href = links;
      link.target="__blank"
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    
  
    

    const getProfile = async ()=>{
    const devEnv=process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL,REACT_APP_PROD_URL} =process.env;
        const response= await axios.get(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer/${id}`,)
        console.log(response.status);
        console.log(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
        setBirth(response.data.birth);
        setCountry(response.data.country);
         setfilename(response.data.filename); 
        setvideo(response.data.videourl); 
        setpassnum(response.data.passnum); 
        setoccupation(response.data.occupation); 
        setaddress(response.data.address); 
        setphone(response.data.phone);  
        setstatus(response.data.status);  
       
    }
    const token=ReactSession.get("login");
    console.log(token);
  
    if(token!="true"){
        history.push('/')
        return(<div style={'height:100'}></div>);
    }
  return (
    <div class="container column is-20" >
     <nav class="breadcrumb" aria-label="breadcrumbs">
  <ul>
    <li><Link to={`/home`}>Home</Link></li>

    <li><Link to={`/customers`}>Customer List</Link></li>
    <li><Link to={`/customers/${id}`}>Detail</Link></li>
    </ul>
    </nav>
    <MDBCard className='mt-5 column is-10'>
      <MDBCol>
      <MDBRow className='mb-2'>
        <center><MDBCol> <img src="https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png" width={90} height={100}></img></MDBCol></center>
      </MDBRow>
      <MDBRow>
      <center> <MDBCol><h3 className='is-size-2'>{name}</h3></MDBCol></center>
      </MDBRow>
      <MDBRow>
      <center>  <MDBCol><h3 className='is-size-2'>{email}</h3></MDBCol></center>
      </MDBRow>
     
      <MDBRow>
      <center>  <MDBCol>{birth}</MDBCol></center>
      </MDBRow>


      <MDBRow>
      <center>  <MDBCol>{country}</MDBCol></center>
      </MDBRow>

      <MDBRow>
      <center>  <MDBCol> {passnum}</MDBCol></center>
      </MDBRow>
      <MDBRow>
      <center>  <MDBCol> {phone}</MDBCol></center>
      </MDBRow>
      <MDBRow>
      <center>  <MDBCol> {address}</MDBCol></center>
      </MDBRow>
      <MDBRow>
      <center>  <MDBCol> {occupation}</MDBCol></center>
      </MDBRow>
      <MDBRow className='pb-3'>
      <center>  <MDBCol>Status: {status}</MDBCol></center>
      </MDBRow>

      </MDBCol>
      <center>
      <MDBRow>
      <MDBCol> 
      Passport PDF : 
      </MDBCol>
      <MDBCol> 
      <Button color="info  is-small" onClick={() => { download(filename) }}>Download Passport</Button>
      </MDBCol>
      </MDBRow>
      </center>
      <center>
      <MDBRow>
      <MDBCol> 
      Video 5 sec of customer : 
      </MDBCol>
      <MDBCol> 
      <Button color="info  is-small"  onClick={() => { download(video) }}>Download Video</Button>
      </MDBCol>
      </MDBRow>
      </center>
      </MDBCard>
      
  </div>
  )
}

export default Profile