import React from 'react';
import {Button, Box, Paper} from '@material-ui/core';
import './Lock.css';
import LockIcon from '@material-ui/icons/Lock';
import Home from './../Home/Home.js';
import {BluetoothTerminal} from './../BluetoothTerminal.js';
//var Homes = new Home();


export default class Lock extends React.Component {

	constructor(props) {
		super(props);


	}

	bluetoothTerminal(){
		
		let terminal = new BluetoothTerminal();
		terminal.connect().then(() => {
  console.log(terminal.getDeviceName() + ' is connected!');
  
  terminal.send('lock');
  alert("Door locked!");

});
	}

	lockDoor() {

		let options = {
			acceptAllDevices: true,
			 optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e',
	  0xFFE0
	  ]
		}

		navigator.bluetooth.requestDevice(options)
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService("6e400001-b5a3-f393-­e0a9-­e50e24dcca9e"))
.then(service => service.getCharacteristic('6e400002-b5a3-f393-­e0a9-­e50e24dcca9e'))
.then(characteristic => {
  return characteristic.writeValue("locked");
})
.then(_ => {
  console.log('Door has been locked!');
})
.catch(error => { console.error(error); });
	}


		render() {
	return (	
			<div className='background'>	
			<Box  textAlign='center'  height ={1}>			
			<Button variant= 'contained' size = 'large' color = 'primary' className='button'
        startIcon={<LockIcon />}  style = {{bottom: -400, position: 'relative'}} onClick = {() => this.bluetoothTerminal()}> Tap to Lock Door</Button>
       
			</Box>
			</div>
	)
}

}

