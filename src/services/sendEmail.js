const nodemailer = require('nodemailer')
const path =require('path')
const hbs = require('nodemailer-express-handlebars')
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'email.deliver.me@gmail.com',
        pass:'superadmin'
    }
});
//  transporter.use("compile",hbs({
//     viewEngine: {
//         extName: '.hbs',
//         partialsDir: path.resolve('./src/services/view/'),
//         layoutsDir: path.resolve('./src/services/view/'),
//         defaultLayout: 'index',
//     },
//     viewPath: path.resolve('./src/services/view/'),
//     extName: '.hbs'
//   })
// );
exports.sendAcceptEmail = (receiver)=>transporter.sendMail({
    from:`"Deliver.me" <email.deliver.me@gmail.com>`,
    to:`${receiver.email}`,
    subject:"Registration accepted !!!",
    text:`Thank you ${to.name},\n\nYour registration request has been accepted !!!`,
   // tempalte:'signature'
},
    (error,info)=>{
    if(error){
        console.log(error)
    }else{
        console.log('Email sent:'+info.response)
    }  
})


exports.sendDeclineEmail=(receiver) => transporter.sendMail({
    from:`"Deliver.me" <email.deliver.me@gmail.com>`,
    to:`${receiver.email}`,
    subject:"Registration declined !!!",
    text:`Thank you ${receiver.name},your registration request has been declined,\n\nSome initials does not correspond our requirements !!!`,
},
    (error,info)=>{
    if(error){
        console.log(error)
    }else{
        console.log('Email sent:'+info.response)
    }  
})

exports.sendInfoSignUp = (signedUp) =>{ transporter.sendMail({
    from:`"Deliver.me" <email.deliver.me@gmail.com>`,
    to:`khorenterhovhannisyan@gmail.com`,
    subject:`${signedUp.name}  ${signedUp.taxNumber?'company':'deliverer'} signed up !!!`,
    text:`Please check registration request from ${signedUp.name},\n\nThank you!!!`,
    tempalte:'index',
},
    (error,info)=>{
    if(error){
        console.log(error)
    }else{
        console.log('Email sent:'+info.response)
    }  
})}

