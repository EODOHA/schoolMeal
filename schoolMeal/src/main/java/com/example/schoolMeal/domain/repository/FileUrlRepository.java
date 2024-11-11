package com.example.schoolMeal.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.FileUrl;

@Repository
public interface FileUrlRepository extends JpaRepository<FileUrl, Long> {

}
