import { ObjectId } from "mongodb";
import { client } from "../index.js";

export async function addnewuser(firstname, lastname, email, hashpassword,) {
    return await client.db('short-url').collection('user').insertOne({ firstname: firstname, lastname: lastname, email: email, password: hashpassword,verification:false });
}
export async function getuser(email) {
    return await client.db('short-url').collection('user').findOne({ email: email });
}
export async function getuser1() {
    return await client.db('short-url').collection('user').find({}).toArray();
}
export async function getuserbyid(id) {
    return await client.db('short-url').collection('user').findOne({ _id: ObjectId(id) });
}
export async function updatepass(id, newpass) {
    console.log('password updTE');
    return client.db('short-url').collection('user').updateOne({ _id: ObjectId(id) }, { $set: { password: newpass } });
    
}
export async function updateverification(id, verification) {
    console.log('verfication updTE');
    return client.db('short-url').collection('user').updateOne({ _id: ObjectId(id) }, { $set: { verification: true } });
    
}
export async function addToken(data) {
    const ret = await client.db('short-url').collection("sessionTokens").insertOne(data);
           return ret
}
export async function updateVerification(data) {
    return await client.db('short-url').collection("user").updateOne({email:data},{$set:{verification: true}});
}

export async function getDataFromSessionCollection(data) {
    return await client.db('short-url').collection("sessionTokens").findOneAndDelete({token:data});
}
