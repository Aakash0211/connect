import React,{Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Spinner from'../layout/Spinner.js'
import {getCurrentProfile,deleteAccount} from'../../actions/profile'
import { Link, Redirect } from 'react-router-dom'
import {DashboardActions} from './DashboardActions'
import Experiences from './Experiences.js'
import Educations from './Educations.js'
const Dashboard = ({getCurrentProfile,deleteAccount,auth:{user},profile:{profile,loading}}) => {
    useEffect(() => {
     getCurrentProfile();
    }, [getCurrentProfile]);
    return loading && profile===null ? (<Spinner/> ):(<Fragment><h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
  <i className="fas fa-user"></i> Welcome {user && user.name}</p>
 {profile!==null ? (<Fragment><DashboardActions/><Experiences experience={profile.experience}/><Educations education={profile.education}/>
  <div className='my-2'>
 <button onClick={()=>deleteAccount()}className='btn btn-danger'><i className='fas fa-user-minus'></i>{'   '}Delete My Account </button>
  {user===null && <Redirect to='/login'/>}
  </div>
 </Fragment>
    ):(<Fragment>You have not yet setup a profile,please add some info
       <Link to='/create-profile' className="btn btn-primary my-1">
       Create Profile</Link>
    </Fragment>)}
  </Fragment>
    )
}


Dashboard.propTypes = {
 getCurrentProfile:PropTypes.func.isRequired,
 auth:PropTypes.object.isRequired,
 profile:PropTypes.object.isRequired,
 deleteAccount:PropTypes.func.isRequired,
}
const mapStateToProps=state=>({
  auth:state.auth,
  profile:state.profile
})
export default connect(mapStateToProps,{getCurrentProfile,deleteAccount})(Dashboard)