package com.example.schoolMeal.domain.repository.mealInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.mealInfo.MealArchiveFile;

@Repository
public interface MealArchiveFileRepository extends JpaRepository<MealArchiveFile, Long> {
	
}
