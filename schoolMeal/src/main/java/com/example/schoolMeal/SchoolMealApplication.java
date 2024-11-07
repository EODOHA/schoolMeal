package com.example.schoolMeal;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import com.example.schoolMeal.domain.entity.User;
import com.example.schoolMeal.domain.entity.edudata.NutrEdu;
import com.example.schoolMeal.domain.entity.mealInfo.ExpertHistory;
import com.example.schoolMeal.domain.entity.mealInfo.ExpertQualification;
import com.example.schoolMeal.domain.entity.mealInfo.MealExpert;
import com.example.schoolMeal.domain.entity.mealResource.MealPolicy;
import com.example.schoolMeal.domain.repository.UserRepository;
import com.example.schoolMeal.domain.repository.mealInfo.ExpertHistoryRepository;
import com.example.schoolMeal.domain.repository.mealInfo.ExpertQualificationRepository;
import com.example.schoolMeal.domain.repository.mealInfo.MealExpertRepository;
import com.example.schoolMeal.service.edudata.NutrEduService;
import com.example.schoolMeal.service.mealResource.MealPolicyService;

@SpringBootApplication
@EnableJpaAuditing	//Auditing 활성화
public class SchoolMealApplication implements CommandLineRunner {

	private static final Logger logger = LoggerFactory.getLogger(SchoolMealApplication.class);

	@Autowired
	private UserRepository userRepository;

	@Autowired
	MealExpertRepository mealExpRepository;

	@Autowired
	ExpertHistoryRepository expHistRepository;

	@Autowired
	ExpertQualificationRepository expQualRepository;

	// 급식자료실 - 급식 청책 예시(DB)
	@Autowired
	private MealPolicyService mealPolicyService;

	// 교육 자료 - 영양 및 식생활 교육자료(DB)
	@Autowired
	private NutrEduService nutrEduService;

	public static void main(String[] args) {
		SpringApplication.run(SchoolMealApplication.class, args);
		logger.info("Application started");
	}

	@Override
	public void run(String... args) throws Exception {
		userRepository.save(new User("admin", "$2a$10$8cjz47bjbR4Mn8GMg9IZx.vyjhLXR/SKKMSZ9.mP9vpMu0ssKi8GW", "ADMIN"));
		userRepository.save(new User("user1", "$2a$10$NVM0n8ElaRgg7zWO1CxUdei7vWoPg91Lz2aYavh9.f9q0e4bRadue", "USER"));
		userRepository.save(new User("user2", "$2a$10$NVM0n8ElaRgg7zWO1CxUdei7vWoPg91Lz2aYavh9.f9q0e4bRadue", "USER"));

		// 급식 전문인력 데이터 주입(전문인력, 보유자격, 이력사항)
		MealExpert expert1 = mealExpRepository.save(new MealExpert("test1", "대전", "영양교사", "test1@test.com"));
		MealExpert expert2 = mealExpRepository.save(new MealExpert("test2", "세종", "영양사", "test2@test.com"));
		MealExpert expert3 = mealExpRepository.save(new MealExpert("test3", "충남", "영양교사", "test3@test.com"));

		expHistRepository.save(new ExpertHistory("A 초등학교 근무", expert1));
		expHistRepository.save(new ExpertHistory("D 초등학교 근무", expert1));
		expHistRepository.save(new ExpertHistory("B 중학교 근무", expert2));
		expHistRepository.save(new ExpertHistory("C 고등학교 근무", expert3));

		expQualRepository.save(new ExpertQualification("영양교사 자격증", expert1));
		expQualRepository.save(new ExpertQualification("영양사 자격증", expert2));
		expQualRepository.save(new ExpertQualification("영양교사 자격증", expert2));
		expQualRepository.save(new ExpertQualification("영양교사 자격증", expert3));

		// 급식 자료실 - 급식 청책 예시(DB)
		if (mealPolicyService.mealPolicyList().isEmpty()) {
			MealPolicy mealPolicy1 = new MealPolicy();
			mealPolicy1.setTitle("제목1");
			mealPolicy1.setContent("내용1");
			mealPolicy1.setWriter("작성자1");
			mealPolicy1.setCreatedDate(LocalDateTime.now());
			mealPolicyService.write(mealPolicy1);
		}

		// 교육 자료 - 영양 및 식생활 교육자료(DB)
		if (nutrEduService.nutrEduList().isEmpty()) {
			NutrEdu nutrEdu1 = new NutrEdu();
			nutrEdu1.setTitle("제목1");
			nutrEdu1.setContent("내용1");
			nutrEdu1.setWriter("작성자1");
			nutrEdu1.setCreatedDate(LocalDateTime.now());
			nutrEduService.write(nutrEdu1);
		}
	}
}
