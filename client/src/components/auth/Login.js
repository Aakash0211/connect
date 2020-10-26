import React,{useState,Fragment}from 'react'
import {Redirect} from "react-router-dom"
import {connect} from'react-redux'
import PropTypes from 'prop-types'
import {login} from '../../actions/auth' 
const Login = ({login,isAuthenticated}) => {
    const [formData,setFormData]=useState({
        email:'',
        password:''
       })
       const onChange=e=>{setFormData({...formData,[e.target.name]:e.target.value})}
       const {email,password}=formData
       const onSubmit=async(e)=>{
         e.preventDefault()
         login(email,password)
      }
      if(isAuthenticated){
        return <Redirect to='/dashboard'/>
      }
       
       return (
  <Fragment>
    <section className="container">
         <h1 className="large text-primary">Sign In</h1>
         <p className="lead"><i className ="fas fa-user"></i> Login</p>
         <form className="form"  onSubmit={onSubmit}>
           <div className="form-group">
             <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange}/>
           </div>
           <div className="form-group">
             <input
               type="password"
               placeholder="Password"
               name="password"
               minLength="6"
               value={password}
               onChange={onChange}
             />
          </div>
           <input type="submit" className="btn btn-primary" value="login" />
         </form>
       </section>
    
           </Fragment>
       );

}
Login.propTypes={
login:PropTypes.func.isRequired,
isAuthenticated:PropTypes.bool,
}
const mapStateToProps=state=>({
 isAuthenticated:state.auth.isAuthenticated
})
export default connect(mapStateToProps,{login})(Login)
