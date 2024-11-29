package com.example.schoolMeal.domain.repository.mealCounsel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import com.example.schoolMeal.domain.entity.mealCounsel.MealCounsel;


// 영양 상담 자료실에 대한 데이터베이스 접근을 관리하는 리포지토리 인터페이스.
//JpaRepository를 상속받아 기본적인 CRUD 메서드를 제공
//JpaSpecificationExecutor을 이용하여 동적 쿼리(MealCounselSpecifications)를 지원하도록 수정
@Repository
public interface MealCounselRepository extends JpaRepository<MealCounsel, Long>, JpaSpecificationExecutor<MealCounsel> {

}

