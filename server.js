const jsonServer = require('json-server');
jsonServer.create();
const express= require("express")
const cors= require('cors')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
var nr = require( 'name-recognition' );
var dateFinder =require ('datefinder')
var countryFinder=require ("country-in-text-detector")
const faceapi=require('face-api.js')
const path = require('path')
const fs = require("fs") 
const { createWorker, createScheduler } = require('tesseract.js');
const multer = require("multer");
const app = express();
const mailer=require('nodemailer');
const bodyParser=require('body-parser');
const facecrop = require('opencv-facecrop');
//const tf=require('@tensorflow/tfjs-node')
const { default: axios } = require('axios');
const canvas=require('canvas');
const { idali } = require('name-recognition/lib/femaleNames');
const { Redirect } = require('react-router-dom');
require('dotenv').config();

/* EXPRESS CONFIGURATION */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 2000;
const devEnv=process.env.NODE_ENV !== "production";
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
      updateprofile(resface,id,value,url,name);
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
async function updateprofile(resface,id,value,url,name){
  const {REACT_APP_DEV_URL,REACT_APP_PROD_URL,REACT_APP_DEV_URL_redirect,REACT_APP_PROD_URL_redirect} =process.env;
  await axios.patch(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer/${id}`,{         
        profile_picture:resface,
        value:value
    })
    console.log("done")
        
}
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

/* Check Face From Video */
app.post("/checkface",async (req,res)=>{
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL)
  .then(faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL))
  .then(faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL))
   console.log("Detect Human from Video")
  
    const MODEL_URL2=`${devEnv  ? REACT_APP_DEV_URL_sendmail : REACT_APP_PROD_URL}`+'/customerVideo/';
    const video=MODEL_URL2+`how-to-give-a-60-second-self-introduction-presentation_IqZA0A2H-1648935979501.mp4`
       const canvas = faceapi.createCanvas(video);
       const displaySize={width:video.width,height:video.height}
       faceapi.matchDimensions(canvas,displaySize)
       const photo = await faceapi.detectAllFaces(canvas)
      .withFaceLandmarks().withFaceDescriptors()
     console.log(photo)
    console.log("Done detecting")
   
    })
/*  */


/* MULTER STORE FILE */
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

var param3="";
var param4="";

var param_ss=""
var param_ss_id=""

/* Screenshot from video */
app.post('/screenshoot',(req,res)=>{
  const src=req.body.video
  param_ss_id=req.body.id
  ffmpeg({ source: src })
    .on('filenames', (filenames) => {
        console.log('Created file names', filenames);
        param_ss=filenames
        })
    .on('end', () => {
      updatescreenshoot();
      console.log('Job done');
        }
      )
    .on('error', (err) => {
        console.log('Error', err);
    })
    .takeScreenshots({
        filename: req.body.name,
        timemarks: [1,2,3,4,5]
    }, `public/customerPhoto`)
  
})
/*  */

/* Face Crop From Image */
app.post('/facecrop',(req,res)=>{
const img=req.body.image
const name=req.body.name
const id=req.body.id
 for (let i = 0; i <img.length; i++) {
  const filename=  req.protocol + "://" + req.get("host") + "/customerPhoto/" + req.body.image[i];
  console.log(req.protocol + "://" + req.get("host") + "/customerPhoto/" + req.body.image[i]);
  facecrop(filename, `./public/customerPhoto/${name}_final_${i}.jpg`, "image/jpeg", 1)
  .catch((error)=>console.log(error))
 }
 /* const passport=  req.protocol + "://" + req.get("host") + "/customerFile/" + req.body.filename; 
 console.log(passport) */
 facecrop(req.body.filename, `./public/customerPhoto/passport_${name}_final_.jpg`, "image/jpeg", 1)
  res.json({status:200})  
}
)

/* SAVING VIDEO */
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
    //updatescreenshoot();
  const devEnv=process.env.NODE_ENV !== "production";
  const {REACT_APP_DEV_URL,REACT_APP_PROD_URL} =process.env;

  await axios.patch(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer/${id}`,{         
    videourl:param4,
    status:"Section 3"
})

  for (let i = 1; i <=4; i++) {
    try {
      res.header("Access-Control-Allow-Origin", "*")
      res.redirect(req.originalUrl);
      const filename=  req.protocol + "://" + req.get("host") + "/customerPhoto/" + `${name}_${i}.png`;
      await facecrop(filename, `./public/customerPhoto/${name}/${name}_final_${i}.jpg`, "image/jpeg", 1)  
      
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
    
    
    
  // updatepdf(id,finalImageURL,res) 
    
});

async function updatepdf(id,image,res){
  const devEnv=process.env.NODE_ENV !== "production";
  const {REACT_APP_DEV_URL,REACT_APP_PROD_URL} =process.env;
    await axios.patch(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer/${id}`,{         
        filename:image,
        status:"Section 2"
    })         
}

const updatescreenshoot = async(e)=>{
  const devEnv=process.env.NODE_ENV !== "production";
  const {REACT_APP_DEV_URL,REACT_APP_PROD_URL} =process.env;
    await axios.patch(`${devEnv  ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/customer/${param_ss_id}`,{         
        imagearray:param_ss,
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
      console.log("done searching for name")
      res.header("Access-Control-Allow-Origin", "*")
      console.log('Job done');
      res.send({name:namesFound})
    } catch (error) {
     console.log(error) 
    }
    })();  
})

/*  */

/* CARI NAMA DARI TEXT OCR */
/* function getname(text){
  const namesFound = nr.find(text );
  return namesFound;
}
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

