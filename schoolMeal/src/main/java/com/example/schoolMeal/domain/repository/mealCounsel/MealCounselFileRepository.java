package com.example.schoolMeal.domain.repository.mealCounsel;

import com.example.schoolMeal.domain.entity.mealCounsel.MealCounselFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


//MealCounselFile에 대한 repositroy
@Repository
public interface MealCounselFileRepository extends JpaRepository<MealCounselFile, Long> {
}

