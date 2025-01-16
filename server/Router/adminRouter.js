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
Router.get('/allevents',setAccessControl('1'),AdminController.allEvent)
Router.get('/allOrganizer',setAccessControl('1'),AdminController.allOrganizers);
Router.get('/allAttendees',setAccessControl('1'),AdminController.allAttendees)
Router.post('/blockOrUnblock/:id', setAccessControl('1'),AdminController.blockOrUnblock);






module.exports = Router