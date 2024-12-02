package com.example.schoolMeal.domain.repository.mealInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.schoolMeal.domain.entity.mealInfo.ExpertHistory;

@RepositoryRestResource(exported = false)
public interface ExpertHistoryRepository extends JpaRepository<ExpertHistory, Long> {
	
	
}

