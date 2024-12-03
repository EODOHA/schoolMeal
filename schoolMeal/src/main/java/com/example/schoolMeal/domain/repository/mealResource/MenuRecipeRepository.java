package com.example.schoolMeal.domain.repository.mealResource;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.mealResource.MenuRecipe;

@Repository
public interface MenuRecipeRepository extends JpaRepository<MenuRecipe, Long> {

	// 연령대 필터링 쿼리
    List<MenuRecipe> findByAgeGroup(String ageGroup);
    
    // 시기별 필터링 뭐리
    List<MenuRecipe> findBySeason(String season);
}
