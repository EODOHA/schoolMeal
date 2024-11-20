package com.example.schoolMeal;

import java.io.File;
import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.common.SimpleMultipartFile;
import com.example.schoolMeal.domain.entity.edudata.NutrEdu;
import com.example.schoolMeal.domain.entity.mealResource.MealPolicy;
import com.example.schoolMeal.domain.entity.mealResource.MenuRecipe;
import com.example.schoolMeal.domain.entity.member.Member;
import com.example.schoolMeal.domain.entity.member.Role;
import com.example.schoolMeal.domain.repository.mealInfo.ExpertHistoryRepository;
import com.example.schoolMeal.domain.repository.mealInfo.ExpertQualificationRepository;
import com.example.schoolMeal.domain.repository.mealInfo.MealExpertRepository;
import com.example.schoolMeal.domain.repository.member.MemberRepository;
import com.example.schoolMeal.service.edudata.NutrEduService;
import com.example.schoolMeal.service.mealResource.MealPolicyService;
import com.example.schoolMeal.service.mealResource.MenuRecipeService;

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

	// 급식자료실 - 급식 청책 예시(DB)
	@Autowired
	private MealPolicyService mealPolicyService;

	// 급식자료실 - 식단 및 레시피 예시(DB)
	@Autowired
	private MenuRecipeService menuRecipeService;

	// 교육 자료 - 영양 및 식생활 교육자료(DB)
	@Autowired
	private NutrEduService nutrEduService;

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

		// 급식 자료실 - 급식 정책 예시(DB)
		if (mealPolicyService.mealPolicyList().isEmpty()) {
			MealPolicy mealPolicy1 = new MealPolicy();
			mealPolicy1.setTitle("제목1");
			mealPolicy1.setContent("내용1");
			mealPolicy1.setWriter("작성자1");
			mealPolicy1.setCreatedDate(LocalDateTime.now());

			// 임시 파일을 생성하여 전달
			File sampleFile = new File("src/main/resources/sample.txt");
			MultipartFile file = new SimpleMultipartFile(sampleFile);

			mealPolicyService.write(mealPolicy1, file);

			for (int i = 2; i < 7; i++) {
				// 반복문 안에서 mealPolicy 객체를 생성
				MealPolicy mealPolicy = new MealPolicy();

				// mealPolicy에 데이터 설정
				mealPolicy.setTitle("제목" + i); // 제목에 i 값 추가
				mealPolicy.setContent("내용" + i);
				mealPolicy.setWriter("작성자" + i);
				mealPolicy.setCreatedDate(LocalDateTime.now());

				// 임시 파일을 넣지 않은 버전
				mealPolicyService.write(mealPolicy, null);
			}

		}

		// 급식 자료실 - 식단 및 레시피 예시(DB)
		if (menuRecipeService.menuRecipeList().isEmpty()) {
			MenuRecipe menuRecipe1 = new MenuRecipe();
			menuRecipe1.setTitle("제목1");
			menuRecipe1.setContent("내용1");
			menuRecipe1.setWriter("작성자1");
			menuRecipe1.setCreatedDate(LocalDateTime.now());

			// 임시 파일을 생성하여 전달
			File sampleFile = new File("src/main/resources/sample.txt");
			MultipartFile file = new SimpleMultipartFile(sampleFile);

			menuRecipeService.write(menuRecipe1, file);

			MenuRecipe menuRecipe2 = new MenuRecipe();
			menuRecipe2.setTitle("제목2");
			menuRecipe2.setContent("내용2");
			menuRecipe2.setWriter("작성자2");
			menuRecipe2.setCreatedDate(LocalDateTime.now());
			menuRecipeService.write(menuRecipe2, null);
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
