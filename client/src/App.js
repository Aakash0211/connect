import React,{Fragment,useEffect} from 'react';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'
import './App.css';
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import {Provider} from 'react-redux'
import store from'./store'
import setAuthToken from'./utils/setAuthToken.js'
import {loadUser} from './actions/auth.js'
import Routes from './components/routinig/routes'
if(localStorage.token){
  setAuthToken(localStorage.token)
}
const App =() => {
useEffect(() => {
  store.dispatch(loadUser())
}, [])
return(
<Provider store={store}>
 <Router>
   <Fragment>
     <Navbar/>
     <Switch>
     <Route exact path='/'   component={Landing}/>
     <Route component={Routes} />
     </Switch>
   </Fragment>
   </Router>
   </Provider>
)
}
export default App;
