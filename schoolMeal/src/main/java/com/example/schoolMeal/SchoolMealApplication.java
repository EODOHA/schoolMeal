package com.example.schoolMeal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.schoolMeal.domain.entity.User;
import com.example.schoolMeal.domain.repository.UserRepository;

@SpringBootApplication
public class SchoolMealApplication implements CommandLineRunner {
	
	private static final Logger logger = LoggerFactory.getLogger(SchoolMealApplication.class);
	
	@Autowired
	private UserRepository userRepository;
	
	public static void main(String[] args) {
		SpringApplication.run(SchoolMealApplication.class, args);
		logger.info("Application started");
	}
	
	@Override
	public void run(String... args) throws Exception {
		userRepository.save(new User("admin", "$2a$10$8cjz47bjbR4Mn8GMg9IZx.vyjhLXR/SKKMSZ9.mP9vpMu0ssKi8GW", "ADMIN"));
		userRepository.save(new User("user1", "$2a$10$NVM0n8ElaRgg7zWO1CxUdei7vWoPg91Lz2aYavh9.f9q0e4bRadue", "USER"));
		userRepository.save(new User("user2", "$2a$10$NVM0n8ElaRgg7zWO1CxUdei7vWoPg91Lz2aYavh9.f9q0e4bRadue", "USER"));
	}

}
