import  express, { text } from "express";
import {  MongoClient, ObjectId } from "mongodb";
import cors from 'cors'
import * as dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt  from "jsonwebtoken";
import nodemailer from 'nodemailer'
export const app=express()
dotenv.config()

const PORT=process.env.PORT||4000
const MONGO_URL=process.env.MONGO_URL
const client=new MongoClient(MONGO_URL)
await client.connect()
console.log("monggo connected")

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.set('view engine','ejs')

async function mail(email,subject,text)
{
    try {
let mailtransporter=nodemailer.createTransport({
    host:process.env.HOST,
    service:process.env.SERVICE,
    port:Number(process.env.EMAIL_PORT),
    secure:Boolean(process.env.SECURE),
    
        auth:{
            user:process.env.USER,
            pass:process.env.PASS
        }
    })
    await mailtransporter.sendMail({
        from:process.env.USER,
        to:email,
        subject:subject,
        text:text
    })
    console.log("email sent sucessfully")
    } catch (error) {
        console.log("the mail is not sent",error)
    }
}
   



async function generatehashedpassword(password){
    const no_of_rounds=10;
    const salt=await bcrypt.genSalt(no_of_rounds)
    const hashedpassword=await bcrypt.hash(password,salt)
    return hashedpassword
}  
app.get('/',function(request,responce)
{
    responce.send("this is the password page")
})
app.get('/user',async function(request,responce)
{
    const user=await getuser1()
    responce.send(user)
})

app.post('/user',async function(req,res)
{
    const {firstname,email,lastname,password,confrimpassword}=req.body;
    const found=await getuser(email)
    console.log(found)
    if(found)
    {
        console.log("not")
        res.status(401).send({message:"user alredy exist"})
    }
    else{
    const hashpassword=await generatehashedpassword(password)
    const hashpassword2=await generatehashedpassword(confrimpassword)
      //  db.movies.insertMany(data)
    //  
    const newuser = await addnewuser(firstname,lastname,email,hashpassword,hashpassword2)
    console.log(newuser)
      res.send(newuser)
    }
})
app.post('/login',async function(request,responce)
{
    const {email,password}=request.body;
    const emailfound=await getuser(email)
    if(!emailfound)
    {
        responce.send({message:'user not found'})
    }
    else{
        const pass=await bcrypt.compare(password,emailfound.password)
        console.log(pass)
        if(pass)
        {
            const token=jwt.sign({id:emailfound._id},process.env.SCRETE_TOKEN)
            responce.status(200).send({message:"logged in sucessfully",token:token})

        }
        else{
            responce.status(401).send({message:'invalid credentials'})
          }
    }
})


app.post('/forgotpass',async function(request,responce)
{
    console.log(request.body)
    const {email}=request.body
    const userfound=await getuser(email)
    // responce.send({monika:"very very inteligent girl"})
    if(!userfound)
    {
        responce.send({message:'this user is not found'})
    }
    else{
        console.log("found")
        const token=jwt.sign({id:userfound._id},process.env.SCRETE,{expiresIn:'15m'})
        const link=`${process.env.BASE_URL}/reset-password/${userfound._id}`
        await mail(userfound.email,'verification mail',link)
        console.log(link)
        responce.send({messagr:"password rest link ui ssent to mail"}) 
    }
})

app.get(`/reset-password/:id`,async function(request,responce)
{
    const {id}=request.params
    console.log(id)
    const useridfound=await getuserbyid(id)
    if(!useridfound)
    {
        responce.send({message:"this link is not for valid person"})
    }
    else{

responce.send({message:'we will reset the password'})
 
    }
})

app.post(`/reset-password`,async function(request,responce)
{
    const {email,password}=request.body
    const userfound=await getuser(email)
    console.log("dataaa")
    console.log(password)
        const newpass=await generatehashedpassword(password)
        const newpassword=await updatepass(userfound._id,newpass)
        console.log(newpass)
        responce.send(newpassword)
        console.log("newpassword")
    


})

app.listen(PORT,()=>console.log(`server ${PORT}`))
export {client}




async function addnewuser(firstname,lastname,email,hashpassword) {
    return await client.db('short-url').collection('user').insertOne({ firstname:firstname,lastname:lastname,email: email, password: hashpassword, });
}

async function getuser(email) {
    return await client.db('short-url').collection('user').findOne({ email: email });
}
async function getuser1() {
    return await client.db('short-url').collection('user').find({ }).toArray();
}
async function getuserbyid(id) {
    return await client.db('short-url').collection('user').findOne({_id:ObjectId(id)});
}
async function updatepass(id,newpass) {
    console.log('password updTE')
    return client.db('short-url').collection('user').updateOne({_id:ObjectId(id)},{$set:{password:newpass,verfication:'changed'}});
    // 
}

