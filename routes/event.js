
var mongoose = require('mongoose'),
    app = require('../index').app,
    Team = require("../models/team"),
    Event = mongoose.model('Event', require("../models/event"));

app.post('/team/:teamId/event', function(req, res){

    if(!req.body.name || !req.body.startdate || !req.body.location || !req.body.noRaceDays)
        return res.status(400).send({ message: 'Error: name, startdate, location and noRaceDays are mandatory' });

    Team.findById(req.params.teamId, function(err, team) {
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});

        var event = new Event();

        event.name = req.body.name;
        event.startdate = req.body.startdate;
        event.location = req.body.location;
        event.noRaceDays = req.body.noRaceDays;

        if (req.body.kartWeightWithFuel) { event.kartWeightWithFuel = req.body.kartWeightWithFuel }
        if (req.body.kartWeightWithoutFuel) { event.kartWeightWithoutFuel = req.body.kartWeightWithoutFuel }

        if (req.body.picturePath) { event.picturePath = req.body.picturePath }
            

        team.events.push(event);

        team.save(function(err) {
            if (err)
                return res.status(400).send(err);
            res.json(event);
        });
    });
});

app.delete('/team/:teamId/event/:eventId', function(req, res){
    Team.findById(req.params.teamId, function (err, team) {
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});

        if (!team.events.id(req.params.eventId))
            return res.status(400).send({message: 'Error: Person not found'});

        team.events.id(req.params.eventId).remove();
        team.save();   
        res.json({ message: 'deleted' });      
    });
});

app.get('/team/:teamId/event', function(req, res){
    Team.findById(req.params.teamId, function (err, team) {
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});

        events = team.events;
        if (req.query.orderBy == 'startdate') {
            events.sort((e1, e2) => e2.startdate-e1.startdate)
        }
        if (req.query.limit) {
            events = events.slice(0,req.query.limit)
        }
        res.json(events);
    });
});

app.get('/team/:teamId/event/:eventId', function(req, res){
    Team.findById(req.params.teamId, function (err, team) {
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});

        res.json(team.events.id(req.params.eventId));        
    });
});

app.put('/team/:teamId/event/:eventId', function(req, res){
    Team.findById(req.params.teamId, function (err, team) {
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});

        event = team.events.id(req.params.eventId)
        if (!event)
            return res.status(400).send({message: 'Error: Person not found'});

        if (req.body.kartWeightWithFuel) { event.kartWeightWithFuel = req.body.kartWeightWithFuel }
        if (req.body.kartWeightWithoutFuel) { event.kartWeightWithoutFuel = req.body.kartWeightWithoutFuel }

        if (req.body.picturePath) { event.picturePath = req.body.picturePath }
        if(req.body.name) { event.name = req.body.name }
        if(req.body.startdate) { event.startdate = req.body.startdate }
        if(req.body.location) { event.location = req.body.location }
        if(req.body.noRaceDays) { event.noRaceDays = req.body.noRaceDays }

        team.save();   
        res.json(event);
    });
});