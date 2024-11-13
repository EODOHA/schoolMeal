package com.example.schoolMeal.domain.repository;

import com.example.schoolMeal.domain.entity.CommunityCrawling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CommunityCrawlingRepository extends JpaRepository<CommunityCrawling, Long> {
    Page<CommunityCrawling> findByCategory(String category, Pageable pageable);

    // 제목과 카테고리를 기준으로 중복 여부 확인
    boolean existsByTitleAndCategory(String title, String category);
}
