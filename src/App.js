import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import Login from "./components/login"
import AddUser from "./components/signup"
import Dashboard from "./components/dashboard"
import Home from "./components/home"
import CustomerList from "./components/customerList"
import Profile from "./components/profile"
import Onboard from "./components/onboard"
import Mail from "./components/survey"
import Mail2 from "./components/survey2"
import Mail3 from "./components/survey3"
import CompleteSurvey from "./components/complete_survey"
import "./components/app.css"

import { ReactSession } from 'react-client-session';
function App() {

  ReactSession.setStoreType("sessionStorage");
  return (
    <Router >
          <Switch>
           <Route exact path="/">
                <Login />
            </Route>
            <Route exact path="/signup">
              
                <AddUser />
            </Route>
            <Route exact path="/home">
            <div className="baris">
            <Dashboard />
                 <Home />
                 </div>
            </Route>
            <Route exact path="/customers">
                <div className="baris">
                <Dashboard />
                 <CustomerList />
                 </div>
            </Route>

            <Route exact path="/customers/:id">
                <body className="baris">
                <Dashboard />
                 <Profile />
                 </body>
            </Route>

            <Route exact path="/onboard">
                <body className="baris">
                <Dashboard />
                 <Onboard />
                 </body>
            </Route>

            <Route exact path="/mail/:url_mail/:username">
                 <Mail/>
            </Route>
            <Route exact path="/mail2/:url_mail/:username">
                 <Mail2/>
            </Route>
            <Route exact path="/mail3/:url_mail/:username">
                 <Mail3/>
            </Route>
            <Route exact path="/complete/:url_mail/:username">
                 <CompleteSurvey/>
            </Route>
           </Switch>
      
    </Router>
  );
}

export default App;
