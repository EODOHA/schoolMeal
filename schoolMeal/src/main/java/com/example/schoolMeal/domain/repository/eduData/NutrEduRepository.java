package com.example.schoolMeal.domain.repository.edudata;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.edudata.NutrEdu;

@Repository
public interface NutrEduRepository extends JpaRepository<NutrEdu, Integer> {

}
