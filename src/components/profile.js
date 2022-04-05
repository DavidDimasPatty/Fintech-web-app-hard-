import React, {useState, useEffect} from "react";
import {ReactSession} from "react-client-session";
import {useHistory, useParams} from "react-router-dom";
import axios from "axios";
import "./profile.css";

const Profile = () => {
  
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birth, setBirth] = useState("");
  const [country, setCountry] = useState("");
  const [filename, setfilename] = useState("");
  const [video, setvideo] = useState("");
  const [passnum, setpassnum] = useState("");
  const [occupation, setoccupation] = useState("");
  const [address, setaddress] = useState("");
  const [phone, setphone] = useState("");
  const [status, setstatus] = useState("");
  const [photo, setphoto]=useState("");
  const {id} = useParams();
  
  useEffect(() => {
    getProfile();
  }, []);
  
  function download(links) {
    const link = document.createElement("a");
    link.href = links;
    link.target = "__blank"
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  const accept = async () => {
    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;
    const response = await axios.patch(`${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer/${id}`, {
      status:"Accept"
    }).then((res) => {
      window.location.href=`/customers/${id}`
    })
  }
  
  const reject = async () => {
    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;
    const response = await axios.patch(`${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer/${id}`, {
      status:"Reject"
    }).then((res) => {
      window.location.href=`/customers/${id}`
    })
  }
  
  const getProfile = async () => {
    const devEnv = process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL, REACT_APP_PROD_URL} = process.env;
    const response = await axios.get(`${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer/${id}`,)
    // console.log(response.status);
    // console.log(response.data);
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
    if(response.data.profile_picture == "") {
      setphoto("https://freepikpsd.com/file/2019/10/default-profile-image-png-1-Transparent-Images.png");
    }
    else {
      setphoto(response.data.profile_picture);
    }
  }
  
  const token = ReactSession.get("login");
  // console.log(token);
  
  if(token != "true") {
    history.push("/");
    return(
      <div style={"height:100"}></div>
    );
  }
  
  return (
  
    <div className="container column is-20">
      
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li><a href="/home">Home</a></li>
          <li><a href="/customers">Customer List</a></li>
          <li><a href={`/customers/${id}`}>Detail</a></li>
        </ul>
      </nav>

      <div className="cardContainer mt-5 mb-5 column is-10">
        
        <center>
          <img className="profileImage" src="https://freepikpsd.com/file/2019/10/default-profile-image-png-1-Transparent-Images.png"/>
          <div className="profileInfo">
            <div className="is-size-4">Name</div>
            <span className="is-size-4">:</span>
            <div className="is-size-4">{(name === "" || name == null) ? "-" : name}</div>
          </div>
          <div className="profileInfo">
            <div className="is-size-4">Email</div>
            <span className="is-size-4">:</span>
            <div className="is-size-4">{(email === "" || email == null) ? "-" : email}</div>
          </div>
          <div className="profileInfo">
            <div className="is-size-4">Birth</div>
            <span className="is-size-4">:</span>
            <div className="is-size-4">{(birth === "" || birth == null) ? "-" : birth}</div>
          </div>
          <div className="profileInfo">
            <div className="is-size-4">Country</div>
            <span className="is-size-4">:</span>
            <div className="is-size-4">{(country === "" || country == null) ? "-" : country}</div>
          </div>
          <div className="profileInfo">
            <div className="is-size-4">Passport</div>
            <span className="is-size-4">:</span>
            <div className="is-size-4">{(passnum === "" || passnum == null) ? "-" : passnum}</div>
          </div>
          <div className="profileInfo">
            <div className="is-size-4">Phone</div>
            <span className="is-size-4">:</span>
            <div className="is-size-4">{(phone === "" || phone == null) ? "-" : phone}</div>
          </div>
          <div className="profileInfo">
            <div className="is-size-4">Address</div>
            <span className="is-size-4">:</span>
            <div className="is-size-4">{(address === "" || address == null) ? "-" : address}</div>
          </div>
          <div className="profileInfo">
            <div className="is-size-4">Occupation</div>
            <span className="is-size-4">:</span>
            <div className="is-size-4">{(occupation === "" || occupation == null) ? "-" : occupation}</div>
          </div>
          <div className="profileInfo">
            <div className="is-size-4">Status</div>
            <span className="is-size-4">:</span>
            <div className="is-size-4" id={(status === "Reject") ? "reject" : "success"}>{(status === "" || status == null) ? "-" : status}</div>
          </div>
          <div className="is-size-3 mt-5">Passport PDF :</div>
          <button color="info is-small" onClick={() => { download(filename) }}>Download Passport</button>
          <div className="is-size-3 mt-5">Video 5 sec of customer :</div>
          <button className="mb-5" color="info is-small" onClick={() => { download(video) }}>Download Video</button>
          <div className="profileInfo">
            <button onClick={() => { accept() }}>Accept</button>
            <button onClick={() => { reject() }}>Reject</button>
          </div>
        </center>
        
      </div>
    
    </div>
    
  )

}

export default Profile;