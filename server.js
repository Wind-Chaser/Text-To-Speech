var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var fs=require('fs');
var app = express();
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('appName', 'Text-To-Speech');

app.set('port', process.env.PORT || 8080);
app.get('/',function(req,res){
res.sendFile(__dirname+'/HTML/login.html');
});
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/HTML'));
app.use(bodyParser.json());

app.post('/user',function(req,res){
  var data=req.body;
  console.log(data,"data");
  res.cookie('data',data).sendStatus(200);
});

app.get('/user',function(req,res){
  console.log(req.cookies.data);
  res.send(req.cookies.data);
});

app.get('/texttospeech',function(req,res){
  res.sendFile(__dirname+'/HTML/index.html');
});
app.post('/data',function(req,res){
var text_to_speech = new TextToSpeechV1({
  username: '306e7ea8-f4d9-47e8-b820-51925180d443',
  password: '6qZ7drysrAeM'
});
console.log(req.query.text,"false");
var params = {
  text: req.query.text,
  voice: 'en-US_AllisonVoice',
  accept: 'audio/wav'
};
text_to_speech.synthesize(params).on('error', function(error) {
  res.status(404).send(error);
}).pipe(fs.createWriteStream('output.wav'));
text_to_speech.synthesize(params).on('end',function(){
  res.sendStatus(200);
})

});
app.get('/:movieName',(req,res)=>{
const movieName =req.params.movieName;
console.log(movieName);
const movieFile=__dirname+"/"+movieName;
console.log(movieFile);
fs.stat(movieFile,(err,stats)=>{
  if(err){
     console.log("error stats");
     return res.status(404).end('<h1>Movie Not found</h1>');
}
const size=stats.size;
const range=req.headers.range;
const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
const end=size-1;
const chunkSize=(end-start)+1;
console.log(range,chunkSize);
     var obj={
       'Content-Range': `bytes ${start}-${end}/${size}`,
       'Accept-Ranges': 'bytes',
       'Content-Length': chunkSize,
       'Content-Type': 'audio/wav'
     };
res.set(obj);
console.log(obj);
res.status(206);
const stream=fs.createReadStream(movieFile,{start,end});
stream.on('open',()=> stream.pipe(res));
stream.on('error',(streamErr)=>res.end(streamErr));
});
});

http.createServer(app).listen(app.get('port'),
    function(req, res) {
        console.log(app.get('appName')+' is listening on port: ' + app.get('port'));
});
