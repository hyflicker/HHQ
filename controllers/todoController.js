var bodyParser = require('body-parser')
var mongoose = require('mongoose')

//Connect to the database
mongoose.connect('mongodb+srv://test:test@cluster0-8isbx.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });

//create a schema - like blueprint
var todoSChema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo', todoSChema);

//var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'kick some coding ass'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});
module.exports = function(app){

app.get('/todo', function(req, res){
    //get data from mongodb and pass it to the view
    Todo.find({}, function(err, data){
        if (err) throw err;
    res.render('todo', {todos: data})    
    });
    
});

app.post('/todo', urlencodedParser, function(req, res){
    //get data from view and add to mongodb
    var newTodo = Todo(req.body).save(function(err, data){
        if (err) throw err;
        res.json(data);
    })
});

app.delete('/todo/:item', function(req, res){
    //delete requested item from mongodb
    Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data){
        if (err) throw err;
        res.json(data);
    });
});

}