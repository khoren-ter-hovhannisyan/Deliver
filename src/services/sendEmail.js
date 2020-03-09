const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'email.deliver.me@gmail.com',
    pass: 'superadmin',
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
})

const signature = `<div>
<h3><b><i>Best Regards,</i></b></h3>
<h3><b><i>Deliver.me team</i></b></h3>
<img height="150px"  src="http://res.cloudinary.com/dfeoo5iog/image/upload/v1582890290/ljmmfhjkbd2e1gmoxssl.png">
</div>`

const link = 'https://delivermearmenia.herokuapp.com/'

exports.sendAcceptEmail = receiver =>
  transporter.sendMail(
    {
      from: `"Deliver.me" <email.deliver.me@gmail.com>`,
      to: `${receiver.email}`,
      subject: 'Registration accepted !!!',
      html: `Thank you ${receiver.name},
      Your registration request has been accepted !!!
      Please follow the link ${link} to login!
      ${signature}`,
    },
    (error, info) => {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent:' + info.response)
      }
    }
  )

exports.sendDeclineEmail = receiver =>
  transporter.sendMail(
    {
      from: `"Deliver.me" <email.deliver.me@gmail.com>`,
      to: `${receiver.email}`,
      subject: 'Registration declined !!!',
      html: `Thank you ${receiver.name},your registration request has been declined,
      Some initials does not correspond our requirements !!!
      ${signature}`,
    },
    (error, info) => {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent:' + info.response)
      }
    }
  )

exports.sendInfoSignUp = signedUp => {
  transporter.sendMail(
    {
      from: `"Deliver.me" <email.deliver.me@gmail.com>`,
      to: `anigevorgyan0@gmail.com`,
      subject: `${signedUp.name}  ${
        signedUp.taxNumber ? 'company' : 'deliverer'
      } signed up !!!`,
      html: `Please check registration request from ${signedUp.name},<br>
            Thank you!!!
            ${signature}`,
    },
    (error, info) => {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent:' + info.response)
      }
    }
  )
}

exports.sendWaitEmailForReceiver = receiver =>
  transporter.sendMail(
    {
      from: `"Deliver.me" <email.deliver.me@gmail.com>`,
      to: `${receiver.email}`,
      subject: 'Thank you for registration !!!',
      html: `Thank you ${receiver.name},
      Your registration request is pending,<br>
      please wait for a while and administration will check your initials <br>
      ${signature}`,
    },
    (error, info) => {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent:' + info.response)
      }
    }
  )

exports.sendAcceptOrderEmail = (receiver, user) =>
  transporter.sendMail(
    {
      from: `"Deliver.me" <email.deliver.me@gmail.com>`,
      to: `${receiver.email}`,
      subject: 'Registration accepted !!!',
      html: `Dear ${receiver.name} ,
      Your order has been accepted by ${user.name} !!!
      Here is the  courier info \`
      ${user.name} ${user.lastName}
      email: ${user.email}
      phone: ${user.email}

      ${signature}`,
    },
    (error, info) => {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent:' + info.response)
      }
    }
  )

exports.sendDoneOrderEmail = (receiver, user) =>
  transporter.sendMail(
    {
      from: `"Deliver.me" <email.deliver.me@gmail.com>`,
      to: `${receiver.email}`,
      subject: 'Registration accepted !!!',
      html: `Dear ${receiver.name} ,
      Your order has been Done by ${user.name} !!!
      Here is the  courier info \`
      ${user.name} ${user.lastName}
      email: ${user.email}
      phone: ${user.email}

      ${signature}`,
    },
    (error, info) => {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent:' + info.response)
      }
    }
  )
