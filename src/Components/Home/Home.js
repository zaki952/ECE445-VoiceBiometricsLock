import React, {Component} from 'react'
import './Home.css'
import locked from './thread-lock.jpeg'
import unlocked from './locked.png'
import {Button, Box, Paper} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import {BluetoothTerminal} from './../BluetoothTerminal.js';
import Lock from './../Lock/Lock.js';
import Unlock from './../Unlock/Unlock.js';

export default class Home extends Component {
	constructor(props) {
		super(props);
		const me = this;
		this.handleLock= this.handleLock.bind(this);
		this.state = {
			locked :true
		}
		

	}

	changeStatus (status) {
		this.setState({locked:status})
	}

	handleLock(){
		console.log("Handle Lock Called!");
	var statusRead = null;
	var newLocked = null;
	let terminal = new BluetoothTerminal();
	terminal.connect().then(() => {
  console.log(terminal.getDeviceName() + ' is connected!');
  statusRead = terminal.read();
});
		if(statusRead == "locked" || statusRead == "lock") {
				newLocked = true;
		}
		else if(statusRead == "unlock") {
			newLocked = false;
		}
			this.setState({
            locked : newLocked
        });
		console.log(this.state);		
	}

	render() {
		if(!this.state) { return(null)
			//return(<Lock data = {{changeStatus: this.changeStatus.bind(this)}}/>)
		}

		if(this.state.locked == false) {
			console.log("false render");

				return (

		<div className = "welcome">
				<h1> Current Lock Status: </h1>
				<img src={unlocked} className = 'photo' alt = "Logo"/>
				<h2 style = {{color:'green', fontSize:'48px'}}> Unlocked</h2>
					<Button variant= 'contained' size = 'large' color = 'primary' className='button'
        startIcon={<RefreshIcon />}  style = {{bottom: -100, position: 'relative'}} onClick = {() => this.handleLock()}> Tap to Refresh Lock Status</Button>
				</div>
		

	)
		}

	else if(this.state.locked == true) {
			console.log("true render");

	return (

		<div className = "welcome">
				<h1> Current Lock Status: </h1>
				<img src={locked} className = 'photo' alt = "Logo"/>
				<h2 style = {{color:'red', fontSize: '48px'}}> Locked</h2>
						<Button variant= 'contained' size = 'large' color = 'primary' className='button'
        startIcon={<RefreshIcon />}  style = {{bottom: -100, position: 'relative'}} onClick = {() => this.handleLock()}> Tap to Refresh Lock Status</Button>
				</div>
		

	)
}

	else {
		return (
							<Button variant= 'contained' size = 'large' color = 'primary' className='button'
        startIcon={<RefreshIcon />}  style = {{bottom: -300, right: -700, position: 'relative'}} onClick = {() => this.handleLock()}> Tap to Fetch Lock Status</Button>

			)
	}

}

}