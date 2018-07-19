function Submit ()
{
 var text=document.getElementById('speech').value;
 console.log(text);
 if(text){
  var request = new XMLHttpRequest();
  request.open('POST','/data?text='+text);
  request.addEventListener('load',function (){
        if(request.status===200)
        {
          console.log("done");
          var req = new XMLHttpRequest();
          req.open('GET', 'output.wav', true);
          req.responseType = 'blob';
          req.onload = function() {
             if (this.status === 206) {
               console.log("okay");
                var audioBlob = this.response;
                var aid = URL.createObjectURL(audioBlob);
                console.log(aid);
                var audioelement = document.getElementById('myAudioElement') || new Audio();
                audioelement.setAttribute('type','audio/wav');
                audioelement.setAttribute('src',aid);
                document.getElementById('hidden').style="display:block";
                audioelement.onload = function() {
                    URL.revokeObjectUrl(aid);
                  };
                audioelement.play();
              }
            }
          req.send();
        }
        else{
          console.log("error");
          document.getElementById('error').innerHTML="Error in  Data Handling";
        }
  });
}
request.send();
}
var request1 = new XMLHttpRequest();
request1.open('GET','/user');
request1.send();
request1.addEventListener('load',function (){
      if(request1.status===200)
      {
            console.log("sign");
            var data=JSON.parse(request1.responseText);
          document.getElementById("pic").setAttribute("src",data.profilepic);
          document.getElementById("name").innerHTML=data.name;
      }
});
