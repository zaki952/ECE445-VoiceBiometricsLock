import React ,{Component} from 'react';
import './Setup.css';
import { Typography, IconButton } from '@material-ui/core';
import MicIcon from '@material-ui/icons/Mic';
import {getTokenOrRefresh} from './token_util';
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';

const speechsdk = require('microsoft-cognitiveservices-speech-sdk');
var fs = require('fs');
var subscriptionKey = "4f03dc9750d14053af3fc32711aa6fce";
var serviceRegion = "westus";
var error;
const ticks_per_second = 10000000;



export default class Setup extends Component{

	   constructor(props) {
        super(props);
        this.sttFromMic = this.sttFromMic.bind(this);
        this.AddEnrollmentsToTextIndependentProfile = this.AddEnrollmentsToTextIndependentProfile.bind(this);
        this.record = this.record.bind(this);
        this.GetAudioConfigFromFile = this.GetAudioConfigFromFile.bind(this);
        this.getAudio = this.getAudio.bind(this);
        this.state = {
            displayText: 'INITIALIZED: ready to test speech...',
            error:'No error!'
        }

        console.log(this.state.displayText);
    }

 GetAudioConfigFromFile (blob)
{       
   
    let pushStream = speechsdk.AudioInputStream.createPushStream();
    var  byteArr = [];
    blob.arrayBuffer().then(buffer => { 
            let view = new Int8Array(buffer);
            for(var i = 0 ; i < buffer.byteLength; i++) 
            {
                byteArr.push(view[i]);
            }
           console.log(byteArr);
            pushStream.write(byteArr);
    });


    console.log("Got AudioConfig");
    return speechsdk.AudioConfig.fromStreamInput(pushStream);
  //return speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    }


 record() {
    
    console.log("Called record");
    navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream =>  {
    this.getAudio(stream);
})
    


}

  getAudio(stream) {
    var audioBlob = null;
    console.log("hello");
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    const audioChunks = [];
 
    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
      console.log(event.data);
    });

    mediaRecorder.addEventListener("stop", async () => {
       audioBlob = new Blob(audioChunks);
      console.log(audioBlob);
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log(audioUrl);
      const audio = new Audio(audioUrl);
      audio.play();
      let file = new File([audioBlob], 'audio.wav', {
  type: 'audio/wav',
  lastModified: Date.now(),
})
      console.log(file);
   //await this.AddEnrollmentsToTextIndependentProfile(audioBlob);    
    });

    setTimeout(() => {
      mediaRecorder.stop();
    }, 25000);

}

async AddEnrollmentsToTextIndependentProfile(file)

{       console.log(file);
        var profile = null;
        const profile_locale = "en-us";
        console.log ("Adding enrollment to text independent profile...");
        const speechConfig = speechsdk.SpeechConfig.fromSubscription(subscriptionKey,serviceRegion);
        speechConfig.speechRecognitionLanguage = 'en-US';
        const client = new speechsdk.VoiceProfileClient(speechConfig);
        const audio_config = this.GetAudioConfigFromFile(file);
        profile = await new Promise ((resolve, reject) => {
            client.createProfileAsync (speechsdk.VoiceProfileType.TextIndependentIdentification, profile_locale, result => { resolve(result); }, error => { reject(error); });
        });
        console.log ("Created profile ID: " + profile.profileId);
        const result = await new Promise ((resolve, reject) => {
            client.enrollProfileAsync (profile, audio_config, result => { resolve(result); }, error => { reject(error); });

        });
        console.log("Got result");
        if (result.reason === speechsdk.ResultReason.Canceled) {
            throw(JSON.stringify(speechsdk.VoiceProfileEnrollmentCancellationDetails.fromResult(result)));
        }
        else {
            console.log ("Remaining audio time needed: " + (result.privDetails["remainingEnrollmentsSpeechLength"] / ticks_per_second) + " seconds.");
        }
    
    console.log ("Enrollment completed.\n");
    alert("Enrollment successful!");
}
	
	  sttFromMic()   {
        const speechConfig = speechsdk.SpeechConfig.fromSubscription(subscriptionKey,serviceRegion);
        speechConfig.speechRecognitionLanguage = 'en-US';
        const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
        this.setState({
            displayText: 'speak into your microphone...'
        });
        recognizer.recognizeOnceAsync(result => {
            let displayText;
            if (result.reason === ResultReason.RecognizedSpeech) {
                displayText = `${result.text}`
            } else {
                displayText = 'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.';
            }

            this.setState({
                displayText: displayText
            });
        });
    }
	
	render() {

		return (

		<div className = "titles">
			<h1> Welcome to Setup!</h1>
			<Typography variant ="h4" className= "message">
				Please tap the microphone button and speak for at least 20 seconds to 
				register your voice and make yourself authenticated.
				</Typography>

				<IconButton style = {{bottom: -400, position: 'relative' , minHeight: 100, minWidth:100}} onClick = {() => this.record()}>
				 <MicIcon style ={{minHeight: 100, minWidth:100}}/>
				 </IconButton>
				
				<Typography variant ="h4" className= "translated">
						{this.state.displayText}
				</Typography>

					<div className = "screen"></div>

			</div>

)


	}
}



