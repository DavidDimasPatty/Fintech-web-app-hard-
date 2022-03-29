import React, { useEffect, useState } from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import { ReactSession } from 'react-client-session';
import { useHistory,useParams} from 'react-router-dom';
import "./home.css"
import { MDBContainer, MDBRow, MDBCol,
  MDBCard,MDBBtn } from "mdbreact";
import 'fa-icons';
const Home = () => {
    const token=ReactSession.get("login");
    console.log(token);
    const history=useHistory();
    if(token!="true"){
        history.push('/')
        return(<div style={'height:100'}></div>);
    }
     
return (

  
  <div class="container column is-20" >
  <nav class="breadcrumb" aria-label="breadcrumbs">
  <ul>
    <li><Link to={`/home`}>Home</Link></li>
    </ul>
</nav>
    <MDBCard className='mt-5 column is-10'>
      <MDBCol>
      <MDBRow className='mb-2'>
        <center><MDBCol><h2 className='is-size-2'>Welcome</h2></MDBCol></center>
      </MDBRow>
      <MDBRow>
        <MDBCol></MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol></MDBCol>
      </MDBRow>
     
      </MDBCol>
      </MDBCard>
      
  </div>
  
  )
}

export default Home
