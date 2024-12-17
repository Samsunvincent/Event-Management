const express = require('express')
const router = express.Router();
const attendeesController = require('../Controller/attendees-Controller')
const accessControl = require('../Controller/access-Controller').accessControl


function setAccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}

router.post('/bookTicket/:eid',setAccessControl("2,3"),attendeesController.bookingTicket);
router.get('/manageRegisteredEvents/:e_id',setAccessControl("2,3"),attendeesController.ManageRegistration)
router.get('/filter', attendeesController.getFilteredEvents);

module.exports = router