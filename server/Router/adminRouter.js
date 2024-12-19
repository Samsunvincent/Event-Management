const express = require('express');
const Router = express.Router();
const AdminController = require('../Controller/admin-Controller')
const accessControl = require('../Controller/access-Controller').accessControl


function setAccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}

Router.get('/Count',setAccessControl('1'),AdminController.Count)






module.exports = Router