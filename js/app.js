
// element define

const selectAudioSource = document.getElementById('audio-source');
const selectVideoSource = document.getElementById('video-source');
const videoElement = document.getElementById('video-element');
const audioElement = document.getElementById('audio-element');

// button
const startVideoButton = document.querySelector('.js-start-video');
const stopVideoButton = document.querySelector('.js-stop-video');
const startAudioButton = document.querySelector('.js-start-audio');
const stopAudioButton = document.querySelector('.js-stop-audio');


let recorder = {};


window.onload = () => {
    navigator.mediaDevices.enumerateDevices()
        .then((deviceInfos) => {
            for (let i = 0; i !== deviceInfos.length; ++i) {
                const deviceInfo = deviceInfos[i];
                const option = document.createElement('option');
                option.value = deviceInfo.deviceId;
                if (deviceInfo.kind === 'audioinput') {
                    option.text = deviceInfo.label || 'microphone ' + (selectAudioSource.length + 1);
                    selectAudioSource.appendChild(option);
                } else if (deviceInfo.kind === 'videoinput') {

                    option.text = deviceInfo.label || 'camera ' +(selectVideoSource.length + 1);
                    selectVideoSource.appendChild(option);
                } else {
                    console.log('Found another kind of device: ', deviceInfo);
                }
            }
        })
}


startAudioButton.addEventListener('click', (e) => {
   // e.currentTarget.classList.add('active');
    //stopAudioButton.removeAttribute('disabled','disabled')
    startRecording({ type: 'audio' , event: e});
})
stopAudioButton.addEventListener('click', (e) => {
    startAudioButton.classList.remove('active');
    stopAudioButton.setAttribute('disabled','disabled')
    recorder.stop();
});
startVideoButton.addEventListener('click', (e) => {
    //e.currentTarget.classList.add('active');
    //stopVideoButton.removeAttribute('disabled','disabled')
    startRecording({ type: 'video', event: e});
})
stopVideoButton.addEventListener('click', (e) => {
    startVideoButton.classList.remove('active');
    stopVideoButton.setAttribute('disabled','disabled')
    recorder.stop();
});

function startRecording({ type ,event}) {
    const constraints = {
        [type]: {
            deviceId: { exact: type =='audio' ? selectAudioSource.value : selectVideoSource.value }
        }
    };
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            const chunks = [];
            recorder = new MediaRecorder(stream);
            recorder.start();
            recorder.addEventListener("dataavailable", event => {
                chunks.push(event.data);
            });
            event.target.classList.add('active');
            if (type === 'audio'){
                stopAudioButton.removeAttribute('disabled','disabled');
            }
            else if (type === 'video'){
               stopVideoButton.removeAttribute('disabled','disabled')
            }
            recorder.addEventListener("stop", () => {
                const blob = new Blob(chunks);
                const url = URL.createObjectURL(blob);
               
                if (type === 'audio'){
                    audioElement.src = url;
                }
                else if (type === 'video'){
                    videoElement.src = url;
                }
            });
            

        })
        .catch((error)=> {
            console.error('Error: ', error);
            alert(error.message);
        });
}