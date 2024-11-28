package com.example.schoolMeal.domain.repository.communityRepository;

import com.example.schoolMeal.domain.entity.communityEntity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

// 공지사항 관련 데이터베이스 작업을 처리하는 리포지토리 인터페이스
public interface NoticeRepository extends JpaRepository<Notice, Long> {
}