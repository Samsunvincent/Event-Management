const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoConnect = require('./db/Connect');
mongoConnect();
const cors = require('cors')
const path = require('path')

const router = require('./Router/userRouter')
const authRouter = require('./Router/authRouter')
const organizerRouter = require('./Router/organizerRouter')
const attendeesRouter = require('./Router/attendeesRouter');


app.use(cors());
app.use(express.json({limit : "500mb"}));
app.use(express.urlencoded({extended : true}));
app.use(express.static('../client'));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(router)
app.use(authRouter)
app.use(organizerRouter)
app.use(attendeesRouter);


app.listen(process.env.PORT,()=>{
    console.log(`server is running at http://localhost:${process.env.PORT}`);

})