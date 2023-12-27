const video = document.getElementById('video');
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const canvas3 = document.getElementById('canvas3');
const snap = document.getElementById('snap');
const startStop = document.getElementById('startStop');
const context1 = canvas1.getContext('2d');
const context2 = canvas2.getContext('2d');
const context3 = canvas3.getContext('2d');
let snapIndex = 0;
let streamActive = false;

snap.addEventListener('click', function () {
  let canvas = [canvas1, canvas2, canvas3][snapIndex];
  let context = canvas.getContext('2d');
  let scale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
  let x = (canvas.width / 2) - (video.videoWidth / 2) * scale;
  let y = (canvas.height / 2) - (video.videoHeight / 2) * scale;
  context.drawImage(video, x, y, video.videoWidth * scale, video.videoHeight * scale);
  snapIndex = (snapIndex + 1) % 3;

});

startStop.addEventListener('click', function () {
  if (streamActive) {
    video.srcObject.getTracks().forEach(track => track.stop());
    startStop.textContent = 'Start Video';
    streamActive = false;
  } else {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
        startStop.textContent = 'Stop Video';
        streamActive = true;
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
      });
  }
});


//   verify

var veri = document.getElementById('verify');

veri.addEventListener('click', function () {

  let img1 = canvas1.toDataURL('image/png');
  let img2 = canvas2.toDataURL('image/png');
  let img3 = canvas3.toDataURL('image/png');
  fetch('/face_verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      images: [img1, img2, img3]
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.result) {
        alert('Xác thực thành công');
        // relocation to home page
        window.location.href = "/";
      } else {
        alert('Xác thực thất bại');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });



});