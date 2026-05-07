package com.helpdesk.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.helpdesk.backend.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
}
