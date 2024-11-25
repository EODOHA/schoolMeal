package com.example.schoolMeal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.example.schoolMeal.domain.entity.member.Member;
import com.example.schoolMeal.domain.entity.member.Role;
import com.example.schoolMeal.domain.repository.mealInfo.ExpertHistoryRepository;
import com.example.schoolMeal.domain.repository.mealInfo.ExpertQualificationRepository;
import com.example.schoolMeal.domain.repository.mealInfo.MealExpertRepository;
import com.example.schoolMeal.domain.repository.member.MemberRepository;

@SpringBootApplication
@EnableJpaAuditing // Auditing 활성화
@EnableScheduling // 스케쥴러 활성화
public class SchoolMealApplication implements CommandLineRunner {

	private static final Logger logger = LoggerFactory.getLogger(SchoolMealApplication.class);

	@Autowired
	private MemberRepository memberRepository;

	@Autowired
	MealExpertRepository mealExpRepository;

	@Autowired
	ExpertHistoryRepository expHistRepository;

	@Autowired
	ExpertQualificationRepository expQualRepository;

	public static void main(String[] args) {
		SpringApplication.run(SchoolMealApplication.class, args);
		logger.info("Application started");
	}

	@Override
	public void run(String... args) throws Exception {
		memberRepository.save(new Member(
				"어드민",
				"admin", 
				"$2a$10$8cjz47bjbR4Mn8GMg9IZx.vyjhLXR/SKKMSZ9.mP9vpMu0ssKi8GW",
				"admin@admin.com",
				"010-1234-5678",
				Role.ADMIN));
		memberRepository.save(new Member(
				"연계회원",
				"member1", 
				"$2a$12$SIIf/Riy.LSvYwbSBtsLeuiqZMBXHA/nKWhpvIHWS5W/OBUkVo0.y",
				"member1@member1.com",
				"010-7562-3132",
				Role.LINKAGE));
		memberRepository.save(new Member(
				"일반회원",
				"member2", 
				"$2a$12$SIIf/Riy.LSvYwbSBtsLeuiqZMBXHA/nKWhpvIHWS5W/OBUkVo0.y",
				"member2@member2.com",
				"010-4421-7412",
				Role.MEMBER));
		memberRepository.save(new Member(
				"강등회원",
				"member3", 
				"$2a$12$SIIf/Riy.LSvYwbSBtsLeuiqZMBXHA/nKWhpvIHWS5W/OBUkVo0.y",
				"member3@member3.com",
				"010-5124-4884",
				Role.GUEST));

	}

}
