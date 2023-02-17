import {useFormik} from 'formik'
import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage} from "formik";
import {  toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

import { API } from './global'
export default function Login() {

  const [status,setstatus]=useState('submit')
  const navigate=useNavigate()

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().min(3).max(50).required(),
    confrimpassword: Yup.string().oneOf([Yup.ref("password"), null], "Password must match")
    .required("Confirm Password is required")
  });

  const initialValues = {
    email: "",
    password: "",
    confrimpassword: "",
  };
  const nav=useNavigate();


const onSubmit=(values)=>{
  setstatus('loding..') 
  console.log(values)
  fetch(`${API}/login`,{
    method:'POST',
    body:JSON.stringify(values),
    headers:{"Content-Type":"application/json"},
    
  }).then((data)=>
  {
if(data.status===401)
{
  toast("invalid credentials")
  setstatus("error")
throw new Error(data.statusText)

}
setstatus("submited");
return data.json();}).then((data)=>{console.log(data);
localStorage.setItem('token',data.token);
nav('/home');
toast("Loged in sucessfullt")

// localStorage.setItem('token',data.token);
}).catch((err)=>{console.log(err);
toast("inalid credentials")})
}

const renderError = (message) => <p className="help is-danger">{message}</p>;
  
  return(
  <>
  <h1>Login Page</h1>
 <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={values => {
       onSubmit(values);
      console.log(values)
    }}
  >
    <div>
      <Form>
        <div
          className="container"
          style={{
            width: "60%",
          }}
        >
           <div className="field">
            <label className="label" htmlFor="email">
              Email address
            </label>
            <div className="control">
              <Field
                name="email"
                type="text"
                className="input"
                placeholder="Email address"
              />
              <ErrorMessage name="email" render={renderError} />
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="password">
              password
            </label>
            <div className="control">
              <Field
                name="password"
                type="password"
                className="input"
                placeholder="password"
              />
              <ErrorMessage name="password" render={renderError} />
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="confrimpassword">
             Confrim password
            </label>
            <div className="control">
              <Field
                name="confrimpassword"
                type="password"
                className="input"
                placeholder="confrimpassword"
              />
              <ErrorMessage name="confrimpassword" render={renderError} />
            </div>
          </div>
      
          <button type="submit" className="btn btn-primary" 
          >
            Submit
          </button>
          <br></br>
        <Link to='/'>Dont have Account</Link>
        <br></br>
        <Link to='/verification'>Forgot Password</Link>

        </div>
      </Form>
      </div>
      
      </Formik>

        </>
        );
}
