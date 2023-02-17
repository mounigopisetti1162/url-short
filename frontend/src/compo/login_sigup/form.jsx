import {useFormik} from "formik";
import { API } from "./global";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage} from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function Formss()
{
   const nav=useNavigate()
const onSubmit=(values)=>{
    console.log("data")
    fetch(`${API}/reset-password`,{
    method:"POST",
    body:JSON.stringify(values),
    headers:{"Content-type":"application/json"},
}).then((data)=> data.json()).then((data)=>{
        console.log(data)
        toast("chaned sucessfully")
        nav('/login')
    })
// console.log(values)
  }

    
    const validationSchema = Yup.object().shape({
        email: Yup.string().email().required(),
        password: Yup.string().min(3).max(50).required(),
        confrimpassword: Yup.string().oneOf([Yup.ref("password"), null], "Password must match")
        .required("Confirm Password is required")
      });
    const initialValues = {
      email:"",
        password: "",
        confrimpassword: "",
      };
const renderError = (message) => <p className="help is-danger">{message}</p>;

    return(
        <>
        <h1> forgot-password</h1>
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
            Submittt
          </button>
          </div>
          
      </Form>
      </div>
      
      </Formik>
      </>
            
    )
}