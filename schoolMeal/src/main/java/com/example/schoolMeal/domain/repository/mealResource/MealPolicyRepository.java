package com.example.schoolMeal.domain.repository.mealResource;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.schoolMeal.domain.entity.mealResource.MealPolicy;

public interface MealPolicyRepository extends JpaRepository<MealPolicy, Integer> {
}
