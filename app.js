
const modelParams = {
    flipHorizontal: true,   // flip e.g for video
    imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
    maxNumBoxes: 1,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.83    // confidence threshold for predictions.
};

navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

const video = document.querySelector('#video');
const audio = document.querySelector('#audio');

let model;

function runDetection() {
    if (model && model.detect) {
        model.detect(video).then(prediction => {
            if (prediction.length !== 0) {
                let hand1 = prediction[0].bbox;
                let x = hand1[0];
                let y = hand1[1];
                console.log(x);
                if (y > 300) {
                    if (x < 200) {
                        audio.src = 'drum1.mp3'
                    } else if (x > 400) {
                        audio.src = 'drum2.mp3'
                    } else if (x > 300) {
                        audio.src = 'drum3.mp3'
                    } else if (x > 200) {
                        audio.src = 'drum4.mp3'
                    }
                }
                // play the sound
                audio.play()
            }
        })
    }
}

handTrack.load(modelParams)
    .then(lModel => {
        model = lModel;
    })
    .catch(error => {
        console.log(error);
    });

handTrack.startVideo(video).then(status => {
    if (status) {
        navigator.getUserMedia({ video: {}}, stream => {
            video.srcObject = stream;
            // run our detection
            setInterval(runDetection, 300);
        }, error => {
            console.log(error);
        })
    }
});