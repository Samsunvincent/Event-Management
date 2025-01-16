const express = require('express');
const router = express.Router();
const organizerController = require('../Controller/organizerController');
const accessControl = require('../Controller/access-Controller').accessControl;
const upload = require('../utils/FileUpload');

function setAccessControl(access_types) {
    return (req, res, next) => {
        accessControl(access_types, req, res, next);
    };
}

// Existing Routes
router.post('/addEvents/:id', setAccessControl('2'), upload, organizerController.addEvents);
router.get('/getEvents/:id?', setAccessControl("*"), organizerController.getEvents);
router.get('/getEvent/:e_id/:id?', setAccessControl("*"), organizerController.getEvent);
router.get('/getOwnEvent', setAccessControl("2"), organizerController.getOwnEvent);

// Updated Route for Updating Event with File Upload Support
router.put('/updateEvent/:e_id', setAccessControl("1,2"), upload, organizerController.updateEvent);

// New Route for Getting Participants of an Event
router.get('/getParticipants/:e_id', setAccessControl("2,1"), organizerController.getParticipantsForEvent);

module.exports = router;
