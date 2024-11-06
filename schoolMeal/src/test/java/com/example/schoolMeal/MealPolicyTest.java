package com.example.schoolMeal;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.schoolMeal.domain.entity.mealResource.MealPolicy;
import com.example.schoolMeal.domain.repository.mealResource.MealPolicyRepository;

@SpringBootTest
public class MealPolicyTest {
	
	@Autowired
	private MealPolicyRepository mealPolicyRepository;
	
	@Test
	void testJpa() {
		MealPolicy m1 = new MealPolicy();
		m1.setTitle("test1 제목");
		m1.setWriter("test1 작성자");
		m1.setContent("test1 내용");
		m1.setCreatedDate(LocalDateTime.now());
		this.mealPolicyRepository.save(m1);
		
		MealPolicy m2 = new MealPolicy();
		m2.setTitle("test2 제목");
		m2.setWriter("test2 작성자");
		m2.setContent("test2 내용");
		m2.setCreatedDate(LocalDateTime.now());
		this.mealPolicyRepository.save(m2);
	}

}
