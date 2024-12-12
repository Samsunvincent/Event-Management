const express = require('express')
const router = express.Router();
const attendeesController = require('../Controller/attendees-Controller')
const accessControl = require('../Controller/access-Controller').accessControl


function setAccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}

router.post('/bookTicket/:eid',setAccessControl("3"),attendeesController.bookingTicket);

module.exports = router