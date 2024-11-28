package com.example.schoolMeal.domain.repository.communityRepository;

import com.example.schoolMeal.domain.entity.communityEntity.ProcessedFood;
import org.springframework.data.jpa.repository.JpaRepository;

// 가공식품 정보 관련 데이터베이스 작업을 처리하는 리포지터리 인터페이스
public interface ProcessedFoodRepository extends JpaRepository<ProcessedFood, Long> {
}
