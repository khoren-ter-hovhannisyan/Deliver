const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'email.deliver.me@gmail.com',
        pass:'superadmin'
    }
});

const mailOptions={
    from:'email.deliver.me@gmail.com',
    to:'user@gmail.com',
    subject:"",
    text:""
}

transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
        console.log(error)
    }else{
        console.log('Email sent:'+info.response)
    }  
})