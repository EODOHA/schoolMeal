package com.example.schoolMeal.domain.repository.eduData;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.eduData.EduVideo;

import java.util.Optional;

@Repository
public interface EduVideoRepository extends JpaRepository<EduVideo, Long> {

    // 제목으로 중복 확인 (중복된 제목이 있으면 반환)
    Optional<EduVideo> findByTitle(String title);

}
