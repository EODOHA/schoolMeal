package com.example.schoolMeal.domain.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.schoolMeal.domain.entity.mealInfo.ExpertHistory;
import com.example.schoolMeal.domain.entity.mealInfo.ExpertQualification;
import com.example.schoolMeal.domain.entity.mealInfo.MealExpert;
import com.example.schoolMeal.domain.repository.mealInfo.MealExpertRepository;

@SpringBootTest
public class MealExpertRepositoryTest {

	@Autowired
	MealExpertRepository mealExpRepository;

	
	@Test
	void expertCascadeTest() {  // 급식전문인력 연관관계, 영속성 전의 테스트
		
		MealExpert expert1 = new MealExpert();
		expert1.setExp_name("test1");
		expert1.setExp_department("대전");
		expert1.setExp_position("영양교사");
		expert1.setExp_email("test1@test.com");
	
		MealExpert expert2 = new MealExpert();
		expert2.setExp_name("test2");
		expert2.setExp_department("세종");
		expert2.setExp_position("영양사");
		expert2.setExp_email("test2@test.com");
	
		MealExpert expert3 = new MealExpert();
		expert3.setExp_name("test3");
		expert3.setExp_department("대전");
		expert3.setExp_position("영양교사");
		expert3.setExp_email("test3@test.com");
		
		mealExpRepository.save(expert1);
		mealExpRepository.save(expert2);
		mealExpRepository.save(expert3);
		
		// 각각의 전문가에 대해 2개의 이력과 자격을 추가(test)
		
		//이력 추가
		for (int i = 1; i <= 2; i++) {
		    ExpertHistory history1 = new ExpertHistory();
		    history1.setExp_hist_history("근무 이력 " + i + " for expert1");
		    history1.setMealExpert(expert1);
		    expert1.getHistories().add(history1); 
		    ExpertHistory history2 = new ExpertHistory();
		    history2.setExp_hist_history("근무 이력 " + i + " for expert2");
		    history2.setMealExpert(expert2);
		    expert2.getHistories().add(history2); 

		    ExpertHistory history3 = new ExpertHistory();
		    history3.setExp_hist_history("근무 이력 " + i + " for expert3");
		    history3.setMealExpert(expert3);
		    expert3.getHistories().add(history3); 
		}

		// 자격 추가
		for (int i = 1; i <= 2; i++) {
		    ExpertQualification qualification1 = new ExpertQualification();
		    qualification1.setExp_qual_qualification("자격증 " + i + " for expert1");
		    qualification1.setMealExpert(expert1);
		    expert1.getQualifications().add(qualification1); 
		    ExpertQualification qualification2 = new ExpertQualification();
		    qualification2.setExp_qual_qualification("자격증 " + i + " for expert2");
		    qualification2.setMealExpert(expert2);
		    expert2.getQualifications().add(qualification2);

		    ExpertQualification qualification3 = new ExpertQualification();
		    qualification3.setExp_qual_qualification("자격증 " + i + " for expert3");
		    qualification3.setMealExpert(expert3);
		    expert3.getQualifications().add(qualification3); 
		}

		mealExpRepository.save(expert1);
		mealExpRepository.save(expert2);
		mealExpRepository.save(expert3);
	}
	
}
