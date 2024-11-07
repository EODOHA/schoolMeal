package com.example.schoolMeal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.schoolMeal.domain.entity.AccountCredentials;
import com.example.schoolMeal.exception.AccountLockedException;
import com.example.schoolMeal.exception.UserNotFoundException;
import com.example.schoolMeal.service.JwtService;
import com.example.schoolMeal.service.UserService;

@RestController
public class LoginController {

	@Autowired
	private JwtService jwtService;
	
	@Autowired
	AuthenticationManager authenticationManager;
	
	@Autowired
	private UserService userService;
	
	@RequestMapping(value="/login", method=RequestMethod.POST)
	public ResponseEntity<?> getToken(@RequestBody AccountCredentials credentials) {
		try {
			// 사용자 존재 여부 체크
			boolean isAuthenticated = userService.checkUser(credentials.getUsername(), credentials.getPassword());
			
			if (isAuthenticated) {
				// 인증 및 패스워드 인코더
				UsernamePasswordAuthenticationToken creds = new UsernamePasswordAuthenticationToken(
						credentials.getUsername(),
						credentials.getPassword());
				Authentication auth = authenticationManager.authenticate(creds);
				
				// 인증 성공 시, 토큰 생성
				String jwts = jwtService.getToken(auth.getName());
				
				// 생성된 토큰으로, 응답을 생성
				return ResponseEntity.ok()
						.header(HttpHeaders.AUTHORIZATION, "Bearer" + jwts)
						.header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Authorization")
						.build();
			} else {
				// 비밀번호가 틀린 경우.
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
			}
		} catch (UserNotFoundException e) {
			// 사용자 미존재.
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		} catch (AccountLockedException e) {
			// 계정이 잠긴 경우
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
		} catch (Exception e) {
			// 기타 다른 예외 처리
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occured");
		}
		
	}
}
