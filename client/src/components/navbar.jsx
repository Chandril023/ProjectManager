import './navbar.css'
import { Link } from 'react-router-dom';
export default function Navbar(){
 return(<div className="parent">
  <div className="nav1-layout">
  <div className="Logo">
  <img className="logo1" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1rbGB7G3BrogowjjZ6LS_v3m4IJ9H-CU214tJTVceLw&s" alt="logo1"/>
  </div>
  <div className="nav1" id="blur">
  <ul className="menu-bar">
  <li >Home</li>
  <li>Users</li>
  <li>Teams</li>
  <li><Link to='/myprofile'>Profile</Link></li>
  <li>Inbox</li>
  <li>Logout</li>
  </ul>
  </div>
  </div>
  </div>);
}