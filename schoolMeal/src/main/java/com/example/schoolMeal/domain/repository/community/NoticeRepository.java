package com.example.schoolMeal.domain.repository.community;

import com.example.schoolMeal.domain.entity.community.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

// 공지사항 관련 데이터베이스 작업을 처리하는 리포지토리 인터페이스
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    // JpaRepository를 상속받아 notice엔터티와 관련된 기본적인 CRUD 메서드들을 자동으로 제공받을 수 있음
    // 이후 다른 리포지토리들도 같은 방식
    // ex) save(), findById(), findAll() 등과 같은 메서드들
}