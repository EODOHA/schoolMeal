package com.example.schoolMeal.domain.repository.eduData;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.eduData.VideoEducation;

@Repository
public interface VideoEducationRepository extends JpaRepository<VideoEducation, Long> {

}
