package com.example.schoolMeal.domain.repository.ingredientInfo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.schoolMeal.domain.entity.ingredientInfo.HaccpInfo;

@RepositoryRestResource(path="haccp")
public interface HaccpInfoRepository extends JpaRepository<HaccpInfo, Long> {
	// 카테고리로 인증정보 검색
	List<HaccpInfo> findByCategory(@Param("category") String category);
	
	// HACCP 인증번호로 검색
	List<HaccpInfo> findByHaccpDesignationNumber(@Param("haccpDesignationNumber") String haccpDesignationNumber);
	
}
