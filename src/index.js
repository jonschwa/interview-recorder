import axios from "axios"
import {RecordRTCPromisesHandler} from "recordrtc"

console.log(process.env.APIG_ID)
const audio = document.querySelector('audio');
var answer

async function stopRecordingCallback() {
    audio.srcObject = null;
    
    // unmute the audio input
    audio.muted = false

    let blob = await recorder.getBlob();
    answer = blob

    audio.src = URL.createObjectURL(blob);
    audio.pause()

    recorder.stream.getTracks(t => t.stop());

    // reset recorder's state
    await recorder.reset();

    // clear the memory
    await recorder.destroy();

    // so that we can record again
    recorder = null;

    // enable the upload button
    document.getElementById('btn-upload-answer').disabled = false;

}

async function uploadBlob(blob) {
    const test = await axios.post(`https://522e8276014654c8af66a78cf62b182a.m.pipedream.net`, blob, {
        headers: { "content-type": "audio/webm", "Accept":"audio/webm"},
      }
    )

    
    const response = await axios.post(`http://localhost:45660/restapis/${process.env.APIG_ID}/test/_user_request_/question_answer_1`, blob, {
        headers: { "content-type": "audio/webm", "Accept":"audio/webm" },
      }
    )
    console.log(response);
}

let recorder; // globally accessible

document.getElementById('btn-start-recording').onclick = async function() {
    this.disabled = true;
    let stream = await navigator.mediaDevices.getUserMedia({audio: {echoCancellation: false}});
    audio.muted = true
    audio.srcObject = stream;
    recorder = new RecordRTCPromisesHandler(stream, {
        type: 'audio',
        numberOfAudioChannels: 2, //@todo  - browser things
        checkForInactiveTracks: true,
        bufferSize: 16384
    });
    await recorder.startRecording();
    
    // helps releasing camera on stopRecording
    recorder.stream = stream;

    document.getElementById('btn-stop-recording').disabled = false;

    // if you want to access internal recorder
    const internalRecorder = await recorder.getInternalRecorder();
    console.log('internal-recorder', internalRecorder.name);

    // if you want to read recorder's state
    console.log('recorder state: ', await recorder.getState());
};

document.getElementById('btn-stop-recording').onclick = async function() {
    this.disabled = true;
    await recorder.stopRecording();
    stopRecordingCallback();
    document.getElementById('btn-start-recording').disabled = false;
};

document.getElementById('btn-upload-answer').onclick = async function() {
    //this.disabled = true;
    uploadBlob(answer)
};