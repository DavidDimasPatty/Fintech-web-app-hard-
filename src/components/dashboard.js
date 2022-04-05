import React from "react";
import {ReactSession} from "react-client-session";
import {NavLink} from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import "./dashboard.css";

function logout() {
  ReactSession.set("login", "false");
}

const Dashboard = ({collapsed, toggled, handleToggleSidebar}) => {

  return (

  <div className="sidebarMenu">

    <section className="main-content columns is-fullheight">

      <aside className="column is-narrow-mobile is-fullheight section is-hidden-mobile">
        
        <p className="menu-label is-hidden-touch">Navigation</p>

        <ul className="menu-list">
          <li><NavLink to="/home" activeClassName="active">Home</NavLink></li>
          <li><NavLink to="/customers" activeClassName="active">Customer List</NavLink></li>
          <li><NavLink to="/onboard" activeClassName="active">Onboard Customer</NavLink></li>
          <li><NavLink to="/" onClick={logout} activeClassName="">Log Out</NavLink></li>
        </ul>

      </aside>

    </section>

  </div>

  )

}

export default Dashboard;