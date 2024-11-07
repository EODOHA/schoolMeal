package com.example.schoolMeal.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.schoolMeal.domain.entity.User;
import com.example.schoolMeal.service.UserService;

@RestController
public class SingupController {

	@Autowired
	private UserService userService;
	
	@PostMapping("/signup")
	public ResponseEntity<Map<String, Object>> signup(@RequestBody User user) {
		Map<String, Object> response = new HashMap<>();
		try {
			userService.registerUser(user);
				// 사용자 등록 시도
			response.put("success", true);
			response.put("message", "회원가입 성공");
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "회원가입 실패: " + e.getMessage());
			return ResponseEntity
					.status(HttpStatus.BAD_REQUEST)
					.body(response);
		}
	}
}
