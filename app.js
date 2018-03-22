const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override'); //dynamically overrides post when it's time to PUT (update)
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
.then(()=>console.log('MongoDB Conneced....'))
.catch(err => console.log(err));

//handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');


//Body parser middleware - allows us to access whatever is submitted from the form of the request object
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//method Override middleware
app.use(methodOverride('_method'));




app.use(cookieParser('secret'));
app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());

//Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Index Route
app.get('/', (req, res)=>{
    const myTitle="Welcome Isaac S.";
    res.render('INDEX', {
        title:myTitle
    });
});

//About Route
app.get('/about', (req, res)=>{
    res.render('ABOUT');
})

//use routes
app.use('/ideas', ideas);
app.use('/users', users);

//Use nodemon app to connect
const port = 5500;
app.listen(port, ()=> {
    console.log(`Server started on port ${port}`);

    /*Same as above which is ES6 */
    //console.log('Server started on port '+port);
})