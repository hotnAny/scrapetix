////////////////////////////////////////////////////////////////////////////////////
//
//  script send email from designated account
//
//  by xiangchen@acm.org, v0.0, 10/2017
//
////////////////////////////////////////////////////////////////////////////////////

'use strict'

// print arguments
process.argv.forEach(function(val, index, array) {
    console.log(index + ': ' + val);
});
if (process.argv.length < 6) {
    console.log('usage: node sendmail.js <from> <to> <subject> <body>')
    return
}

const nodemailer = require('nodemailer')
const yaml = require('js-yaml')
const fs = require('fs')

var config = yaml.safeLoad(fs.readFileSync('private.yml', 'utf8'));
const _user = config.user
const _pass = config.pass

if (_user == undefined || _pass == undefined) {
    console.log('you need to create a private.yml file with the following information:\n' + 'smtp: <smtp server of you preferred email service>\n' + 'port: <the port number>\n' + 'user: <your user name>\n' + 'pass: <your password>');
    return
}

let _from = process.argv[2]
let _to = process.argv[3]
let _subject = process.argv[4]
let _html = process.argv[5]

//
//  define transporter
//
let transporter = nodemailer.createTransport({
    host: config.smtp,
    port: config.port,
    secure: false, // true for 465, false for other ports
    auth: {
        user: _user,
        pass: _pass
    }
});

//
//  send mail
//
let sendMail = (_from, _to, _subject, _html) => {
    // setup email data with unicode symbols
    var mailOptions = {
        from: _from, // sender address
        to: _to, // list of receivers
        subject: _subject, // Subject line
        // text: _text, // plain text body
        html: _html // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
};

//
//  main entry
//
sendMail(_from, _to, _subject, _html);