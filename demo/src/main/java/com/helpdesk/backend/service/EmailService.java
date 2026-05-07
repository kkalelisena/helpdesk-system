package com.helpdesk.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // UserController'ın mail gönderebilmesi için gerekli
    public JavaMailSender getMailSender() {
        return this.mailSender;
    }

    // Şifre hatırlatma maili gönderen yeni metot
    public void sendForgotPasswordEmail(String toEmail, String fullName, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("destek@helpdesk.com");
        message.setTo(toEmail);
        message.setSubject("Helpdesk Sistem Şifreniz");
        
        String mailContent = "Merhaba " + fullName + ",\n\n"
                + "Sistemde kayıtlı olan şifreniz: " + password + "\n\n"
                + "Güvenliğiniz için sisteme giriş yaptıktan sonra profil sayfanızdan şifrenizi güncellemenizi öneririz.\n\n"
                + "İyi çalışmalar dileriz.";
        
        message.setText(mailContent);
        mailSender.send(message);
    }

    public void sendTicketReplyEmail(String toEmail, String userName, int ticketId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("destek@helpdesk.com");
        message.setTo(toEmail);
        message.setSubject("Destek Talebiniz Yanıtlandı! (Bilet #" + ticketId + ")");
        
        String mailContent = "Merhaba " + userName + ",\n\n"
                + "#" + ticketId + " numaralı destek talebiniz uzman ekibimiz tarafından incelenmiş ve yanıtlanmıştır.\n\n"
                + "Yanıtı okumak için sisteme giriş yapabilirsiniz.";
        
        message.setText(mailContent);
        mailSender.send(message);
    }
}