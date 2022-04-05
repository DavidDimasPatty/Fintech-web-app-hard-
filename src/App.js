import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Login from "./components/login";
import AddUser from "./components/signup";
import Dashboard from "./components/dashboard";
import Home from "./components/home";
import CustomerList from "./components/customerList";
import Profile from "./components/profile";
import Onboard from "./components/onboard";
import Mail from "./components/survey";
import Mail2 from "./components/survey2";
import Mail3 from "./components/survey3";
import CompleteSurvey from "./components/complete_survey";
import ValidationSurvey from "./components/validation";
import OCRPROCESS from "./components/ocrprocess";
import {ReactSession} from "react-client-session";
import "./components/app.css";

function App() {
     ReactSession.setStoreType("sessionStorage");
     return (
          <Router>
               <Switch>
                    <Route exact path="/">
                         <Login/>
                    </Route>
                    <Route exact path="/signup">
                         <AddUser/>
                    </Route>
                    <Route exact path="/home">
                         <div className="navList">
                              <Dashboard/>
                              <Home/>
                         </div>
                    </Route>
                    <Route exact path="/customers">
                         <div className="navList">
                              <Dashboard/>
                              <CustomerList/>
                         </div>
                    </Route>
                    <Route exact path="/customers/:id">
                         <div className="navList">
                              <Dashboard/>
                              <Profile/>
                         </div>
                    </Route>
                    <Route exact path="/onboard">
                         <div className="navList">
                              <Dashboard/>
                              <Onboard/>
                         </div>
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
                    <Route exact path="/validation/:url_mail/:username">
                         <ValidationSurvey/>
                    </Route>
                    <Route exact path="/process1/:url_mail/:username">
                         <OCRPROCESS/>
                    </Route>
               </Switch>
          </Router>
     );
}

export default App;