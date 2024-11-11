package com.example.schoolMeal.domain.repository.mealResource;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.mealResource.MealPolicy;

@Repository
public interface MealPolicyRepository extends JpaRepository<MealPolicy, Long> {
}
