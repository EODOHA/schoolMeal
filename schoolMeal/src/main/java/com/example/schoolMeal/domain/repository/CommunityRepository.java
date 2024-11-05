package com.example.schoolMeal.domain.repository;

import com.example.schoolMeal.domain.entity.Community;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {

    // 조회수 증가 메서드
    @Transactional
    @Modifying
    @Query("UPDATE Community SET viewCount = viewCount + 1 WHERE id = :id")
    void incrementViewCount(@Param("id") Long id);


    // 제목 검색 + 카테고리
    Page<Community> findByCategoryNameAndTitleContaining(Pageable pageable, String categoryName, String titleKeyword);

    // 내용 검색 + 카테고리
    Page<Community> findByCategoryNameAndContentContaining(Pageable pageable, String categoryName, String contentKeyword);

    // 작성자 이름 검색 + 카테고리
    Page<Community> findByCategoryNameAndAuthorContaining(Pageable pageable, String categoryName, String authorKeyword);
}
