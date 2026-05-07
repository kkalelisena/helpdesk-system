package com.helpdesk.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.helpdesk.backend.entity.Ticket;
import com.helpdesk.backend.repository.TicketRepository;
import com.helpdesk.backend.service.EmailService;
import com.helpdesk.backend.service.TicketService;

@CrossOrigin 
@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;
    @Autowired
    private EmailService emailService;

    @Autowired
    private TicketRepository ticketRepository; 

    @GetMapping("/all")
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Ticket>> getUserTickets(@PathVariable int userId) {
        List<Ticket> tickets = ticketRepository.findByUserUserId(userId);
        return ResponseEntity.ok(tickets);
    }

    @PostMapping("/{ticketId}/upload")
    public ResponseEntity<String> uploadFile(@PathVariable int ticketId, @RequestParam("file") MultipartFile file) {
        try {
            String uploadDirectory = "uploads/";
            Path uploadPath = Paths.get(uploadDirectory);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
            if (ticketOpt.isPresent()) {
                Ticket ticket = ticketOpt.get();
                ticket.setAttachmentPath(fileName);
                ticketRepository.save(ticket);
                return ResponseEntity.ok("Dosya başarıyla yüklendi: " + fileName);
            } else {
                return ResponseEntity.badRequest().body("Bilet bulunamadı!");
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Dosya kaydedilirken hata oluştu!");
        }
    }

   @PutMapping("/{ticketId}/reply")
    public ResponseEntity<?> replyToTicket(@PathVariable int ticketId, @RequestBody Map<String, String> payload) {
        String adminResponse = payload.get("adminResponse");
        
        Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
        if (ticketOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();
            ticket.setAdminResponse(adminResponse);
            ticket.setStatus("Kapalı");
            ticketRepository.save(ticket);

            // ==========================================
            // YENİ EKLENEN: BİLET KAPANINCA MAİL AT
            // ==========================================
            try {
                // Eğer User entity'sinde email getEmail() ile alınıyorsa:
                String customerEmail = ticket.getUser().getEmail(); 
                String customerName = ticket.getUser().getFullName();
                
                // Postacıyı çağırıp maili yolluyoruz
                emailService.sendTicketReplyEmail(customerEmail, customerName, ticketId);
            } catch (Exception e) {
                System.out.println("Mail gönderilirken bir hata oluştu: " + e.getMessage());
                // Mail gitmese bile bilet kapanmış sayılır, sistemi çökertmeyiz.
            }

            return ResponseEntity.ok(ticket);
        } else {
            return ResponseEntity.badRequest().body("Bilet bulunamadı!");
        }
    }

    // ==========================================
    // YENİ EKLENEN: MÜŞTERİ DEĞERLENDİRME KAPISI
    // ==========================================
    @PutMapping("/{ticketId}/rate")
    public ResponseEntity<?> rateTicket(@PathVariable int ticketId, @RequestBody Map<String, String> payload) {
        try {
            int rating = Integer.parseInt(payload.get("rating"));
            String feedback = payload.get("feedback");

            Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
            if (ticketOpt.isPresent()) {
                Ticket ticket = ticketOpt.get();
                ticket.setRating(rating);
                ticket.setFeedback(feedback);
                ticketRepository.save(ticket);
                return ResponseEntity.ok(ticket);
            } else {
                return ResponseEntity.badRequest().body("Bilet bulunamadı!");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Değerlendirme kaydedilirken hata oluştu!");
        }
    }
}