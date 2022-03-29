import React, { useEffect, useState } from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import { ProSidebar, Menu, MenuItem, SubMenu,SidebarContent,SidebarFooter } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import './dashboard.css'
import { NavLink } from 'react-router-dom';

import { ReactSession } from 'react-client-session';

function logout() {
  ReactSession.set("login", "false");
}

const Dashboard = ({  collapsed, toggled, handleToggleSidebar }) => {
   
  
    return (

<div id="app" >   
<section class="main-content columns is-fullheight ">

  <aside class="column is-narrow-mobile is-fullheight section is-hidden-mobile pr-4">

    <p class="menu-label is-hidden-touch">Navigation</p>
    <ul class="menu-list">
      <li>
      <NavLink to="/home" activeClassName="active">
        Home</NavLink>
      </li>
      <li>
      <NavLink to="/customers" activeClassName="active">
        Customer List</NavLink>
      </li>
    

      <li>
      <NavLink to="/onboard" activeClassName="active">
        Onboard Customer</NavLink>
      </li>
      
      <li>
      <NavLink to="/" onClick={logout} activeClassName="">
        Log Out</NavLink>
      
      </li>
    </ul>

  </aside>
  </section>
  </div>
  
  )
}

export default Dashboard
