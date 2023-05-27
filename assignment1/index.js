<<<<<<< HEAD

=======
>>>>>>> 7374179/COMP2537_Demo_Code_2/main
require("./utils.js");

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const saltRounds = 12;

const port = process.env.PORT || 3000;

<<<<<<< HEAD

=======
>>>>>>> 7374179/COMP2537_Demo_Code_2/main
const app = express();

const Joi = require("joi");

<<<<<<< HEAD
=======
const url = require('url');

const {
	ObjectId
} = require('mongodb');
>>>>>>> 7374179/COMP2537_Demo_Code_2/main

const expireTime = 60 * 60 * 1000; //expires after 1 hour  (minutes * seconds * millis)

/* secret information section */
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const node_session_secret = process.env.NODE_SESSION_SECRET;
/* END secret section */

<<<<<<< HEAD
var {database} = include('databaseConnection');

const userCollection = database.db(mongodb_database).collection('users');

app.use(express.urlencoded({extended: false}));

var mongoStore = MongoStore.create({
    mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/sessions`,
=======
var {
	database
} = include('databaseConnection');

const userCollection = database.db(mongodb_database).collection('users');

app.set('view engine', 'ejs');

const navLinks = [{
		name: "Home",
		link: "/"
	},
	{
		name: "Members",
		link: "/members"
	},
	{
		name: "Login",
		link: "/login"
	},
	{
		name: "Admin",
		link: "/admin"
	},
	{
		name: "404",
		link: "/dne"
	}
]

app.use(express.urlencoded({
	extended: false
}));

var mongoStore = MongoStore.create({
	mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/sessions`,
>>>>>>> 7374179/COMP2537_Demo_Code_2/main
	crypto: {
		secret: mongodb_session_secret
	}
})

<<<<<<< HEAD
app.use(session({ 
    secret: node_session_secret,
	store: mongoStore, //default is memory store 
	saveUninitialized: false, 
	resave: true
}
));

app.get('/', (req,res) => {
    if(!req.session.authenticated){
        var html = `
            <div><a href="/signup"><button>Sign up</button></a></div>
            <div><a href="/login"><button>Log in</button></a></div>
        `;
        res.send(html);
        return;
    }
    else{
        var html = `
        Hello, ${req.session.username}
        <div><a href="/members"><button>Go to Members Area</button></a></div>
        <div><a href="/logout"><button>Log Out</button></a></div>
        `;
        res.send(html);
        return;
    }
});

