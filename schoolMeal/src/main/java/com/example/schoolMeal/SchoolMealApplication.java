package com.example.schoolMeal;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.example.schoolMeal.domain.entity.ingredientInfo.HaccpInfo;
import com.example.schoolMeal.domain.entity.ingredientInfo.IngredientPrice;
import com.example.schoolMeal.domain.entity.ingredientInfo.ProductSafety;
import com.example.schoolMeal.domain.entity.mealResource.MenuRecipe;
import com.example.schoolMeal.domain.entity.member.Member;
import com.example.schoolMeal.domain.entity.member.Role;
import com.example.schoolMeal.domain.repository.ingredientInfo.HaccpInfoRepository;
import com.example.schoolMeal.domain.repository.ingredientInfo.IngredientPriceRepository;
import com.example.schoolMeal.domain.repository.ingredientInfo.ProductSafetyRepository;
import com.example.schoolMeal.domain.repository.mealResource.MenuRecipeRepository;
import com.example.schoolMeal.domain.repository.member.MemberRepository;

@SpringBootApplication
@EnableJpaAuditing // Auditing 활성화
@EnableScheduling // 스케쥴러 활성화
public class SchoolMealApplication implements CommandLineRunner {

	private static final Logger logger = LoggerFactory.getLogger(SchoolMealApplication.class);

	@Autowired
	private MemberRepository memberRepository;

	@Autowired
	IngredientPriceRepository priceRepository;

	@Autowired
	HaccpInfoRepository haccpRepository;

	@Autowired
	ProductSafetyRepository safetyRepository;
	
