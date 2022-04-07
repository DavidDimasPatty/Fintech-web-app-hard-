/* PACKAGE YANG DIGUNAKAN DAN PENJELASANYA */
/* db di server */
const jsonServer = require("json-server"); 
jsonServer.create();
/*  */
/* Server untuk request ke api */
const express = require("express");
const app = express();
/*  */
/* package untuk bisa cors ke semua url */
const cors = require("cors");
/*  */
/* package untuk Screen shoot */
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg"); 
ffmpeg.setFfmpegPath(ffmpegPath);
/*  */
/* package untuk recognize nama dari string */
var nr = require("name-recognition");
const { idali } = require("name-recognition/lib/femaleNames");
/*  */
/* package untuk recognize date dari string */
var dateFinder = require("datefinder");
/*  */
/* package untuk recognize negara dari string */
var countryFinder = require("country-in-text-detector");
/*  */
/* package untuk samain muka di video dan passport */
const faceapi = require("face-api.js");
/*  */
/* package untuk express bisa join sama db */
const path = require("path");
/*  */
/* package buat baca file dan read file */
const fs = require("fs");
/*  */
/* package untuk ocr */
const { createWorker, createScheduler } = require("tesseract.js");
/*  */
/* package untuk save file ke server/local */
const multer = require("multer");
/*  */
/* package untuk ngirim email */
const mailer = require("nodemailer");
/*  */
/* package untuk parser json */
const bodyParser = require("body-parser");
/*  */
/* package untuk crop muka dari screen shoot */
const facecrop = require("opencv-facecrop");
/*  */
/* package untuk mempercepat proses face-api js */
// const tf = require("@tensorflow/tfjs-node");
/*  */
/* package untuk request */
const { default: axios } = require("axios");
/*  */
/* package untuk face api untuk membuat gambar dari server jadi canvas */
const canvas = require("canvas");
/*  */
/* package agar bisa redirect dari backend */
const { Redirect } = require("react-router-dom");
/*  */
/* package untuk membaca file .env */
require("dotenv").config();
/*  */

/*  */


/* EXPRESS CONFIGURATION */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 2000;
const devEnv = process.env.NODE_ENV !== "production";
/*  */

/* FACE API */
const {REACT_APP_DEV_URL_sendmail,REACT_APP_PROD_URL} =process.env;
const MODEL_URL2=`${devEnv  ? REACT_APP_DEV_URL_sendmail : REACT_APP_PROD_URL}`+'/models/';
const MODEL_URL = `${__dirname}/public/models/`;
console.log(MODEL_URL)
const { Canvas, Image, ImageData } = canvas  
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })
async function run(pass,name,id,url) {
  const MODEL_URL2=`${devEnv  ? REACT_APP_DEV_URL_sendmail : REACT_APP_PROD_URL}`+'/customerPhoto/';
  const MODEL_URL = `${__dirname}/public/models/`;
  const {REACT_APP_DEV_URL,REACT_APP_PROD_URL,REACT_APP_DEV_URL_redirect,REACT_APP_PROD_URL_redirect} =process.env;
  console.log("load model loading")
  /* PENTING!!! MODEL INI DIGUNAKAN UNTUK PROCESS FACE API  */
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL)
      .then(faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL))
      .then(faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL))
  console.log("load model success")
  console.log("load image")
  const img = await canvas.loadImage(pass)
  const results = await faceapi.detectSingleFace(img)
      .withFaceLandmarks().withFaceDescriptor()
  console.log("success load model success")
     // const faceMatcher = new faceapi.FaceMatcher(results.descriptor);
      var resface;
      var value;
  for(i=1;i<=4;i++){
    const img2 = await canvas.loadImage(MODEL_URL2+`${name}_${i}.png`)
    const photo = await faceapi.detectSingleFace(img2)
    .withFaceLandmarks().withFaceDescriptor()
 
    if(photo.descriptor){
    const bestMatch = faceapi.euclideanDistance(results.descriptor, photo.descriptor)
    console.log("photo matcher")
    
    if(i==4){
      resface=MODEL_URL2+`${name}_${i}.png`
      console.log("masuk")
      updateprofile(resface,id,">0.5",url,name);
    }
    if(parseFloat(bestMatch.toString())<=0.4){
      resface=MODEL_URL2+`${name}_${i}.png`
      value=bestMatch.toString();
      console.log("photo match")
      updateprofile(resface,id,value,url,name);
      break
    }
    }
  }
  
}