app.get('/nosql-injection', async (req,res) => {
=======
app.use(session({
	secret: node_session_secret,
	store: mongoStore, //default is memory store 
	saveUninitialized: false,
	resave: true
}));

function isValidSession(req) {
	if (req.session.authenticated) {
		return true;
	}
	return false;
}

function sessionValidation(req, res, next) {
	if (isValidSession(req)) {
		next();
	} else {
		res.redirect('/login');
	}
}

function isAdmin(req) {
	if (req.session.user_type == 'admin') {
		return true;
	}
	return false;
}

function adminAuthorization(req, res, next) {
	if (!isAdmin(req)) {
		res.status(403);
		res.render("errorMessage", {
			error: "Not Authorized",			
			navLinks: navLinks,
			currentURL: url.parse(req.url).pathname			
		});
		return;
	} else {
		next();
	}
}

app.get('/', (req, res) => {
	res.render('index', {
		navLinks: navLinks,
		currentURL: url.parse(req.url).pathname,
		authenticated: req.session.authenticated,
		username: req.session.username
	});
});

app.get('/nosql-injection', async (req, res) => {
>>>>>>> 7374179/COMP2537_Demo_Code_2/main
	var username = req.query.user;

	if (!username) {
		res.send(`<h3>no user provided - try /nosql-injection?user=name</h3> <h3>or /nosql-injection?user[$ne]=name</h3>`);
		return;
	}
<<<<<<< HEAD
	console.log("user: "+username);
=======
	console.log("user: " + username);
>>>>>>> 7374179/COMP2537_Demo_Code_2/main

	const schema = Joi.string().max(20).required();
	const validationResult = schema.validate(username);

	//If we didn't use Joi to validate and check for a valid URL parameter below
	// we could run our userCollection.find and it would be possible to attack.
	// A URL parameter of user[$ne]=name would get executed as a MongoDB command
	// and may result in revealing information about all users or a successful
	// login without knowing the correct password.
<<<<<<< HEAD
	if (validationResult.error != null) {  
	   console.log(validationResult.error);
	   res.send("<h1 style='color:darkred;'>A NoSQL injection attack was detected!!</h1>");
	   return;
	}	

	const result = await userCollection.find({username: username}).project({username: 1, password: 1, _id: 1}).toArray();

	console.log(result);

    res.send(`<h1>Hello ${username}</h1>`);
});

app.get('/signup', (req,res) => {
    var html = `
    create user
    <form action='/submitUser' method='post'>
    <input name='username' type='text' placeholder='username'><br>
    <input name='email' type='text' placeholder='email'><br>
    <input name='password' type='password' placeholder='password'><br>
    <button>Submit</button>
    </form>
    `;
    res.send(html);
});

app.get('/login', (req,res) => {
    var html = `
    log in
    <form action='/loggingin' method='post'>
    <input name='email' type='text' placeholder='email'><br>
    <input name='password' type='password' placeholder='password'><br>
    <button>Submit</button>
    </form>
    `;
    res.send(html);
});

app.post('/submitUser', async (req,res) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    console.log(req.body);

	const schema = Joi.object(
		{
            username: Joi.string().alphanum().max(20).required(),
			email: Joi.string().max(20).required(),
			password: Joi.string().max(20).required()
		});
	
	const validationResult = schema.validate({username, email, password});
	if (validationResult.error != null) {
	   console.log(validationResult.error);
       var html = `
       ${validationResult.error.details[0].message}
       <div><a href="/signup">signup</a></div>
   `;
      res.send(html);
	   return;
   }

    var hashedPassword = await bcrypt.hash(password, saltRounds);
	
	await userCollection.insertOne(
        {
            username: username, 
            email: email, 
            password: hashedPassword
        });
	console.log("Inserted user");

    req.session.authenticated = true; 
    req.session.username = username;
	req.session.email = email;

    res.redirect("/members");
});

app.post('/loggingin', async (req,res) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
=======
	if (validationResult.error != null) {
		console.log(validationResult.error);
		res.send("<h1 style='color:darkred;'>A NoSQL injection attack was detected!!</h1>");
		return;
	}

	const result = await userCollection.find({
		username: username
	}).project({
		username: 1,
		password: 1,
		_id: 1
	}).toArray();

	console.log(result);

	res.send(`<h1>Hello ${username}</h1>`);
});

app.get('/signup', (req, res) => {
	res.render("signup");

});

app.get('/login', (req, res) => {

	res.render("login", {
		navLinks: navLinks,
		currentURL: url.parse(req.url).pathname
	});
});

app.post('/submitUser', async (req, res) => {
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	console.log(req.body);

	const schema = Joi.object({
		username: Joi.string().alphanum().max(20).required(),
		email: Joi.string().max(20).required(),
		password: Joi.string().max(20).required()
	});

	const validationResult = schema.validate({
		username,
		email,
		password
	});
	if (validationResult.error != null) {
		console.log(validationResult.error);
		var html = `
       ${validationResult.error.details[0].message}
       <div><a href="/signup">signup</a></div>
   `;
		res.send(html);
		return;
	}

	var hashedPassword = await bcrypt.hash(password, saltRounds);

	await userCollection.insertOne({
		username: username,
		email: email,
		password: hashedPassword,
		user_type: "user"
	});
	console.log("Inserted user");

	req.session.authenticated = true;
	req.session.username = username;
	req.session.email = email;

	res.redirect("/members");
});

