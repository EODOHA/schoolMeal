package com.example.schoolMeal.domain.repository.community;

import com.example.schoolMeal.domain.entity.community.CommunityCrawling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityCrawlingRepository extends JpaRepository<CommunityCrawling, Long> {
    // 필요한 쿼리 메서드 추가 가능
}