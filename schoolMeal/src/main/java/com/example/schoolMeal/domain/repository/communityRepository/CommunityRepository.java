package com.example.schoolMeal.domain.repository.communityRepository;

import com.example.schoolMeal.domain.entity.communityEntity.Community;
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

    // 조회수 증가
    @Transactional
    @Modifying
    @Query("UPDATE Community c SET c.viewCount = c.viewCount + 1 WHERE c.id = :id")
    void incrementViewCount(@Param("id") Long id);

    // 카테고리별 게시물 조회
    Page<Community> findByCategoryName(String categoryName, Pageable pageable);

    // 제목 검색
    Page<Community> findByCategoryNameAndTitleContaining(Pageable pageable, String categoryName, String titleKeyword);

    // 내용 검색
    Page<Community> findByCategoryNameAndContentContaining(Pageable pageable, String categoryName, String contentKeyword);

    // 작성자 검색
    Page<Community> findByCategoryNameAndAuthorContaining(Pageable pageable, String categoryName, String authorKeyword);

    // 가공식품 관련 검색 (브랜드명, 제품명 동시 검색 포함)
    @Query("SELECT c FROM Community c WHERE c.categoryName = :categoryName AND " +
            "(c.productName LIKE %:keyword% OR c.brandName LIKE %:keyword%)")
    Page<Community> searchByProductNameOrBrand(
            @Param("categoryName") String categoryName,
            @Param("keyword") String keyword,
            Pageable pageable);

    // 가격 범위 검색
    @Query("SELECT c FROM Community c WHERE c.categoryName = :categoryName AND " +
            "c.originalPrice BETWEEN :minPrice AND :maxPrice")
    Page<Community> findByCategoryNameAndPriceRange(
            @Param("categoryName") String categoryName,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            Pageable pageable);

    // 상세 설명 검색
    Page<Community> findByCategoryNameAndDetailedDescriptionContaining(
            String categoryName, String description, Pageable pageable);
}
