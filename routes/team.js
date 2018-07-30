
var app = require('../index').app,
    Team = require("../models/team");

app.get('/team', function(req, res){

    Team.find(function(err, teams) {

        if (err)
            res.status(400).send(err);

        res.json(teams);
    })
});

app.get('/team/:teamId', function(req, res){

    Team.findById(req.params.teamId, function(err, team) {
        
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});

        res.json(team)
    });
});

app.post('/team', function(req, res){

    var team = new Team();

    team.name = req.body.name;
    //team.secret = crypto.randomBytes(64).toString('hex');

    team.save(function(err) {
        if (err){
            res.send(err);
        }
        res.json(team);
    });
});

app.delete('/team/:teamId', function(req, res){

    Team.remove({_id: req.params.teamId}, function(err, team) {

        if (err || !team)
            return res.status(400).send({message: 'Error: Id not found'});
    
        res.json({ message: 'deleted' });
    });
});