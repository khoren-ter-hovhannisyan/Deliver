const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'email.deliver.me@gmail.com',
        pass:'superadmin'
    }
});

exports.sendAcceptEmail = (receiver)=>transporter.sendMail({
    from:'email.deliver.me@gmail.com',
    to:`${receiver.email}`,
    subject:"Registration accepted !!!",
    text:`Thank you ${to.name},\nYour registration request has been accepted !!!`
},
    (error,info)=>{
    if(error){
        console.log(error)
    }else{
        console.log('Email sent:'+info.response)
    }  
})


exports.sendDeclineEmail=(receiver) => transporter.sendMail({
    from:'email.deliver.me@gmail.com',
    to:`${receiver.email}`,
    subject:"Registration declined !!!",
    text:`Thank you ${receiver.name},your registration request has been declined,\nSome initials does not correspond our requirements !!!`
},
    (error,info)=>{
    if(error){
        console.log(error)
    }else{
        console.log('Email sent:'+info.response)
    }  
})

exports.sendInfoSignUp = (signedUp) =>{ transporter.sendMail({
    from:'email.deliver.me@gmail.com',
    to:`khorenterhovhannisyan@gmail.com`,
    subject:`${signedUp.name}  ${signedUp.taxNumber?'company':'deliverer'} signed up !!!`,
    text:`Please check registration request from ${signedUp.name},\nThank you!!!`
},
    (error,info)=>{
    if(error){
        console.log(error)
    }else{
        console.log('Email sent:'+info.response)
    }  
})}

