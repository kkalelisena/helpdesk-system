package com.helpdesk.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "Survey")
public class Survey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int surveyId;

    @Column(nullable = false)
    private int rating; // 1 ile 5 arası puan

    @Column(length = 500)
    private String comments;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Bu anket hangi bilete ait?
    @OneToOne
    @JoinColumn(name = "ticketId", nullable = false)
    private Ticket ticket;
}