	@Autowired
	MenuRecipeRepository menuRecipeRepository;

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
				"01012345678",
				Role.ADMIN));
		memberRepository.save(new Member(
				"연계회원",
				"member1", 
				"$2a$12$SIIf/Riy.LSvYwbSBtsLeuiqZMBXHA/nKWhpvIHWS5W/OBUkVo0.y",
				"member1@*#%*12VVGd1.com",
				"01075623132",
				Role.LINKAGE));
		memberRepository.save(new Member(
				"일반회원",
				"member2", 
				"$2a$12$SIIf/Riy.LSvYwbSBtsLeuiqZMBXHA/nKWhpvIHWS5W/OBUkVo0.y",
				"member2@*#%*12VVGd2.com",
				"01044217412",
				Role.MEMBER));
		memberRepository.save(new Member(
				"강등회원",
				"member3", 
				"$2a$12$SIIf/Riy.LSvYwbSBtsLeuiqZMBXHA/nKWhpvIHWS5W/OBUkVo0.y",
				"member3@*#%*12VVGd3.com",
				"01051244884",
				Role.GUEST));
		
		IngredientPrice product1 = new IngredientPrice();
        product1.setCategory("농산물");
        product1.setProductName("쌀");
        product1.setGrade("상");
        product1.setProductDistrict("경기도");
        product1.setProductPrice(45000);
        product1.setEntryDate(LocalDate.of(2024, 11, 28));

        IngredientPrice product2 = new IngredientPrice();
        product2.setCategory("수산물");
        product2.setProductName("광어");
        product2.setGrade("특");
        product2.setProductDistrict("전라남도");
        product2.setProductPrice(25000);
        product2.setEntryDate(LocalDate.of(2024, 11, 28));

        IngredientPrice product3 = new IngredientPrice();
        product3.setCategory("축산물");
        product3.setProductName("돼지고기");
        product3.setGrade("중");
        product3.setProductDistrict("충청남도");
        product3.setProductPrice(12000);
        product3.setEntryDate(LocalDate.of(2024, 11, 28));

        priceRepository.save(product1);
        priceRepository.save(product2);
        priceRepository.save(product3);
        
        HaccpInfo cert1 = HaccpInfo.builder()
                .haccpDesignationNumber("2024-01-0001")
                .category("농산물")
                .businessName("농업회사 A")
                .address("서울시 마포구")
                .productName("쌀")
                .businessStatus("영업중")
                .certificationEndDate(LocalDate.of(2025, 12, 31))
                .build();

        HaccpInfo cert2 = HaccpInfo.builder()
                .haccpDesignationNumber("2024-01-0002")
                .category("축산물")
                .businessName("축산업체 B")
                .address("경기도 안양시")
                .productName("돼지고기")
                .businessStatus("영업중")
                .certificationEndDate(LocalDate.of(2026, 5, 15))
                .build();

        HaccpInfo cert3 = HaccpInfo.builder()
                .haccpDesignationNumber("2024-01-0003")
                .category("수산물")
                .businessName("수산업체 C")
                .address("부산시 해운대구")
                .productName("광어")
                .businessStatus("영업중")
                .certificationEndDate(LocalDate.of(2025, 7, 20))
                .build();

        haccpRepository.save(cert1);
        haccpRepository.save(cert2);
        haccpRepository.save(cert3);
        
        ProductSafety inspection1 = ProductSafety.builder()
                .category("농")
                .productName("쌀")
                .producer("경기도 농부")
                .safetyResult("합격")
                .inspector("농산물 검사기관")
                .inspectorMaterial("농약 잔류물")
                .productDistrict("경기도")
                .entryDate(LocalDate.of(2024, 11, 28))
                .build();

        ProductSafety inspection2 = ProductSafety.builder()
                .category("축")
                .productName("돼지고기")
                .producer("축산업체 B")
                .safetyResult("불합격")
                .inspector("축산물 검사기관")
                .inspectorMaterial("항생제 잔류물")
                .productDistrict("충청남도")
                .entryDate(LocalDate.of(2024, 11, 28))
                .build();

        ProductSafety inspection3 = ProductSafety.builder()
                .category("수")
                .productName("광어")
                .producer("수산업체 C")
                .safetyResult("합격")
                .inspector("수산물 검사기관")
                .inspectorMaterial("중금속")
                .productDistrict("전라남도")
                .entryDate(LocalDate.of(2024, 11, 28))
                .build();

        safetyRepository.save(inspection1);
        safetyRepository.save(inspection2);
        safetyRepository.save(inspection3);
        
        // MenuRecipe 데이터 삽입 예시
        MenuRecipe menuRecipe1 = new MenuRecipe();
        menuRecipe1.setContent("쌀밥, 돼지고기 볶음, 김치");
        menuRecipe1.setTitle("점심 메뉴");
        menuRecipe1.setWriter("이순신");
        menuRecipe1.setAgeGroup("20대");
        menuRecipe1.setSeason("winter");
        menuRecipe1.setCreatedDate(LocalDateTime.now());
        menuRecipe1.setFileUrl(null);  // 파일은 null로 설정
        
        MenuRecipe menuRecipe2 = new MenuRecipe();
        menuRecipe2.setContent("광어회, 미소된장국, 시금치 무침");
        menuRecipe2.setTitle("저녁 메뉴");
        menuRecipe2.setWriter("홍길동");
        menuRecipe2.setAgeGroup("30대");
        menuRecipe2.setSeason("autumn");
        menuRecipe2.setCreatedDate(LocalDateTime.now());
        menuRecipe2.setFileUrl(null);  // 파일은 null로 설정

        MenuRecipe menuRecipe3 = new MenuRecipe();
        menuRecipe3.setContent("김치찌개, 계란말이, 밥");
        menuRecipe3.setTitle("아침 메뉴");
        menuRecipe3.setWriter("김유신");
        menuRecipe3.setAgeGroup("40대 이상");
        menuRecipe3.setSeason("spring");
        menuRecipe3.setCreatedDate(LocalDateTime.now());
        menuRecipe3.setFileUrl(null);  // 파일은 null로 설정

        MenuRecipe menuRecipe4 = new MenuRecipe();
        menuRecipe4.setContent("불고기, 된장찌개, 밥");
        menuRecipe4.setTitle("점심 메뉴");
        menuRecipe4.setWriter("유재석");
        menuRecipe4.setAgeGroup("10대");
        menuRecipe4.setSeason("four_seasons");
        menuRecipe4.setCreatedDate(LocalDateTime.now());
        menuRecipe4.setFileUrl(null);  // 파일은 null로 설정

        menuRecipeRepository.save(menuRecipe1);
        menuRecipeRepository.save(menuRecipe2);
        menuRecipeRepository.save(menuRecipe3);
        menuRecipeRepository.save(menuRecipe4);

	}
}
