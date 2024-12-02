package com.example.schoolMeal.domain.repository.mealResource;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.mealResource.MealPolicyOperation;

@Repository
public interface MealPolicyOperationRepository extends JpaRepository<MealPolicyOperation, Long> {
}

