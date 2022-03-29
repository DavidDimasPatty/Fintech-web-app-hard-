import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import { useHistory,useParams} from 'react-router-dom';
import ProfileUi from 'react-profile-card';
import './customerList.css';
import {
  MDBContainer,
  MDBBtn,
  MDBCard,
  MDBRow,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCardText,
  MDBCol
} from 'mdbreact';
import { ReactSession } from 'react-client-session';
const CustomerList = () => {
  const [customer, setCustomer] = useState([]);
  useEffect(() => {
    getAllCustomer();
  }, []);
  const history=useHistory();
  const getAllCustomer = async () => {
    const devEnv=process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL,REACT_APP_PROD_URL} =process.env;
    const response = await axios.get(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer`);
    console.log(response.data);
    setCustomer(response.data);

  }
  // <MDBBtn href={`/profile/${customers.id}`}>Go to Profile</MDBBtn>

  const token = ReactSession.get("login");
  console.log(token);

  if (token != "true") {
    history.push('/')
    return (<div style={'height:100'}></div>);
  }

  return (
    <div >
      <nav class="breadcrumb mt-4 ml-3" aria-label="breadcrumbs">
        <ul>
          <li><Link to={`/home`}>Home</Link></li>

          <li><Link to={`/customers`}>Customer List</Link></li>
        </ul>
      </nav>
      <div className='containers'>
      {customer.map((customers) => (
        <MDBCard className='mt-3 ml-3 mr-3 pl-5 pr-5' >

          <MDBCol>
            <MDBRow className='mb-2 mt-2'>
              <center><MDBCol> <img src="https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png" width={90} height={100} /></MDBCol></center>
            </MDBRow>
            <MDBRow>
              <MDBCol>{customers.name}</MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol>{customers.email}</MDBCol>
            </MDBRow>
            <MDBRow>
            </MDBRow>

            <MDBRow className='mt-4 pb-2'>
              <center> <MDBCol><Link to={`/customers/${customers.id}`} className='button is-small is-info'>Detail</Link></MDBCol></center>
            </MDBRow>
          </MDBCol>
        </MDBCard>
      ))}
    </div>
    </div>
  )
}

export default CustomerList
