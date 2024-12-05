package com.example.schoolMeal.domain.repository.community;

import com.example.schoolMeal.domain.entity.community.RegionalCommunity;
import com.example.schoolMeal.domain.entity.community.RegionCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// 지역별 커뮤니티 관련 데이터베이스 작업을 처리하는 리포지토리 인터페이스
public interface RegionalCommunityRepository extends JpaRepository<RegionalCommunity, Long> {
    // 특정 지역의 게시글을 조회하는 메서드
    List<RegionalCommunity> findByRegion(RegionCategory region);
}
