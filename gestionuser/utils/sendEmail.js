const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    let htmlContent;

    // Check the type of email to send
    if (options.type === 'verification') {
        htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                <h2 style="text-align: center; color: #333;">Vérification de votre adresse email</h2>
                <p>Bonjour ${options.name},</p>
                <p>Merci de vous être inscrit sur notre plateforme ! Veuillez vérifier votre adresse email en utilisant le code suivant :</p>
                <div style="text-align: center; margin: 20px 0;">
                    <span style="font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 2px solid #4CAF50; border-radius: 5px; display: inline-block;">
                        ${options.verificationToken}
                    </span>
                </div>
                <p>Ce code expirera dans 24 heures.</p>
                <p>Si vous n'avez pas créé de compte sur notre plateforme, vous pouvez ignorer cet email.</p>
                <p>Merci,<br>L'équipe Planify</p>
            </div>
        `;
    } else {
        // Default to password reset email
        htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                <h2 style="text-align: center; color: #333;">Réinitialisation de votre mot de passe</h2>
                <p>Bonjour ${options.name},</p>
                <p>Nous avons reçu une demande de réinitialisation de votre mot de passe. Utilisez le code suivant pour finaliser le processus :</p>
                <div style="text-align: center; margin: 20px 0;">
                    <span style="font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 2px solid #4CAF50; border-radius: 5px; display: inline-block;">
                        ${options.resetToken}
                    </span>
                </div>
                <p>Ce code expirera dans 10 minutes.</p>
                <p>Si vous n'avez pas fait cette demande, vous pouvez ignorer cet email.</p>
                <p>Merci,<br>L'équipe Planify</p>
            </div>
        `;
    }

    const mailOptions = {
        from: `Planify <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: htmlContent
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;