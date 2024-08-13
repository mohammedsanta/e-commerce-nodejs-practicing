const express = require('express');
const mongConnect = require('./config/db');
const app = express();
const AuthRoute = require('./routes/authRoutes');
const sendEmail = require('./utils/sendEmail');

mongConnect()

app.use(express.json())
app.use(
express.urlencoded({
    extended: true,
})
)

app.use(AuthRoute)

app.get('/login',(req,res) => {
    res.sendFile(__dirname + '/public/login.html')
})

app.get('/register',(req,res) => {
    res.sendFile(__dirname + '/public/register.html')
})

app.get('/forgotPassword',(req,res) => {
    res.sendFile(__dirname + '/public/forgetPassword.html')
})

app.get('/verifyRestCode',(req,res) => {
    res.sendFile(__dirname + '/public/verifyRestCode.html')
})

app.get('/resetpassword',(req,res) => {
    res.sendFile(__dirname + '/public/resetPassword.html')
})

app.get('/mail',async (req,res) => {

    await sendEmail({
        email: "test@mailna.co",
        subject: "hey",
        message: "a7a"
    })

    res.json('done')


})


app.listen(3000,() => {
    console.log("Server Working")
})