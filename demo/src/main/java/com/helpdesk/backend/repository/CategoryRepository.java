package com.helpdesk.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.helpdesk.backend.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
