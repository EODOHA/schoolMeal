package com.example.schoolMeal.controller.member;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.example.schoolMeal.domain.entity.member.Member;
import com.example.schoolMeal.dto.member.EmailVerificationRequestDto;
import com.example.schoolMeal.dto.member.MemberSignupDto;
import com.example.schoolMeal.exception.UserNotFoundException;
import com.example.schoolMeal.service.member.MemberService;

import jakarta.validation.Valid;

@RestController
public class SingupController {

	@Autowired
	private MemberService memberService;
	
	@PostMapping("check-duplicate-id")
	public ResponseEntity<Map<String, Object>> checkDuplicateId(@RequestBody Map<String, String> request) {
		String memberId = request.get("memberId");
		
		// 유효성 검사 추가
		if (memberId == null || memberId.trim().isEmpty()) {
			Map<String, Object> response = new HashMap<>();
			response.put("isAvailable", false);
			return ResponseEntity.ok(response);
		}
		
		boolean isAvailable = memberService.isMemberIdAvailable(memberId);
		
		Map<String, Object> response = new HashMap();
		response.put("isAvailable", isAvailable);
		return ResponseEntity.ok(response);
	}
	
	@PostMapping("check-duplicate-email")
	public ResponseEntity<Map<String, Object>> checkDuplicatedEmail(@RequestBody Map<String, String> request) {
		String email = request.get("email");
		
		// 유효성 검사 추가
		if (email == null || email.trim().isEmpty()) {
			Map<String, Object> response = new HashMap<>();
			response.put("isAvailable", false);
			return ResponseEntity.ok(response);
		}
		
		boolean isAvailable = memberService.isEmailAvailable(email);
		
		Map<String, Object> response = new HashMap<>();
		response.put("isAvailable", isAvailable);
		return ResponseEntity.ok(response);
		
	}
	
	// 인증 토큰 전송
	@PostMapping("/send-verification-token")
	public ResponseEntity<Map<String, Object>> sendVerificationCode(@RequestBody Map<String, String> request) {
		String email = request.get("email");
		Map<String, Object> response = new HashMap<>();
		
		if (email == null || email.trim().isEmpty()) {
			response.put("success", false);
			response.put("message", "이메일을 입력해 주세요.");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}
		
		try {
			memberService.sendVerificationToken(email);
			response.put("success", true);
			response.put("message", "인증 토큰이 전송되었습니다.");
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "인증 토큰 전송 실패: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}
	}
	
	// 인증 토큰 재전송
	@PostMapping("/resend-email-verification-token")
	public ResponseEntity<?> resendVerificationToken(@RequestBody Map<String, String> request) {
		String email = request.get("email"); // 요청으로 받은 이메일.
		
		// 이메일 주소 없으면 400 Bad Request 응답.
	    if (email == null || email.isEmpty()) {
	        Map<String, Object> errorResponse = new HashMap<>();
	        errorResponse.put("success", false);
	        errorResponse.put("message", "이메일 주소가 확인되지 않습니다.");
	        return ResponseEntity.badRequest().body(errorResponse);
	    }
	    
	    try {
	        // 이메일로 인증 토큰 재발급
	        memberService.resendVerificationToken(email);
	        Map<String, Object> successResponse = new HashMap<>();
	        successResponse.put("success", true);
	        successResponse.put("message", "새로운 인증 토큰이 이메일로 발송되었습니다.");
	        return ResponseEntity.ok(successResponse);
	    } catch (UserNotFoundException e) {
	        // 사용자가 없을 경우, 404 Not Found 응답.
	        Map<String, Object> errorResponse = new HashMap<>();
	        errorResponse.put("success", false);
	        errorResponse.put("message", "이메일에 해당하는 사용자가 없습니다.");
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
	    } catch (Exception e) {
	        Map<String, Object> errorResponse = new HashMap<>();
	        errorResponse.put("success", false);
	        errorResponse.put("message", "인증 토큰 재발급 중 문제가 발생했습니다.");
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
	    }
	}
	
	// 인증 토큰 확인
	@PostMapping("/verify-token")
	public ResponseEntity<Map<String, Object>> verifyTokenAndSignup(@RequestBody EmailVerificationRequestDto request) {
		String email = request.getEmail();
		String token = request.getToken();
		Map<String, Object> response = new HashMap<>();
		
		Logger logger = LoggerFactory.getLogger(getClass());
		
		try {
			// 인증 토큰 확인
			boolean isVerified = memberService.verifyTokenAndSignup(email, token);
			
			if (isVerified) {
				response.put("success", true);
				response.put("message", "이메일 인증 완료");
				return ResponseEntity.ok(response);
			} else {
				response.put("success", false);
				response.put("message", "인증 토큰이 일치하지 않습니다.");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
			}
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "서버 오류: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}
	
	@PostMapping("/signup")
	public ResponseEntity<Map<String, Object>> signup(@Valid @RequestBody MemberSignupDto memberSignupDto,
													BindingResult bindingResult) {
		Map<String, Object> response = new HashMap<>();
		
		// 유호성 검사 오류가 있을 경우.
		if (bindingResult.hasErrors()) {
			List<String> errorMessages = bindingResult.getFieldErrors().stream()
					.map(error -> error.getDefaultMessage())
					.collect(Collectors.toList());
			response.put("success", false);
			response.put("message", errorMessages);
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(response);
		}
		
		// 비밀번호 확인
		if (!memberSignupDto.getPassword().equals(memberSignupDto.getConfirmPassword())) {
			response.put("success", false);
			response.put("message", "비밀번호가 일치하지 않습니다.");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(response);
		}
		try {
			
			// DTO를 Member 엔티티로 변환
			Member member = new Member();
			member.setMemberName(memberSignupDto.getMemberName());
			member.setMemberId(memberSignupDto.getMemberId());
			member.setPassword(memberSignupDto.getPassword());
			member.setEmail(memberSignupDto.getEmail());
			member.setPhone(memberSignupDto.getPhone());
			
			memberService.registerMember(member);
			
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
