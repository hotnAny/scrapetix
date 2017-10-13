// require('core-js');
require('./xray')

var _checkRedundancy = function() {
	console.log(lsDeals)
	console.log(lsDealsPrev)
	console.log('-')

	var toRemove = []
	var toRemoveFromPrev = []
	for (var i = 0; i < lsDealsPrev.length; i++) {
		var dealPrev = lsDealsPrev[i]
		var stillThere = false
		for (var j = 0; j < lsDeals.length; j++) {
			var deal = lsDeals[j]
			// if (deal.id == dealPrev.id && deal.score == dealPrev.score && deal.priceTags == dealPrev.price) {
			if(deal == dealPrev) {	
				toRemove.push(deal)
				stillThere = true
				break
			}
		}
		if (!stillThere) toRemoveFromPrev.push(dealPrev)
	}

	for (var i = 0; i < toRemove.length; i++)
		lsDeals.remove(toRemove[i])
	for (var i = 0; i < toRemoveFromPrev.length; i++)
		lsDealsPrev.remove(toRemoveFromPrev[i])

	console.log(lsDeals)
	console.log(lsDealsPrev)
	console.log('-')

	console.log('\n')

	lsDealsPrev = lsDealsPrev.concat(lsDeals)
	lsDeals = []
}

var a = 'a',
	b = 'b',
	c = 'c'
lsDeals = [a]
lsDealsPrev = []
_checkRedundancy()
lsDeals = [a, b]
_checkRedundancy()
lsDeals = [a, c]
_checkRedundancy()
lsDeals = [b]
_checkRedundancy()

// var x ='hi'
// var a = [x, 2]
// // console.log(a)
// // a.remove(x)
// for(var elm of a)
// 	console.log(elm)
// var url = 'https://seatgeek.com/islanders-at-penguins-tickets/12-7-2017-pittsburgh-pennsylvania-ppg-paints-arena/nhl/3921026'
// var _getGameId = function(url) {
// 	var idxLastSlash = url.lastIndexOf('/')
// 	return url.substring(idxLastSlash + 1)
// }

// console.log(_getGameId(url))
// var title = 'Bruins vs Penguins Tickets, Nov 24 in Boston | SeatGeek'

// var prefixLoc = 'in'
// var idxLocation = title.indexOf(prefixLoc)
// var strLocation = title.substring(idxLocation)

// var isInPittsburgh = strLocation.indexOf('Pittsburgh')

// console.log(isInPittsburgh)

// var dealScore = 94
// var url = 'https://seatgeek.com/pittsburgh-penguins-tickets';
// var html = '<a href="' + url + '">' + dealScore + '</a>'
// console.log(html)
// var process = require("child_process")
// var spawn = process.spawn
// var execFile = process.execFile

// var _from = '"Tix Scraper 👻" <boo@tixscraper.com>'
// var _to = 'xiangchen@acm.org'
// var _subject = 'Hello world?'
// var _html = '<b>Hello world?</b>'

// var child = spawn('node', ['sendmail.js', _from, _to, _subject, _html])

// child.stdout.on("data", function (data) {
//   console.log("spawnSTDOUT:", JSON.stringify(data))
// })

// child.stderr.on("data", function (data) {
//   console.log("spawnSTDERR:", JSON.stringify(data))
// })

// child.on("exit", function (code) {
//   console.log("spawnEXIT:", code)
// })

//child.kill("SIGKILL")

// execFile("ls", ["-lF", "/usr"], null, function (err, stdout, stderr) {
//   console.log("execFileSTDOUT:", JSON.stringify(stdout))
//   console.log("execFileSTDERR:", JSON.stringify(stderr))
// })

// var process = require("child_process")
// var spawn = process.spawn
// var execFile = process.execFile

// var sendmail = spawn('node', ['sendmail.js', 'yay', 'yay again']);
// // var sendmail = spawn('touch', ['yay again']);
// sendmail.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
// });

// sendmail.stderr.on('data', (data) => {
//     console.log(`stderr: ${data}`);
// });

// sendmail.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
// });


// 'use strict';

// const nodemailer = require('nodemailer');
// const _user = 'anthony.xiangchen';
// const _pass = 'cjrypebzqonpgoas';

// let transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: _user, // generated ethereal user
//         pass: _pass // generated ethereal password
//     }
// });

// let sendMail = (_from, _to, _subject, _text) => {
//     // setup email data with unicode symbols
//     let mailOptions = {
//         from: '"Tix Scraper 👻" <boo@tixscraper.com>', // sender address
//         to: 'xiangchen@acm.org', // list of receivers
//         subject: 'Hello ✔', // Subject line
//         text: 'Hello world?', // plain text body
//         html: '<b>Hello world?</b>' // html body
//     };

//     // send mail with defined transport object
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Message sent: %s', info.messageId);
//         // Preview only available when sending through an Ethereal account
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

//         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
//         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//     });
// };