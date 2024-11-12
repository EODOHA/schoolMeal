package com.example.schoolMeal.domain.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.schoolMeal.domain.entity.mealInfo.ExpertHistory;
import com.example.schoolMeal.domain.entity.mealInfo.ExpertQualification;
import com.example.schoolMeal.domain.entity.mealInfo.MealExpert;
import com.example.schoolMeal.domain.repository.mealInfo.ExpertHistoryRepository;
import com.example.schoolMeal.domain.repository.mealInfo.ExpertQualificationRepository;
import com.example.schoolMeal.domain.repository.mealInfo.MealExpertRepository;

@SpringBootTest
public class MealExpertRepositoryTest {

	@Autowired
	MealExpertRepository mealExpRepository;
	@Autowired
	ExpertHistoryRepository expHistRepository;
	@Autowired
	ExpertQualificationRepository expQualRepository;

	@Test
	void expertCascadeTest() { // 급식전문인력 연관관계, 영속성 전의 테스트

		for (int i = 1; i <= 3; i++) {
			// MealExpert 객체 생성
			MealExpert expert = new MealExpert();

			// 동적으로 값 설정
			expert.setExp_name("expert" + i);
			expert.setExp_department("dep" + i);
			expert.setExp_position("position" + i);
			expert.setExp_email("expert" + i + "@test.com");

			// 전문가 데이터 저장
			mealExpRepository.save(expert);

			// 이력 추가
			for (int j = 1; j <= 2; j++) {
				ExpertHistory history = new ExpertHistory();
				history.setExp_hist_history("근무 이력 " + j + " for expert" + i);
				history.setMealExpert(expert);
				expert.getHistories().add(history);
				expHistRepository.save(history);
			}

			// 자격 추가
			for (int k = 1; k <= 2; k++) {
				ExpertQualification qualification = new ExpertQualification();
				qualification.setExp_qual_qualification("자격증 " + k + " for expert" + i); // 자격증 1 for expert1, 2 for
																							// expert2 등
				qualification.setMealExpert(expert);
				expert.getQualifications().add(qualification);
				expQualRepository.save(qualification);
			}
		}
	}
}