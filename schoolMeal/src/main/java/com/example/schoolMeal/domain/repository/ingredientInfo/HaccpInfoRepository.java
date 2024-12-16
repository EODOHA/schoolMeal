package com.example.schoolMeal.domain.repository.ingredientInfo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.schoolMeal.domain.entity.ingredientInfo.HaccpInfo;

@RepositoryRestResource(path = "haccp")
public interface HaccpInfoRepository extends JpaRepository<HaccpInfo, Long> {
	// 카테고리로 인증정보 검색(페이지네이션 추가)
	Page<HaccpInfo> findByCategory(@Param("category") String category, Pageable pageable);

	// 업소명으로 검색 (부분일치, 페이지네이션 추가)
	Page<HaccpInfo> findByBusinessNameContainingIgnoreCase(@Param("businessName") String businessName, Pageable pageable);

	// 영업 상태로 검색(페이지네이션 추가)
	Page<HaccpInfo> findByBusinessStatus(@Param("businessStatus") String businessStatus, Pageable pageable);
}
