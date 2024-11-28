package com.example.schoolMeal;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.schoolMeal.domain.entity.mealResource.MealPolicyOperation;
import com.example.schoolMeal.domain.repository.mealResource.MealPolicyOperationRepository;

@SpringBootTest
public class MealPolicyTest {
	
	@Autowired
	private MealPolicyOperationRepository mealPolicyRepository;
	
	@Test
	void testJpa() {
		MealPolicyOperation m1 = new MealPolicyOperation();
		m1.setTitle("test1 제목");
		m1.setWriter("test1 작성자");
		m1.setContent("test1 내용");
		m1.setCreatedDate(LocalDateTime.now());
		this.mealPolicyRepository.save(m1);
		
		MealPolicyOperation m2 = new MealPolicyOperation();
		m2.setTitle("test2 제목");
		m2.setWriter("test2 작성자");
		m2.setContent("test2 내용");
		m2.setCreatedDate(LocalDateTime.now());
		this.mealPolicyRepository.save(m2);
	}

}
