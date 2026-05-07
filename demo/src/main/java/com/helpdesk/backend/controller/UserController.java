package com.helpdesk.backend.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping; // YENİ: Postacıyı buraya da çağırdık
import org.springframework.web.bind.annotation.RestController;

import com.helpdesk.backend.entity.Role;
import com.helpdesk.backend.entity.User;
import com.helpdesk.backend.repository.RoleRepository;
import com.helpdesk.backend.repository.TicketRepository;
import com.helpdesk.backend.repository.UserRepository;
import com.helpdesk.backend.service.EmailService;

@CrossOrigin
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TicketRepository ticketRepository; 

    @Autowired
    private RoleRepository roleRepository; 

    // YENİ EKLENDİ: Mail atabilmek için
    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User foundUser = userRepository.findByEmail(user.getEmail());
        if (foundUser != null && foundUser.getPassword().equals(user.getPassword())) {
            return ResponseEntity.ok(foundUser);
        }
        return ResponseEntity.badRequest().body("E-posta veya şifre hatalı!");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Bu e-posta adresi zaten kullanımda!");
        }

        try {
            Optional<Role> roleOpt = roleRepository.findById(2); // 2: Müşteri Rolü
            if (roleOpt.isPresent()) {
                user.setRole(roleOpt.get());
            } else {
                return ResponseEntity.badRequest().body("Sistemde müşteri rolü (ID:2) bulunamadı.");
            }
            return ResponseEntity.ok(userRepository.save(user));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Veritabanına kaydedilirken hata oluştu.");
        }
    }

    // ==========================================
    // GERİ GETİRİLEN: ŞİFREMİ UNUTTUM (MAİLLİ VERSİYON)
    // ==========================================
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        User foundUser = userRepository.findByEmail(email);
        
        if (foundUser != null) {
            try {
                // Postacıyı kullanıp şifreyi mail atıyoruz
                org.springframework.mail.SimpleMailMessage message = new org.springframework.mail.SimpleMailMessage();
                message.setFrom("destek@helpdesk.com");
                message.setTo(foundUser.getEmail());
                message.setSubject("Helpdesk Sistem Şifreniz");
                message.setText("Merhaba " + foundUser.getFullName() + ",\n\n"
                        + "Sistemde kayıtlı şifreniz: " + foundUser.getPassword() + "\n\n"
                        + "Güvenliğiniz için sisteme giriş yaptıktan sonra Profil sayfasından şifrenizi değiştirmenizi öneririz.");
                
                emailService.getMailSender().send(message);
                return ResponseEntity.ok("Şifreniz e-posta adresinize gönderildi!");
            } catch (Exception e) {
                // Eğer mail ayarlarında (internet vs.) sorun olursa direkt ekrana da basalım (dünkü gibi çalışsın)
                return ResponseEntity.ok("Mail gönderilemedi. Şifreniz: " + foundUser.getPassword());
            }
        }
        return ResponseEntity.badRequest().body("Bu e-posta sistemde kayıtlı değil!");
    }

    @PutMapping("/{userId}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable int userId, @RequestBody Map<String, String> payload) {
        String newPassword = payload.get("newPassword");
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(newPassword);
            userRepository.save(user);
            return ResponseEntity.ok("Şifre başarıyla güncellendi.");
        }
        return ResponseEntity.badRequest().body("Kullanıcı bulunamadı.");
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable int userId) {
        try {
            ticketRepository.deleteByUserUserId(userId);
            userRepository.deleteById(userId);
            return ResponseEntity.ok("Hesabınız ve tüm verileriniz kalıcı olarak silindi.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Hesap silinirken bir hata oluştu.");
        }
    }
}