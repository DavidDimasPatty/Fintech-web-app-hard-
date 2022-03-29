import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useHistory,useParams} from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol,
  MDBCard,MDBBtn } from "mdbreact";
  import { Button,Section } from 'react-bulma-components';
  import moment from "moment";


import 'bulma/css/bulma.min.css';
const CompleteSurvey = () => {
    const history=useHistory();
    const [id, setid]=useState('');
    const {username}=useParams();
  const [status, setstatus]=useState('');
  const {url_mail}=useParams();

    useEffect(() => {
        checkemail();
        checkid();
        checkstatus();
      }, []);

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
      function checkstatus(stat){
        console.log(stat);
        if(stat==="Section 2"){
          history.push(`/mail2/${url_mail}/${username}`)
        }
        if(stat==="Section 3"){
          history.push(`/mail3/${url_mail}/${username}`)
        }
        if(stat==="Section 1"){
          history.push(`/mail/${url_mail}/${username}`)
        }
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
    
    
  return (
    <center>
    <MDBContainer size="12" >
      <MDBCard className='mt-5 column is-6'>
            Thank you for filling this survey!
    </MDBCard>
  </MDBContainer>
            
    </center>  
  )
}

export default CompleteSurvey