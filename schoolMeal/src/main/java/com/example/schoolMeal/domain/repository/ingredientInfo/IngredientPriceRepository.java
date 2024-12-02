package com.example.schoolMeal.domain.repository.ingredientInfo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.schoolMeal.domain.entity.ingredientInfo.IngredientPrice;

@RepositoryRestResource(path = "price")
public interface IngredientPriceRepository extends JpaRepository<IngredientPrice, Long> {
	// 카테고리로 가격정보 검색
	List<IngredientPrice> findByCategory(@Param("category") String category);
	
	// 상품명으로 가격정보 검색
	List<IngredientPrice> findByProductName(@Param("productName") String productName);
	
	// 생산지로 가격정보 검색
	List<IngredientPrice> findByProductDistrict(@Param("productDistrict") String productDistrict);
}
