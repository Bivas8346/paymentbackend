const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors')
const paymentRoute = require('./router/router')



const app = express();

dotenv.config();

app.use(express.json());
app.use(cors())


app.use("/api",paymentRoute)


const port = process.env.PORT||4025;
app.listen(port, ()=>
console.log(`server is running on  http://localhost:${process.env.PORT}`)
);