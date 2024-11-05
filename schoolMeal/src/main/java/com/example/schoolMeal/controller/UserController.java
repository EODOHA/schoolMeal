package com.example.schoolMeal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.schoolMeal.domain.entity.User;
import com.example.schoolMeal.domain.repository.UserRepository;

@RestController
public class UserController {

	@Autowired
	UserRepository userRepository;
	
	@RequestMapping("/users")
	public Iterable<User> getUsers() {
		return userRepository.findAll();
	}
}
