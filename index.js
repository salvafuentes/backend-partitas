/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");
const http = require("http");
const multer = require("multer");
const needle = require("needle");
var request = require("request");

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "9000";

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

app.get("/user", (req, res) => {
    http.get('http://127.0.0.1:8000/partitas', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        pdf = JSON.parse(data)[0];
        console.log(JSON.parse(data));
        res.download(pdf);
        //res.render("user", { title: "a", userProfile: { nickname: pdf } });
    });

    }).on("error", (err) => {
    console.log("Error: " + err.message);
    });
    
  });

var jsonDataObj = {'path': 'C:/Users/salva/Desktop/whatabyte-portal/uploads/hb.mid'};

app.get("/test1", (req, res) => {
    request.post({
        url:     'http://127.0.0.1:8000/partitas',
        body:    jsonDataObj,
        json:   true
      }, function(error, response, body){
        //res.download(body[0])
        console.log(body);
      });

    res.download('C:/Users/salva/Desktop/whatabyte-portal/uploads/hb.mid')
    res.render("test1", { title: "Home" });
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
  
        // Uploads is the Upload_folder_name
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
    
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb){
    
        // Set the filetypes, it is optional
        var filetypes = /mid/;
        var mimetype = filetypes.test(file.mimetype);
  
        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());

        console.log(path.dirname(file.originalname));
        
        if (mimetype && extname) {
            return cb(null, true);
        }
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
      } 
  
// mypic is the name of file attribute
}).single("mypic");

app.get("/uploader", (req, res) => {
    res.render("uploader", { title: "Home" });
});

const data1 = {
    path: 'C:/Users/salva/Desktop/whatabyte-portal/uploads/hb.mid'
};

app.get("/test", (req, res) => {
    needle('post', 'http://127.0.0.1:8000/partitas', data1, {json: true})
    .then((res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log('Body: ', res.body[0]);
    }).catch((err) => {
        console.error(err);
    });
    res.render("test", { title: "Home" });
});
    
app.post("/uploadProfilePicture",function (req, res, next) {
        
    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    upload(req,res,function(err) {
  
        if(err) {
  
            // ERROR occurred (here it can be occurred due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            res.send(err)
        }
        else {
  
            // SUCCESS, image successfully uploaded
            res.send("Success, Image uploaded!")
        }
    })
})
/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});