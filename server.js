const jsonServer = require('json-server');
jsonServer.create();
const express= require("express")
const cors= require('cors')
const path = require('path')
const multer = require("multer");
const fs=require('fs')
const app = express();
const mailer=require('nodemailer');
const bodyParser=require('body-parser');
const { default: axios } = require('axios');
require('dotenv').config();
app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 2000;

const storageVideo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/customerVideo");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      path.parse(file.originalname).name +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/customerFile");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      path.parse(file.originalname).name +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
const uploadVideo = multer({ storage: storageVideo });

var param3="";
var param4="";

app.post(`/download2`, uploadVideo.single("video"), (req, res) => {
  console.log(req.body.id)
  param3=req.body.id
  
 let finalImageURL =
    req.protocol + "://" + req.get("host") + "/customerVideo/" + req.file.filename;
    param4=finalImageURL
    updatevideo()
      res.json({ image: finalImageURL });
});


var param1="";
var param2="";
app.post(`/download`, upload.single("file"), (req, res) => {
  console.log(req.body.id)
  param1=req.body.id
  
 let finalImageURL =
    req.protocol + "://" + req.get("host") + "/customerFile/" + req.file.filename;
    param2=finalImageURL
    
    updatepdf()
     res.json({ image: finalImageURL });
});

const updatepdf = async(e)=>{
  const devEnv=process.env.NODE_ENV !== "production";
  const {REACT_APP_DEV_URL,REACT_APP_PROD_URL} =process.env;
    await axios.patch(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer/${param1}`,{         
        filename:param2,
        status:"Section 2"
    })
          
}

const updatevideo = async(e)=>{
  const devEnv=process.env.NODE_ENV !== "production";
  const {REACT_APP_DEV_URL,REACT_APP_PROD_URL} =process.env;
    await axios.patch(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer/${param3}`,{         
        videourl:param4,
        status:"Section 3"
    })
          
}

app.post('/send-mail',(req,res)=>{
  let data=req.body
  let setTransport=mailer.createTransport({
    service:'Gmail',
    auth:{
        user:process.env.username_email,
        pass : process.env.password_email
    }
  })
  var mailOptions={
    from:process.env.username_email,
    to:data.data.target,
    subject:data.data.subject,
    html:data.data.html
  }

  setTransport.sendMail(mailOptions,(error,response)=>{
      if(error){
        res.send(error+response)
      }
      else{
        res.send('Success')
      }
  })
  setTransport.close();
})

if (process.env.NODE_ENV === 'production') {
  
  app.use('/api', jsonServer.router('./db.json')) 
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));

  });
  
}




app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});

