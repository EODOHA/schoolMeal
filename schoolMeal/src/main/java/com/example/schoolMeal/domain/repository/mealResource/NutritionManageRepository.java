package com.example.schoolMeal.domain.repository.mealResource;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.mealResource.NutritionManage;

@Repository
public interface NutritionManageRepository extends JpaRepository<NutritionManage, Long> {

	// 영양사∙영양교사 필터링
	List<NutritionManage> findByPosition(String position);
}
