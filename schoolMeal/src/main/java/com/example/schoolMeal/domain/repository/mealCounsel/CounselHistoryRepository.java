package com.example.schoolMeal.domain.repository.mealCounsel;
//영양상담기록 repository
//JpaRepository를 상속받아 기본적인 CRUD 메서드를 제공
//JpaSpecificationExecutor을 이용하여 동적 쿼리(MealCounselSpecifications)를 지원하도록 수정
import com.example.schoolMeal.domain.entity.mealCounsel.CounselHistory;
//import com.example.schoolMeal.domain.entity.mealCounsel.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

//import java.time.LocalDate;
//import java.util.List;

@Repository
public interface CounselHistoryRepository extends JpaRepository<CounselHistory, Long>, JpaSpecificationExecutor<CounselHistory> {
//제작중
//    List<CounselHistory> findBySchoolAndCounselDateBetween(School school, LocalDate startDate, LocalDate endDate);
//
//    int countBySchoolInAndCounselDateBetween(List<School> schools, LocalDate startDate, LocalDate endDate);
}