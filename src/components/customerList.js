import React, {useEffect, useState} from "react";
import {ReactSession} from "react-client-session";
import {useHistory} from "react-router-dom";
import axios from "axios";
import "./customerList.css";

const CustomerList = () => {

  const [customer, setCustomer] = useState([]);
  useEffect(() => {
    getAllCustomer();
  }, []);

  const history = useHistory();

  const getAllCustomer = async () => {

    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;
    const response = await axios.get(`${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer`);
    // console.log(response.data);
    setCustomer(response.data);

  }
  
  const token = ReactSession.get("login");
  // console.log(token);
  
  if(token != "true") {
    history.push("/");
    return (
      <div style={"height:100"}></div>
    );
  }
  
  return (

  <div className="container column is-20">

    <nav className="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><a href="/home">Home</a></li>
        <li><a href="/customers">Customer</a></li>
      </ul>
    </nav>

    <div className="containers">
      
      {customer.map((customers) => 
        <div key={customers.id}> {
          <div className="customerCard m-3 pb-2">
            <div className="cardImage" style={{ backgroundImage: 'url(' + customers.profile_picture + ')' }} id={(customers.profile_picture === "" || customers.profile_picture == null) ? "" : "photo"}><img src={(customers.profile_picture === "" || customers.profile_picture == null) ? "https://freepikpsd.com/file/2019/10/default-profile-image-png-1-Transparent-Images.png" : ""}/></div>
            <div className="cardInfo">
              <div className="cardLabel">{customers.name.replace("_"," ")}</div>
              <div className="cardLabel">{customers.email}</div>
              <div className="cardLabel">Status:</div>
              <div className={(customers.status === "Rejected") ? "fail cardLabel" : "success cardLabel"} id={(customers.status === "Pending") ? "pending" : ""}>{customers.status}</div>
              <div className="cardButton"><a href={`/customers/${customers.id}`} className="button is-small is-info">Detail</a></div>
            </div>
          </div>
        }</div>
      )}
        
    </div>
  
  </div>
  
  )

}

export default CustomerList;