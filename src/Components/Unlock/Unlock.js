import React, {Component} from 'react';
import './Unlock.css'
import {Button, Box, Paper} from '@material-ui/core';
import UnlockIcon from '@material-ui/icons/LockOpen';
import BlueTooth from '@material-ui/icons/Bluetooth'
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import {BluetoothTerminal} from './../BluetoothTerminal.js';
import Home from './../Home/Home.js';


var randomWords = require('random-words');
const speechsdk = require('microsoft-cognitiveservices-speech-sdk');
var fs = require('fs');
var subscriptionKey = "4f03dc9750d14053af3fc32711aa6fce";
var serviceRegion = "westus";
var error;
const ticks_per_second = 10000000;



export default class Unlock extends React.Component{
	constructor(props) {
		super(props);
		this.passwordGenerator = this.passwordGenerator.bind(this);
		this.sttFromMic = this.sttFromMic.bind(this);
		this.verify = this.verify.bind(this);
		this.bluetoothTerminal = this.bluetoothTerminal.bind(this)
		this.state = {
			password: "",
			speech: "",
			device: ""
		}


	}

bluetoothTerminal(){
		let terminal = new BluetoothTerminal();
		terminal.connect().then(() => {
  console.log(terminal.getDeviceName() + ' is connected!');
   terminal.send('unlock');
});
	}

	 sttFromMic(terminal)   {
        const speechConfig = speechsdk.SpeechConfig.fromSubscription(subscriptionKey,serviceRegion);
        speechConfig.speechRecognitionLanguage = 'en-US';
        const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
        this.setState({
            displayText: 'speak into your microphone...',
            device: this.state.device
        });
        recognizer.recognizeOnceAsync(result => {
            let displayText;
            if (result.reason === ResultReason.RecognizedSpeech) {
                displayText = `${result.text}`
            } else {
                displayText = 'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.';
            }

            this.setState({
                speech: displayText,
                device: this.state.device
            });
        });

        this.verify();
    }

	passwordGenerator() {

		var devices = null;
		let terminal = new BluetoothTerminal();
		var password = randomWords({ exactly: 2, join: '' });
		var numbers = "0123456789";
		var max = numbers.length -1 ;

		for(var i = 0; i <3; i++) {
			var index = Math.floor(Math.random() * Math.floor(max))
			console.log(index)
			password +=numbers[index];
		}

		this.setState({
                password: password,
                device: this.state.device
            });
	
		for(var i = 0 ; i<ticks_per_second; i++);
		
		this.sttFromMic(terminal);
	}

	verify() {

		let terminal = new BluetoothTerminal();

		/*terminal.connect().then(() => {
			devices = terminal.getDeviceName();
			    this.setState({
            device: devices 
        });
  console.log(terminal.getDeviceName() + ' is connected!');
  });*/

		var devices = null;
		var str = this.state.speech;

		str = str.replace(/[^\w\s]|_/g, "")
         .replace(/\s+/g, " ");
         console.log(str)
        var lower = str.toLowerCase();
        var splits = lower.split(" ");
        console.log(splits);

        var passwords = "";
        for(var i = 0; i<splits.length;i++) {
        	passwords+=splits[i]

        }
        console.log(passwords);

        if(passwords === this.state.password){
		console.log('Password that was successful: ' +passwords)
       // alert("Verification successful!");
        if(passwords!="") {
        	 console.log("Door unlocked!");
 		   	this.bluetoothTerminal();
 		    alert("Door unlocked!");
        }

       }
	}

	render() {
		return (

				<div className = "welcome">
				<h1> Welcome Home!</h1>

				<Box  textAlign='center'  height ={1}>	
	
			<Button variant= 'contained' size = 'large' color = 'primary' className='button'
        startIcon={<UnlockIcon />}  style = {{bottom: -300, position: 'relative'}} onClick = {() => this.passwordGenerator()}> Tap to Unlock Door</Button>
        		<div className = "prompt">
       			<h3> Your one-time password: </h3>
       					<h4> {this.state.password}</h4>
       			</div>
       			<div className = "speech">
       				<h3> Speech recognized: </h3>
       				<h4>{this.state.speech}</h4>
       			</div>
			</Box>
				
				</div>

			)
	}

}