app.post('/loggingin', async (req, res) => {
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
>>>>>>> 7374179/COMP2537_Demo_Code_2/main

	const schema = Joi.string().max(20).required();
	const validationResult = schema.validate(email);
	if (validationResult.error != null) {
<<<<<<< HEAD
	   console.log(validationResult.error);
	   res.redirect("/login");
	   return;
	}

	const result = await userCollection.find({email: email}).project({username: 1, email: 1, password: 1, _id: 1}).toArray();
=======
		console.log(validationResult.error);
		res.redirect("/login");
		return;
	}

	const result = await userCollection.find({
		email: email
	}).project({
		username: 1,
		email: 1,
		password: 1,
		user_type: 1,
		_id: 1
	}).toArray();
>>>>>>> 7374179/COMP2537_Demo_Code_2/main

	console.log(result);
	if (result.length != 1) {
		console.log("user not found");
<<<<<<< HEAD
        var html = `
        user not found
        <div><a href="/login"><button>login</button></a></div>
    `;
       res.send(html);
=======
		var html = `
        user not found
        <div><a href="/login"><button>login</button></a></div>
    `;
		res.send(html);
>>>>>>> 7374179/COMP2537_Demo_Code_2/main
		return;
	}
	if (await bcrypt.compare(password, result[0].password)) {
		console.log("correct password");
		req.session.authenticated = true;
<<<<<<< HEAD
        req.session.username = result[0].username;
		req.session.email = email;
		req.session.cookie.maxAge = expireTime;

        if(req.session.redirectTo){
			res.redirect(req.session.redirectTo);
			delete req.session.redirectTo;
		}else{
			res.redirect('/members');
		}
		return;
	}
	else {
		console.log("incorrect password");
        var html = `
        incorrect password
        <div><a href="/login"><button>login</button></a></div>
    `;
        res.send(html);
=======
		req.session.username = result[0].username;
		req.session.email = email;
		req.session.user_type = result[0].user_type;
		req.session.cookie.maxAge = expireTime;

		if (req.session.redirectTo) {
			res.redirect(req.session.redirectTo);
			delete req.session.redirectTo;
		} else {
			res.redirect('/members');
		}
		return;
	} else {
		console.log("incorrect password");
		var html = `
        incorrect password
        <div><a href="/login"><button>login</button></a></div>
    `;
		res.send(html);
>>>>>>> 7374179/COMP2537_Demo_Code_2/main
		return;
	}
});

<<<<<<< HEAD
app.get('/loggedin', (req,res) => {
    if (!req.session.authenticated) {
        res.redirect('/login');
    }
    var html = `
    You are logged in!
    `;
    res.send(html);
});

app.get('/members', (req, res) => {
    if(!req.session.username){
        res.redirect('/login');
        return;
    }

    const randomImageNumber = Math.floor(Math.random() * 3) + 1;

    let imageHTML = ' ';

    if (randomImageNumber === 1) {
        imageHTML = "<img src='/AI_1.jpg' style='width:250px;'>";
    }
    else if (randomImageNumber === 2) {
        imageHTML = "<img src='/AI_2.png' style='width:250px;'>";
    }
    else {
        imageHTML = "<img src='/AI_3.png' style='width:250px;'>";
    }

    if(req.session.authenticated){
        var html = `
        Hello, ${req.session.username}
        <div>${imageHTML}</div><br>

        <div><a href="/logout"><button>Sign Out</button></a></div>
        `;
        res.send(html);
        return;
    }
});

app.get('/logout', (req,res) => {
	req.session.destroy();
    res.redirect('/');
});

app.use(express.static(__dirname + "/public"));

app.get("*", (req,res) => {
	res.status(404);
	res.send("Page not found - 404");
})

app.listen(port, () => {
	console.log("Node application listening on port "+port);
}); 
=======
app.get('/loggedin', (req, res) => {
	if (!req.session.authenticated) {
		res.redirect('/login');
	}
	var html = `
    You are logged in!
    `;
	res.send(html);
	res.send(html);
});

app.get('/members', (req, res) => {
	if (!req.session.username) {
		res.redirect('/login');
		return;
	}

	res.render('AI', {
		navLinks: navLinks,
		currentURL: url.parse(req.url).pathname,
		authenticated: req.session.authenticated,
		username: req.session.username
	});
});

app.get('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/');
});

app.get('/admin', sessionValidation, adminAuthorization, async (req, res) => {
	const result = await userCollection.find().project({
		username: 1,
		user_type: 1
	}).toArray();
	res.render("admin", {
		users: result,
		navLinks: navLinks,
		currentURL: url.parse(req.url).pathname
	});

});

app.post('/promote/:username', async (req, res) => {
	const username = req.params.username;
	console.log(`Promoting user ${username} to admin...`);

	await userCollection.updateOne({
		username: username
	}, {
		$set: {
			user_type: 'admin'
		}
	});
	res.redirect('/admin');
});

app.post('/demote/:username', async (req, res) => {
	const username = req.params.username;
	await userCollection.updateOne({
		username: username
	}, {
		$set: {
			user_type: 'user'
		}
	});
	res.redirect('/admin');
});

app.get('/AI', (req, res) => {
	res.render("AI");
})

app.use(express.static(__dirname + "/public"));

app.get("*", (req, res) => {
	res.status(404);
	res.render("404", {
		navLinks: navLinks,
		currentURL: url.parse(req.url).pathname
	});
})

app.listen(port, () => {
	console.log("Node application listening on port " + port);
});
>>>>>>> 7374179/COMP2537_Demo_Code_2/main
