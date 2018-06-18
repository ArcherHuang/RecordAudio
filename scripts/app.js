// set up basic variables for app

var uploadAPI = 'https://59.120.157.118:5000/api/v1.0/uploadFile'

var record = document.querySelector('.record');
var stop = document.querySelector('.stop');
var soundClips = document.querySelector('.sound-clips');
var canvas = document.querySelector('.visualizer');
var mainSection = document.querySelector('.main-controls');

// disable stop button while not recording

stop.disabled = true;

// visualiser setup - create web audio api context and canvas

var audioCtx = new (window.AudioContext || webkitAudioContext)();
var canvasCtx = canvas.getContext("2d");

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  var constraints = { audio: true };
  var chunks = [];

  var onSuccess = function(stream) {
    var mediaRecorder = new MediaRecorder(stream);

    visualize(stream);

    record.onclick = function() {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");
      record.style.background = "red";

      stop.disabled = false;
      record.disabled = true;
    }

    stop.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();

      stop.disabled = true;
      record.disabled = false;
    }

    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      // var clipName = prompt('Enter a name for your sound clip?','My unnamed clip');
      // var clipName = _uuid();

      // console.log(clipName);

      var clipContainer = document.createElement('article');
      var clipLabel = document.createElement('p');
      var audio = document.createElement('audio');
      var deleteButton = document.createElement('button');
      var uploadButton = document.createElement('button');
      // var node = document.createElement("input");

      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';

      uploadButton.textContent = 'Upload';
      uploadButton.className = 'upload';

      // if(clipName === null) {
      //   clipLabel.textContent = 'My unnamed clip';
      // } else {
      //   clipLabel.textContent = clipName;
      // }

      clipContainer.appendChild(audio);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      clipContainer.appendChild(uploadButton);
      soundClips.appendChild(clipContainer);

      audio.controls = true;
      // audio.controlsList = "nodownload";
      var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
      chunks = [];
      var audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log("recorder stopped"+ audioURL);

      deleteButton.onclick = function(e) {
        evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }

      uploadButton.onclick = function(e) {
        console.log("Upload: "+ audioURL);
        console.log(e);

        var ss = audioURL.split("/");
        // for (var i in ss) {
        //   console.log(ss[i]);
        // }
        // var fileName = ss[3] + '.ogg'
        // console.log("fileName: " + fileName);

        // var a = document.createElement('a');
        // document.body.appendChild(a);
        // a.style = 'display: none';
        // a.href = audioURL;
        // a.download = "fileName";
        // a.click();

        // var xhr = new XMLHttpRequest();
        // xhr.open('GET', 'https://59.120.157.118:5000/test');
        // xhr.onload = function(e) {
        //   // var data = JSON.parse(this.response);
        //   console.log("Get API:" + this.response);
        // }
        // xhr.send();

        // var xhr1 = new XMLHttpRequest();
        // xhr1.open('GET', audioURL, true);
        // xhr1.responseType = 'blob';
        // xhr1.onload = function(e) {
        //   if (this.status == 200) {
        //     var myBlob = this.response;
        //     // myBlob is now the blob that the object URL pointed to.
        //     console.log("Get Blob");
        //     const data = new Blob(audioURL);
        //     var xhr = new XMLHttpRequest();
        //     var formData = new FormData()
        //     form.append("blob",blob, filename);
        //     formData.append('audioFile', myBlob);
        //     xhr.open('POST', uploadAPI, true);
        //     xhr.responseType = 'text';
        //     xhr.onload = function(e) {
        //     if (this.status == 200) {
        //       console.log(this.response);
        //     }

        //   };
        //   xhr.send(formData);
        //   }
        // };
        // xhr1.send();

        // node.name = "file"
        // const data = new Blob(audioURL);

        // var x = document.createElement("INPUT");
        // x.setAttribute("type", "file");
        // x.setAttribute("name", "file");

        var xhr = new XMLHttpRequest();

        // formData.append('name', _uuid() + ".ogg");
        // formData.append("myFile", document.getElementById("myFileField").files[0]);
        // formData.append('audioFile', data);

        var data1 = "drunknight";
        var blob1 = new Blob([data1]);

        var formData = new FormData()
        formData.append('file', blob1, fileName);
        xhr.open('POST', uploadAPI, true);
        // xhr.responseType = 'text';
        // xhr.setRequestHeader( 'Content-Type', 'multipart/form-data' );
        // xhr.setRequestHeader( 'Content-Type', 'application/octet-stream' );
        xhr.onload = function(e) {
          if (this.status == 200) {
            console.log(this.response);
          }

        };
        // xhr.send(e.target.result);
        xhr.send(formData);

        alert("Will Upload to Server.");
      }

      // clipLabel.onclick = function() {
      //   var existingName = clipLabel.textContent;
      //   var newClipName = prompt('Enter a new name for your sound clip?');
      //   if(newClipName === null) {
      //     clipLabel.textContent = existingName;
      //   } else {
      //     clipLabel.textContent = newClipName;
      //   }
      // }
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

  var onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}

function visualize(stream) {
  var source = audioCtx.createMediaStreamSource(stream);

  var analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  draw()

  function draw() {
    WIDTH = canvas.width
    HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;


    for(var i = 0; i < bufferLength; i++) {
 
      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();

  }
}

function _uuid() {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();