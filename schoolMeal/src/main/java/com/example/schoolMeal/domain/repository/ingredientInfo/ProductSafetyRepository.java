package com.example.schoolMeal.domain.repository.ingredientInfo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.schoolMeal.domain.entity.ingredientInfo.ProductSafety;

@RepositoryRestResource(path = "safety")
public interface ProductSafetyRepository extends JpaRepository<ProductSafety, Long> {
	// 카테고리로 검사결과 검색
	List<ProductSafety> findByCategory(@Param("category") String category);

	// 상품명으로 검사결과 검색
	List<ProductSafety> findByProductName(@Param("productName") String productName);

	// 생산지로 검사결과 검색
	List<ProductSafety> findByProductDistrict(@Param("productDistrict") String productDistrict);

}
