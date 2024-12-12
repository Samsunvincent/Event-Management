const express = require('express')
const router = express.Router();
const organizerController = require('../Controller/organizerController')
const accessControl = require('../Controller/access-Controller').accessControl
const upload = require('../utils/FileUpload')

function setAccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}



router.post('/addEvents/:id',setAccessControl('2'),upload,organizerController.addEvents);
router.get('/getEvents/:id?', setAccessControl("*"), organizerController.getEvents);
router.get('/getEvent/:e_id',setAccessControl("*"),organizerController.getEvent)
router.get('/getOwnEvent/:id',setAccessControl("2"),organizerController.getOwnEvent);


module.exports = router