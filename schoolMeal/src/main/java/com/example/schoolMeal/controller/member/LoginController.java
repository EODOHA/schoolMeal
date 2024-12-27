package com.example.schoolMeal.controller.member;

import java.util.HashMap;
import java.util.Map;

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

import com.example.schoolMeal.domain.entity.member.Role;
import com.example.schoolMeal.dto.loginResponse.LoginResponseDto;
import com.example.schoolMeal.dto.member.AccountCredentialsDto;
import com.example.schoolMeal.exception.AccountLockedException;
import com.example.schoolMeal.exception.UserNotFoundException;
import com.example.schoolMeal.service.JwtService;
import com.example.schoolMeal.service.member.MemberService;

@RestController
public class LoginController {

	@Autowired
	private JwtService jwtService;
	
	@Autowired
	AuthenticationManager authenticationManager;
	
	@Autowired
	private MemberService memberService;
	
	@RequestMapping(value="/login", method=RequestMethod.POST)
	public ResponseEntity<?> getToken(@RequestBody AccountCredentialsDto credentials) {
		LoginResponseDto response = new LoginResponseDto();
		try {
			// 사용자 존재 여부 체크
			boolean isAuthenticated = memberService.checkMember(credentials.getMemberId(), credentials.getPassword());
			
			if (isAuthenticated) {
				// 인증 및 패스워드 인코더
				UsernamePasswordAuthenticationToken creds = new UsernamePasswordAuthenticationToken(
						credentials.getMemberId(),
						credentials.getPassword());
				Authentication auth = authenticationManager.authenticate(creds);
				
				// 사용자 role 가져오기
				Role role = memberService.getMemberRole(credentials.getMemberId());
				
				// 인증 성공 시, 토큰 생성
				String jwts = jwtService.getToken(auth.getName(), role);
				
				// 이메일, 카카오 인증 여부 확인
	            boolean isEmailVerified = memberService.isEmailVerified(credentials.getMemberId());
	            boolean isKakaoVerified = memberService.isKakaoVerified(credentials.getMemberId());
				
				response.setSuccess(true);
				response.setToken(jwts);
				response.setRole(role.name());
				response.setEmailVerified(isEmailVerified);
				response.setKakaoVerified(isKakaoVerified);
				return ResponseEntity.ok(response);
			} else {
				response.setSuccess(false);
				response.setError("아이디나 비밀번호를 확인해 주세요!");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
			}
		} catch (UserNotFoundException e) {
            response.setSuccess(false);
            response.setError(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		} catch (AccountLockedException e) {
	        response.setSuccess(false);
	        response.setError(e.getMessage());

	        // HashMap 사용으로 JSON 응답 생성
	        HashMap<String, Object> responseMap = new HashMap<>();
	        responseMap.put("error", e.getMessage());
	        responseMap.put("ban_until", memberService.getBanUntil(credentials.getMemberId()));
	        responseMap.put("failed_attempts", memberService.getFailedAttempts(credentials.getMemberId()));

	        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(responseMap);  // 응답 객체를 JSON으로 보냄	
        } catch (Exception e) {
            response.setSuccess(false);
            response.setError("An error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
	}
}
