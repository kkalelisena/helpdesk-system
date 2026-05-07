package com.helpdesk.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "Ticket")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ticketId;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String status; // Örn: Açık, İşlemde, Kapalı

    @Column(nullable = false)
    private String priority; // Örn: Düşük, Orta, Yüksek
    
    @Column(name = "attachment_path")
    private String attachmentPath;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "admin_response", columnDefinition = "TEXT")
    private String adminResponse;

    // ==========================================
    // YENİ EKLENEN: MÜŞTERİ ANKETİ (YILDIZ VE YORUM)
    // ==========================================
    @Column(name = "rating")
    private Integer rating; // 1 ile 5 arası yıldız puanı

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback; // Müşterinin değerlendirme yorumu

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "categoryId", nullable = false)
    private Category category;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}