/* Update profile customer */
async function updateprofile(resface,id,value,url,name){
  const {REACT_APP_DEV_URL,REACT_APP_PROD_URL,REACT_APP_DEV_URL_redirect,REACT_APP_PROD_URL_redirect} =process.env;
  await axios.patch(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer/${id}`,{         
        profile_picture:resface,
        value:value
    })
    console.log("done")
        
}

/* Nerima post req dari front end */
app.post("/validation",async (req,res)=>{
const image=req.body.image
const name=req.body.name
const id=req.body.id
const url=req.body.urlmail
await run(image,name,id,url)
const {REACT_APP_DEV_URL,REACT_APP_PROD_URL,REACT_APP_DEV_URL_redirect,REACT_APP_PROD_URL_redirect} =process.env;
res.header("Access-Control-Allow-Origin", "*");
res.send({job:"done"})
})
/*  */

/* MULTER STORE FILE */
/* store video */
const storageVideo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/customerVideo");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      path.parse(file.originalname.replace(/ /g,"_")).name +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

/* store pdf */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/customerPhoto/passport");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      path.parse(file.originalname.replace(/ /g,"_")).name +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
const uploadVideo = multer({ storage: storageVideo });
/*  */


/* SAVING VIDEO */
var param4="";
app.post(`/download2`, uploadVideo.single("video"), async(req, res) => {
  console.log(req.body.id)
  const id=req.body.id
  const name=req.body.name

 let finalImageURL =
    req.protocol + "://" + req.get("host") + "/customerVideo/" + req.file.filename;
    param4=finalImageURL
console.log('Saving Video Success')

console.log('Start SS')
    ffmpeg({ source: finalImageURL })
    .on('filenames', (filenames) => {
        console.log('Created file names', filenames);
       
        })
    .on('end', async() => {
  const devEnv=process.env.NODE_ENV !== "production";
  const {REACT_APP_DEV_URL,REACT_APP_PROD_URL} =process.env;

   axios.patch(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer/${id}`,{         
    videourl:param4,
    status:"Section 3"
})
  /* cropping face dari ss ffmpeg */
  for (let i = 1; i <=4; i++) {
    try {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Request-Method', '*');
      res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, DELETE, PUT');
      res.setHeader('Access-Control-Allow-Headers', '*');
      const filename=  req.protocol + "://" + req.get("host") + "/customerPhoto/" + `${name}_${i}.png`;
      let wait= await facecrop(filename, `./public/customerPhoto/${name}/${name}_final_${i}.jpg`, "image/jpeg", 1).then(res.send({check:"ok"}))   
    } catch (error) {
      console.log("Faces Not Found")      
    }
  }
    }
      )
    .on('error', (err) => {
        console.log('Error', err);
    })
    .takeScreenshots({
        filename: req.body.name,
        timemarks: [1,2,3,4,5]
    }, `public/customerPhoto`)
  console.log("ss berhasil")
  console.log("detect face")
  
})
/*  */

/* nerima req post /download dari frontend */
app.post(`/download`, upload.single("file"), async (req, res) => {
  const id=req.body.id
  const name=req.body.name
 /* MAKE NEW FOLDER */
  var dir = `public/customerPhoto/${name}`;
     if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    } 
    res.header("Access-Control-Allow-Origin", "*")
    console.log('Job done');
    res.send('/error')
    /* NAMA FILE PASSPORT */
    let finalImageURL =
    req.protocol + "://" + req.get("host") + `/customerPhoto/passport/` + req.file.filename;
    const devEnv=process.env.NODE_ENV !== "production";
    const {REACT_APP_DEV_URL,REACT_APP_PROD_URL} =process.env;
      await axios.patch(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer/${id}`,{         
          filename:finalImageURL,
          status:"Section 2"
      })     
});
/*  */

/* NODE MAILER UNTUK KIRIM EMAIL */
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
/*  */

/* Jalanin OCR */
app.post('/ocr',(req,res)=>{
  const image=req.body.image
  const worker = createWorker();
  const texter= ( async function() {
    console.log("Starting OCR")
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    try {
      const { data: { text } } = await worker.recognize(`${image}`);
      await worker.terminate();
      console.log("teks "+text)
      const namesFound = nr.find(text );
      console.log(namesFound)
      const countryName =countryFinder.detect(text);
      console.log(countryName)
      const dateFind= dateFinder(text)
      console.log(dateFind)
      console.log("done searching for name")
      res.header("Access-Control-Allow-Origin", "*")
      console.log('Job done');
      res.send({name:namesFound,country:countryName,date:dateFind})
    } catch (error) {
       console.log(error) 
    }
    })();  
})

/* check file yang di crop */
app.post('/checkfile',(req,res)=>{
      res.header("Access-Control-Allow-Origin", "*");
      const name=req.body.name
      var dir = `public/customerPhoto/${name}/`;
      console.log(dir);
      const length = fs.readdirSync(dir).length;
      console.log(length)
      if(length!==0){
        console.log("masuk")
      res.send({check:"ok"});
      }
      else{
      res.send({check:"Not Found"});
    }
  })
  /*  */


/* GABUNGIN EXPRESS SAMA JSON SERVER */
if (process.env.NODE_ENV === 'production') {
  
  app.use('/api', jsonServer.router('./db.json')) 
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));

  }); 
}
/*  */


app.use(cors())

app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});

