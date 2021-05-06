import React from 'react'
import * as AiIcons from 'react-icons/ai'
import * as FaIcons from 'react-icons/fa'
import * as IoIcons from 'react-icons/io'

export const NavBarData = [
{
	title: 'Home',
	path: '/',
	icon: <FaIcons.FaHome/>,
	cName: 'nav-text'
}, 

{
	title: 'Setup',
	path: '/setup',
	icon: <AiIcons.AiFillSetting/>,
	cName: 'nav-text'
}, 

{
	title: 'Lock',
	path: '/lock',
	icon: <AiIcons.AiFillLock/>,
	cName: 'nav-text'
}, 

{
	title: 'Unlock',
	path: '/unlock',
	icon: <AiIcons.AiFillUnlock/>,
	cName: 'nav-text'
}
]