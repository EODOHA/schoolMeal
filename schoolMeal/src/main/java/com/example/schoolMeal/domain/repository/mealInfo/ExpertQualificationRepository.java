package com.example.schoolMeal.domain.repository.mealInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.schoolMeal.domain.entity.mealInfo.ExpertQualification;

@RepositoryRestResource(exported = false)
public interface ExpertQualificationRepository extends JpaRepository<ExpertQualification, Long> {
}
