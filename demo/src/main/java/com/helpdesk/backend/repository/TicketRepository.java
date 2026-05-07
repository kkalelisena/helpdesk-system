package com.helpdesk.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.helpdesk.backend.entity.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    
    // Kullanıcının biletlerini listelemek için
    List<Ticket> findByUserUserId(int userId);

    // Kullanıcı silinirken ona ait biletleri de temizlemek için
    @Transactional
    void deleteByUserUserId(int userId);
}