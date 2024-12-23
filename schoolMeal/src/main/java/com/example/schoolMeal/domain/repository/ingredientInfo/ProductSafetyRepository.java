package com.example.schoolMeal.domain.repository.ingredientInfo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.schoolMeal.domain.entity.ingredientInfo.ProductSafety;

@RepositoryRestResource(path = "safety")
public interface ProductSafetyRepository extends JpaRepository<ProductSafety, Long> {
	// 카테고리로 검사결과 검색
	Page<ProductSafety> findByCategory(@Param("category") String category, Pageable page);

	// 상품명으로 검사결과 검색
	Page<ProductSafety> findByProductNameContainingIgnoreCase(@Param("productName") String productName, Pageable page);

	// 생산지로 검사결과 검색
	Page<ProductSafety> findByProductDistrict(@Param("productDistrict") String productDistrict, Pageable page);

}
