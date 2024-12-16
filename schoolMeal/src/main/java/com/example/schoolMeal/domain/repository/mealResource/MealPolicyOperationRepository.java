package com.example.schoolMeal.domain.repository.mealResource;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.mealResource.MealPolicyOperation;

@Repository
public interface MealPolicyOperationRepository extends JpaRepository<MealPolicyOperation, Long> {

	// 시∙도 교육청 필터링
	List<MealPolicyOperation> findByEduOffice(String eduOffice);
}
