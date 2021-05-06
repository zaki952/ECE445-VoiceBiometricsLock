import React , {useState} from 'react'
import { Link } from 'react-router-dom'
import {FaBars,FaTimes, FaReact} from 'react-icons/fa'
import {NavBarData} from './NavbarData'
import './Navbar.css'

const Navbar = () => {
	return (
		<>
		<div className = "navigation">
				<div className ="title">
			<h1> Voice Biometrics Lock</h1>
					</div>
			
		<nav className = {'nav-menu'}>
		<ul className = 'nav-menu-items'>
		<li className = 'navbar-toggle'>
		
		
			</li>
			{NavBarData.map((item,index) => {
				
				return (
					<li key = {index} className = {item.cName}>
						<Link to = {item.path}>
						{item.icon}
						<span>{item.title}</span>
						</Link>
						</li>
					); 
			})}

			</ul>
		</nav>
		</div>
		</>
	
	)
}

export default Navbar;