package com.example.schoolMeal.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.ImageUrl;

@Repository
public interface ImageUrlRepository extends JpaRepository<ImageUrl, Long> {

	
}
