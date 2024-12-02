package com.example.schoolMeal.domain.repository.community;

import com.example.schoolMeal.domain.entity.community.CommunityFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityFileRepository extends JpaRepository<CommunityFile, Long> {
}
