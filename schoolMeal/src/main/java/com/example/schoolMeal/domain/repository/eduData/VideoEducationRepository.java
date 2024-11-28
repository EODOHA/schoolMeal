package com.example.schoolMeal.domain.repository.eduData;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.eduData.VideoEducation;

@Repository
public interface VideoEducationRepository extends JpaRepository<VideoEducation, Long> {

    // 제목으로 중복 확인 (중복된 제목이 있으면 반환)
    Optional<VideoEducation> findByTitle(String title);

}
