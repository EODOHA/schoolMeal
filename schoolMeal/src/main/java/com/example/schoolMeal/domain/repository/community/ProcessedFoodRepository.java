package com.example.schoolMeal.domain.repository.community;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.schoolMeal.domain.entity.community.ProcessedFood;

// 가공식품 정보 관련 데이터베이스 작업을 처리하는 리포지터리 인터페이스
@RepositoryRestResource(path = "processedFood")
public interface ProcessedFoodRepository extends JpaRepository<ProcessedFood, Long> {
	Page<ProcessedFood> findByProductNameContainingIgnoreCase(@Param("productName") String productName, Pageable page);
}
