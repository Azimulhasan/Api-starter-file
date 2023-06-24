const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json())
const port =  5002;


// app.get('/',(req,res)=>{
//     res.status(200).send("Working ig")
// })


const nfts = JSON.parse(fs.readFileSync(`${__dirname}/nft-data/data/nft-simple.json`)) 


app.get('/api/v1/nfts',(req,res)=>{
    res.status(200).json({
        "status":"success",
        "results":nfts.length,
        "data":{
           nfts,
        }
    })
})

app.post("/api/v1/nfts",(req,res)=>{
    const newId = nfts[nfts.length - 1].id +1;
    const newNFTs = Object.assign({id:newId},req.body)
    nfts.push(newNFTs)
    fs.writeFile(`${__dirname}/nft-data/data/nft-simple.json`, JSON.stringify(nfts), (err)=>{
        res.status(201).json({
            status:"success",
            nfts: newNFTs,
        })
    })
})

app.listen(port, ()=>{
    console.log(`App running on port ${port} ...`)
})