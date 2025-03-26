const mongose=require('mongoose')
require('dotenv').config()
const url=process.env.DB_URL


const dbConnect=async()=>{
   
    try {
        const conn=await mongose.connect(url)
        console.log("database connected successfully");
    } catch (error) {
        console.log(`db Error: ${error.message}`);
        
    }
}

module.exports=dbConnect