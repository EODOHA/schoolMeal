package com.example.schoolMeal.domain.repository.communityRepository;

import com.example.schoolMeal.domain.entity.communityEntity.CateringFacility;

import org.springframework.data.jpa.repository.JpaRepository;

// 급식시설 및 가구 정보 관련 데이터베이스 작업을 처리하는 리포지토리 인터페이스
public interface CateringFacilityRepository extends JpaRepository<CateringFacility, Long> {
}