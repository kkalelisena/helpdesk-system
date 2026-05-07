package com.helpdesk.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.helpdesk.backend.entity.Ticket;
import com.helpdesk.backend.repository.TicketRepository;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    // Tüm destek taleplerini listeleme metodu
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // Yeni destek talebi oluşturma metodu
    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }
}