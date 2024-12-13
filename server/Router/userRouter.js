const express = require('express');
const router = express.Router();
const usercontroller = require('../Controller/userController');
const accessControl = require('../Controller/access-Controller').accessControl



function setAccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}

router.post('/register',setAccessControl('*'),usercontroller.register_user)
router.get('/getProfile/:id',setAccessControl('*'),usercontroller.getProfile);
router.put('/updateProfile/:id',setAccessControl('*'),usercontroller.updateProfile);
router.get('/userType',setAccessControl('*'),usercontroller.getUserType);
router.get('/category',setAccessControl("*"),usercontroller.getCategory)
router.get('/language',setAccessControl("*"),usercontroller.getLanguage)


module.exports = router