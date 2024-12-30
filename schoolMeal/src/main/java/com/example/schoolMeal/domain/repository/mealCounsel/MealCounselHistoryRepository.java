package com.example.schoolMeal.domain.repository.mealCounsel;

//영양상담기록 repository
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.mealCounsel.MealCounselHistory;


@Repository
public interface MealCounselHistoryRepository extends JpaRepository<MealCounselHistory, Long> {

	
}