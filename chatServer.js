/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;
var zodiac = {};
zodiac[1] = [
	[
		[1, 19], 'Capricorn'
	],
	[
		[20, 31], 'Aquarius'
	]
];
zodiac[2] = [
	[
		[1, 18], 'Aquarius'
	],
	[
		[19, 31], 'Pisces'
	]
];
zodiac[3] = [
	[
		[1, 20], 'Pisces'
	],
	[
		[21, 31], 'Aries'
	]
];
zodiac[4] = [
	[
		[1, 19], 'Aries'
	],
	[
		[20, 31], 'Taurus'
	]
];
zodiac[5] = [
	[
		[1, 20], 'Taurus'
	],
	[
		[21, 31], 'Gemini'
	]
];
zodiac[6] = [
	[
		[1, 20], 'Gemini'
	],
	[
		[21, 31], 'Cancer'
	]
];
zodiac[7] = [
	[
		[1, 22], 'Cancer'
	],
	[
		[23, 31], 'Leo'
	]
];
zodiac[8] = [
	[
		[1, 22], 'Leo'
	],
	[
		[23, 31], 'Virgo'
	]
];
zodiac[9] = [
	[
		[1, 22], 'Virgo'
	],
	[
		[23, 31], 'Libra'
	]
];
zodiac[10] = [
	[
		[1, 23], 'Libra'
	],
	[
		[23, 31], 'Scorpio'
	]
];
zodiac[11] = [
	[
		[1, 22], 'Scorpio'
	],
	[
		[22, 31], 'Sagittarius'
	]
];
zodiac[12] = [
	[
		[1, 22], 'Sagittarius'
	],
	[
		[22, 31], 'Capricorn'
	]
];

// Zodiac descriptions from: http://iml.jou.ufl.edu/projects/fall07/Bhimani/thezodiac/zodiacsigns.html
snippet = {}
snippet['Capricorn'] = "The 10th sign of the zodiac, those who are Capricorns are marked by their ambitious nature. They have very active minds and always have to be in control of their lives.";
snippet['Aquarius'] = "Aquarius is the 11th sign of the zodiac. Aquarians don't always care what others think about them. They take each opportunity they have and work towards formulating new ideas.";
snippet['Pisces'] = "Pisces is the 12th and last sign of the zodiac. Those who are Pisces are extremely sensitive and reserved. They like to escape from reality. A Pisces is a very good listener and friend.";
snippet['Aries'] = "Aries is the first sign of the zodiac. Those who are Aries are independent and courageous. They enjoy leading others and bringing excitement into the lives of others. An Aries is enthusiastic and very goal-oriented.";
snippet['Taurus'] = "The second sign of the zodiac, those who are a Taurus are solid and fight for what they want. A Taurus is very easy going but can also be stubborn. A Taurus can be procrastinators but also have a good-work ethic.";
snippet['Gemini'] = "Gemini is the third sign of the zodiac. Geminis have many sides and are known for their energy. They are very talkative and are considered social butterflies. A Gemini will always take their lives in the direction they want to go.";
snippet['Cancer'] = "Cancer is the fourth sign of the zodiac. This sign is marked by inconsistency. They enjoy security but also seek adventure. A Cancer is not very predictable and always keep others guessing.";
snippet['Leo'] = "Leo is the fifth sign in the zodiac. Leos have high self esteem and are very devoted. They are also very kind and generous. A Leo is known for being hot tempered yet forgiving.";
snippet['Virgo'] = "The sixth sign of the zodiac, Virgo is very mind oriented. They are constantly analyzing and thinking. They enjoy bettering themselves and those around them.";
snippet['Libra'] = "The seventh sign of the zodiac, Libras are known for their diplomatic nature. They get along well with everyone and are ambitious. They have very expensive taste and work hard to make money.";
snippet['Scorpio'] = "The eight sign of the zodiac, Scorpios are very intense. They like to question everything and work hard at making sense of things. Scorpios treat others with kindness and loyalty.";
snippet['Sagittarius'] = "The ninth sign of the zodiac, a Sagittarius has a very positive outlook on life. They have vibrant personalities and enjoy meeting new people. They can also be reckless.";

var myzodiac = "";

//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
	console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
	console.log('a new user connected');
	var questionNum = 0; // keep count of question, used for IF condition.
	socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.
		socket.emit('answer', "Hello, I am AstrologyBot, a simple chat bot."); //We start with the introduction;
		setTimeout(timedQuestion, 2500, socket, "What is your Name?"); // Wait a moment and respond with a question.

	});
	socket.on('message', (data) => { // If we get a new message from the client we process it;
		console.log(data);
		questionNum = bot(data, socket, questionNum); // run the bot function with the new message
	});
	socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
		console.log('user disconnected');
	});
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum) {
	var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
	var answer;
	var question;
	var waitTime;
	var aTime = 0;
	var loopback = true;

	while (loopback == true) {
		console.log(questionNum);
		loopback = false;
		/// These are the main statments that make up the conversation.
		if (questionNum == 0) {
			answer = 'Hello ' + input + ' :-)'; // output response
			waitTime = 2000;
			question = 'What is your date of birth? (MM/DD)'; // load next question
		} else if (questionNum == 1) {
			var dob = input.trim().split("/");
			var month = parseInt(dob[0]);
			var day = parseInt(dob[1]);
			var possible = zodiac[month];
			if (day < possible[0][0][1]) {
				myzodiac = possible[0][1];
			} else {
				myzodiac = possible[1][1];
			}
			answer = 'Really, ' + input + '? So that means that your Zodiac sign is ' + myzodiac + '!'; // output response
			waitTime = 4000;
			question = 'Would you like to hear the attributes associated with your sign?'; // load next question
		} else if (questionNum == 2) {
			if (input.toLowerCase() === 'yes' || input === 1) {
				answer = snippet[myzodiac];
				waitTime = 0;
				question = '';
				questionNum++;
				loopback = true;
			} else if (input.toLowerCase() === 'no' || input === 0) {
				answer = 'What a shame!';
				question = '';
				waitTime = 0;
				questionNum++;
				loopback = true;
			} else {
				answer = ' I did not understand you. Please answer with simply with yes or no.'
				question = 'Would you like to hear the attributes associated with your sign?';
				questionNum--;
				waitTime = 2000;
			}
			// load next question
		} else {
			answer = 'I have nothing more to say!'; // output response
			waitTime = 0;
			question = '';
			aTime = 4000;
		}
		/// We take the changed data and distribute it across the required objects.
		setTimeout(timedAnswer, aTime, socket, answer);
		aTime = 0;
		if (question != '') {
			setTimeout(timedQuestion, waitTime, socket, question);
		}
	}
	return (questionNum + 1);
}

function timedAnswer(socket, answer) {
	socket.emit('answer', answer);
}

function timedQuestion(socket, question) {
	socket.emit('question', question);
}
//----------------------------------------------------------------------------//