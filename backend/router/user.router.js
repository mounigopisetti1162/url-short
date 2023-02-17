import express, { request } from 'express'
import bcrypt from 'bcrypt'
import  jwt  from 'jsonwebtoken';
import * as dotenv from "dotenv"
import { getuser1, addnewuser,addToken, getuser,updateVerification,getDataFromSessionCollection, getuserbyid, updatepass } from "../service/user.services.js";
import { mail} from '../index.js';
import randomstring from 'randomstring';
const router=express.Router()
const API = "http://localhost:4000";
const API2 = "http://localhost:5173";

async function generatepassword(password)
{
const no_of_rounds=10
const salt=await bcrypt.genSalt(no_of_rounds)
const genpass=await bcrypt.hash(password,salt)
return genpass
}

router.get('/',async function(request,responce)
{
    const user=await getuser1()
    responce.send(user)
})

router.post('/',async function(req,response)
{
    const {firstname,lastname,email,password}=req.body;
    const hashpassword=await generatepassword(password)
    const userfound=await getuser(email)
    console.log(userfound)
    const newuser = await addnewuser(firstname,lastname,email,hashpassword)

      //  db.movies.insertMany(data)
    //  
    // const token=jwt.sign({id:usernamefound._id},process.env.SCRETE_TOKEN)
    let  token = randomstring.generate();
      
    const verificationInitiate = await addToken({
      email:email,
      token:token,
      DateTime: new Date()
    });
    const mails =await mail(email,"verification token" , `${API2}/user/verification/${token}`)   
    response.send({
      message: "successfully Created ",
      verificationInitiate: verificationInitiate,
      ...newuser,
    }); 
    // const token=jwt.sign({id:userfound._id},process.env.SCRETE,{expiresIn:'15m'})
    // const link=`${process.env.BASE_URL}/user/verification-mail/${userfound._id}/${token}`
    // await mail(userfound.email,'verification mail',link)

    // console.log(newuser)
    //   res.send(newuser)
})
router.get(`${API2}/verification/:id`,express.json(),async function(request, response){
    const { id } = request.params ;
    const getData = await getDataFromSessionCollection(id);
    if(getData.value){
      const update =await updateVerification(getData.value.email)
      response.status(200).send({
        message:"verified successful"
      })
    }else{
      response.status(404).send({
        message:"invalid credential"
      })
    }
})
router.get(`/verification-mail/:id/:token`,async(req,res)=>{
    try {
        const {id}=req.params
        const user=await getuserbyid(id)
        if(!user) return res.status(400).send({message:'inavlid link'})
        await updateverification(id)
    } catch (error) {
        
    }
})
router.post('/forgot_pass',async function(request,responce)
{
    const {username}=request.body
    const userfound=await getuser(username)
    console.log(userfound)
    if(!userfound)
    {
        responce.send({message:'this user is not found'})
    }
    else{
        console.log("found")
        const token=jwt.sign({id:userfound._id},process.env.SCRETE,{expiresIn:'15m'})
        const link=`${process.env.BASE_URL}/reset-password/${userfound._id}/${token}`
        await mail(userfound.email,'verification mail',link)
        console.log(link)
        responce.send("password rest link ui ssent to mail") 
    }
    // responce.send(user)
})

router.get('/reset-password',async function(request,responce)
{
    // const {id,token}=request.params;
    const useridfound=await getuserbyid(id)
    if(!useridfound)
    {
        responce.send({message:"this link is not for valid person"})
    }
    else{

responce.send({message:'we will reset the password'})
 
    }
})

router.post('/reset-password',async function(request,responce)
{
    const {username,password}=request.body
    const usernamefound=await getuser(username)
    console.log(usernamefound)
    if(usernamefound)
    {

        const newpass=await generatepassword(password)
        const newpassword=await updatepass(usernamefound._id,newpass)
        console.log(newpass)
        responce.send(newpassword)
        console.log(newpassword)
    }


})
router.post('/login', async function (request, responce) {
    const {email,password,roleId} = request.body;
    console.log("login")

    const usernamefound=await getuser(email)
    console.log(usernamefound)
  
    if(!usernamefound)
    {
  responce.send({message:'username not found'})
    }
    else{
        console.log('password')
  const pass=await bcrypt.compare(password,usernamefound.password)
  if(pass)
  {
    // const roleId=usernamefound.roleId
    // console.log(roleId)
    const token=jwt.sign({id:usernamefound._id},process.env.SCRETE_TOKEN)
    responce.status(200).send({message:"logged in sucessfully",token:token})
  }
  else{
    responce.send({message:'invalid credentials'})
  }
  console.log(password)
  console.log(pass)
    }
  
  });
  export default router
