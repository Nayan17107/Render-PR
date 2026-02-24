const bcrypt = require('bcrypt')
const adminModel = require('../model/admin.model')
const otpgenerator = require('otp-generator')
const sendMail = require('../Middleware/sendmail')

exports.loginPage = async (req, res) => {
    try {
        res.render('auth/login')
    } catch (error) {
        console.log(error)
    }
}


exports.login = async (req, res) => {
    try {
        req.flash('success', 'Login Success')
        res.redirect('/')
    } catch (error) {

        console.log(error)
        res.redirect('/user/login')
    }
}


exports.logOut = async (req, res) => {
    try {
        req.flash('success', 'logout Success')
        req.session.destroy(() => {
            res.redirect('/user/login')
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.profilePage = (req, res) => {
    res.render('profile')
}

exports.changepasswordpage = async (req, res) => {
    try {
        res.render('auth/changePassword')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.changepassword = async (req, res) => {
    try {
        let { oldpassword, newpassword, confirmpassword } = req.body
        let user = req.user
        let comparepassword = await bcrypt.compare(oldpassword, user.password)
        if (!comparepassword) {
            req.flash('error', 'old password is Wrong')
            return res.redirect('/user/change-password')
        }

        if (newpassword !== confirmpassword) {
            req.flash('error', 'Confirm Password Not Match');
            return res.redirect('/user/change-password')
        }

        if (oldpassword == newpassword) {
            req.flash('error', 'New password must be different from the old password');
            return res.redirect('/user/change-password')
        }

        let hasepassword = await bcrypt.hash(newpassword, 10)
        console.log(hasepassword)
        let update = await adminModel.findByIdAndUpdate(user._id, {
            password: hasepassword
        }, { new: true })

        req.flash('success', 'Password Update');
        res.redirect('/')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.sentopt = async (req, res) => {
    try {
        let admin = await adminModel.findOne({ email: req.body.email })
        if (!admin) {
            req.flash('error', 'Enter Valid Email')
            res.redirect('/user/login')
        }

        let otp = otpgenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })
        req.session.forgetpassword = {
            email: req.body.email,
            otp: otp
        }
        let message = {
            from: "Prajapatinayan17107@gmail.com",
            to: req.body.email,
            subject: 'Reset Your Password OTP',
            html: `
            <div style="margin:0;padding:0;background:#f4f7fb;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:30px 12px;">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e6ecf5;">
                                <tr>
                                    <td style="background:linear-gradient(135deg,#0f172a,#1e3a8a);padding:26px 28px;color:#ffffff;">
                                        <h1 style="margin:0;font-size:22px;line-height:1.3;font-weight:700;">Password Reset Request</h1>
                                        <p style="margin:8px 0 0 0;font-size:14px;opacity:0.9;">Use the one-time code below to continue.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:28px;">
                                        <p style="margin:0 0 14px 0;font-size:15px;color:#1f2937;">Hello,</p>
                                        <p style="margin:0 0 20px 0;font-size:15px;line-height:1.7;color:#4b5563;">We received a request to reset your account password. Enter this OTP to verify your identity:</p>
                                        <div style="margin:0 auto 24px auto;max-width:280px;text-align:center;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:12px;padding:14px 10px;">
                                            <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:.12em;color:#64748b;text-transform:uppercase;">Your OTP</p>
                                            <p style="margin:0;font-size:34px;letter-spacing:8px;font-weight:700;color:#0f172a;">${otp}</p>
                                        </div>
                                        <p style="margin:0 0 10px 0;font-size:13px;color:#475569;">This OTP is valid for a limited time and can be used only once.</p>
                                        <p style="margin:0;font-size:13px;color:#64748b;">If you did not request this, please ignore this email.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:18px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
                                        <p style="margin:0;font-size:12px;color:#64748b;">Security Tip: Never share your OTP with anyone.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        `
        }
        await sendMail(message)
        // console.log(req.session.forgetpassword)

        res.render('auth/otpverification')
    } catch (error) {
        console.log(error)
        res.redirect('/user/login')
    }
}


exports.verifyotp = async (req, res) => {
    try {
        let { email, otp } = req.session.forgetpassword
        let userotp = req.body.verifyotp
        if (otp !== userotp) {
            req.flash('error', 'Enter Valid Otp')
            return res.render('auth/otpverification')
        }
        res.render('auth/resetpassword')
    } catch (error) {
        console.log(error)
    }
}

exports.resetpasswword = async (req, res) => {
    try {

        // console.log(req.body)

        if (req.body.newpassword !== req.body.confirmpassword) {
            req.flash('error', 'Password Not Match')
            return res.render('auth/resetpassword')
        }
        let haspassword = await bcrypt.hash(req.body.newpassword, 10)
        let email = req.session.forgetpassword.email
        let admin = await adminModel.findOneAndUpdate({ email: email }, {
            password: haspassword
        }, { new: true })
        req.flash('success', 'Password Reset success')
        res.redirect('/user/login')
    } catch (error) {
        console.log(error)
        res.redirect('/user/verifyotp')
    }
}
