
// element define

const selectMediaSource = document.getElementById('media-source');
const videoElement = document.getElementById('video-element');
const audioElement = document.getElementById('audio-element');

// button
const startVideoButton = document.querySelector('.js-start-video');
const stopVideoButton = document.querySelector('.js-stop-video');
const startAudioButton = document.querySelector('.js-start-audio');
const stopAudioButton = document.querySelector('.js-stop-audio');


let recorder = {};


window.onload = ()=> {
    navigator.mediaDevices.enumerateDevices()
            .then((deviceInfos) => {
                for (let i = 0; i !== deviceInfos.length; ++i) {
                    const deviceInfo = deviceInfos[i];
                    const option = document.createElement('option');
                    option.value = deviceInfo.deviceId;
                    if (deviceInfo.kind === 'audioinput') {
                        option.text = deviceInfo.label ||
                            'microphone ' + (selectMediaSource.length + 1);
                            selectMediaSource.appendChild(option);
                        // } else if (deviceInfo.kind === 'videoinput') {
                        //     option.text = deviceInfo.label || 'camera ' +
                        //         (videoSelect.length + 1);
                        //     videoSelect.appendChild(option);
                    } else {
                        console.log('Found another kind of device: ', deviceInfo);
                    }
                }
            })
}


startAudioButton.addEventListener('click', (e)=>{
    startRecording({type: 'audio'});
})
stopAudioButton.addEventListener('click', (e) => {
    recorder.stop();
});

function startRecording({type}){
                const constraints = {   
                    [type]: {
                        deviceId: { exact: selectMediaSource.value }
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

                        recorder.addEventListener("stop", () => {
                            const blob = new Blob(chunks);
                            const url = URL.createObjectURL(blob);
                            if (type === 'audio')
                                audioElement.src = url;
                            else if(type==='video')
                                videoElement.src = url;
                        });

                    })
                    .catch(handleError);
}

function handleError(error) {
    console.error('Error: ', error);
}