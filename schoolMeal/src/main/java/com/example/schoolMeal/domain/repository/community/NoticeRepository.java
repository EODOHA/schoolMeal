package com.example.schoolMeal.domain.repository.community;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.community.Notice;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {

}
