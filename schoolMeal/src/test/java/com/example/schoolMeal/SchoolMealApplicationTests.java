package com.example.schoolMeal;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.schoolMeal.controller.member.LoginController;

@SpringBootTest
class SchoolMealApplicationTests {

	@Autowired
	private LoginController controller;
	
	@Test
	void contextLoads() {
		assertThat(controller).isNotNull();
	}

}
