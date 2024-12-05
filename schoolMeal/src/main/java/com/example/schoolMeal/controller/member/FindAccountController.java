package com.example.schoolMeal.controller.member;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.schoolMeal.domain.entity.member.Member;
import com.example.schoolMeal.domain.repository.member.MemberRepository;
import com.example.schoolMeal.dto.member.ChangePasswordRequestDto;
import com.example.schoolMeal.dto.member.EmailVerificationRequestDto;
import com.example.schoolMeal.exception.UserNotFoundException;
import com.example.schoolMeal.service.member.MemberService;

@RestController
public class FindAccountController {

	@Autowired
	private MemberRepository memberRepository;
	
	@Autowired
	private MemberService memberService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	// 이메일이 존재하는지 먼저 검사.
	@PostMapping("/validate-email")
	public ResponseEntity<?> validateEmail(@RequestBody Map<String, String> request) {
	    String email = request.get("email");
	    Optional<Member> memberOpt = memberRepository.findByEmail(email);

	    if (memberOpt.isPresent()) {
	        Member member = memberOpt.get();
	        String status = member.getStatus(); // status 필드 추가

	     // 이메일 존재 + status가 'banned'일 경우
	        if ("banned".equals(status)) {
	            // 여기서는 403을 보내지 않고 200 OK로 보내면서 status를 'banned'로 보냄
	            return ResponseEntity.ok(Map.of("success", false, "message", "계정이 잠겼습니다! 관리자에게 문의하세요!", "status", "banned"));
	        }

	        return ResponseEntity.ok(Map.of("success", true, "message", "이메일이 존재합니다.", "status", status));
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                .body(Map.of("success", false, "message", "가입되지 않은 이메일입니다."));
	    }
	}
	
	// 인증 토큰 재전송
	@PostMapping("/find-account-token")
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
		    memberService.findAccountToken(email);
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
	
	// 계정 찾기 인증 토큰 확인
	@PostMapping("/find-account-verify-token")
	public ResponseEntity<Map<String, Object>> verifyTokenAndSignup(@RequestBody EmailVerificationRequestDto request) {
		String email = request.getEmail();
		String token = request.getToken();
		Map<String, Object> response = new HashMap<>();
				
		Logger logger = LoggerFactory.getLogger(getClass());
		
		try {
			// 인증 토큰 확인
			boolean isVerified = memberService.verifyTokenAndSignup(email, token);
						
			if (isVerified) {
				Optional<Member> memberOpt = memberRepository.findByEmail(email);
				if (memberOpt.isPresent()) {
					Member member = memberOpt.get();
					response.put("success", true);
					response.put("message", "이메일 인증 완료");
					response.put("memberId", member.getMemberId());
					return ResponseEntity.ok(response);
				} else {
					response.put("success", false);
					response.put("message", "회원 정보를 찾을 수 없습니다.");
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
				}
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
	
	@PostMapping("/change-password")
	public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequestDto request) {
		String email = request.getEmail();
		String newPassword = request.getNewPassword();
		
		Map<String, Object> response = new HashMap<>();
		
		// 해당 이메일로 회원 찾기.
		Member member = memberRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("회원 정보를 찾을 수 없습니다."));
		
		// 비밀번호 변경.
		member.setPassword(passwordEncoder.encode(newPassword));
		memberRepository.save(member);
		
		response.put("success", true);
		response.put("message", "비밀번호가 성공적으로 변경되었습니다.");
		return ResponseEntity.ok(response);
	}
}
