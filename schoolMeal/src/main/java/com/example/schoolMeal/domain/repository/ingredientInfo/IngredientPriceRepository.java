package com.example.schoolMeal.domain.repository.ingredientInfo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.schoolMeal.domain.entity.ingredientInfo.IngredientPrice;

@RepositoryRestResource(path = "price")
public interface IngredientPriceRepository extends JpaRepository<IngredientPrice, Long> {
	// 카테고리로 가격정보 검색
	Page<IngredientPrice> findByCategory(@Param("category") String category, Pageable page);
	
	// 상품명으로 가격정보 검색
	Page<IngredientPrice> findByProductNameContainingIgnoreCase(@Param("productName") String productName, Pageable page);
	
	// 생산지로 가격정보 검색
	Page<IngredientPrice> findByProductDistrict(@Param("productDistrict") String productDistrict, Pageable page);
}
