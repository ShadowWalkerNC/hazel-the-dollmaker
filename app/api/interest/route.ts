import {getDb} from '../../../db';
import {interests} from '../../../db/schema';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Please submit from this website.'},{status:403});
 try{if(Number(request.headers.get('content-length')||0)>12000)return Response.json({error:'Message too long.'},{status:413});
 const b=await request.json() as {kind:string;name:string;email:string;details:string;website?:string;consent:boolean};
 if(b.website)return Response.json({ok:true});
 if(!['collector','wrestler','nomination'].includes(b.kind)||typeof b.name!=='string'||!b.name.trim()||b.name.length>120||typeof b.email!=='string'||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)||b.email.length>254||typeof b.details!=='string'||b.details.length>2000||b.consent!==true)return Response.json({error:'Check your name, email and consent.'},{status:400});
 await getDb().insert(interests).values({kind:b.kind,name:b.name.trim(),email:b.email.trim().toLowerCase(),details:b.details});
 return Response.json({ok:true});
 }catch{return Response.json({error:'We could not save your request. Please try again.'},{status:500});}}
