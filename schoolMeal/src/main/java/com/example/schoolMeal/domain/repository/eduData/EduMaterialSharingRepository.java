package com.example.schoolMeal.domain.repository.eduData;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.eduData.EduMaterialSharing;

@Repository
public interface EduMaterialSharingRepository extends JpaRepository<EduMaterialSharing, Long> {

}
