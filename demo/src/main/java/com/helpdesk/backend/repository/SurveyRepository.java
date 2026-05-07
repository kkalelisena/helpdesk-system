package com.helpdesk.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.helpdesk.backend.entity.Survey;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Integer> {
}
