package com.example.schoolMeal.domain.repository.edudata;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.edudata.EduVideo;

@Repository
public interface EduVideoRepository extends JpaRepository<EduVideo, Integer> {

}
