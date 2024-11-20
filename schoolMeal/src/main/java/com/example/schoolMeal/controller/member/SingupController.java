package com.example.schoolMeal.controller.member;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.schoolMeal.domain.entity.member.Member;
import com.example.schoolMeal.dto.member.MemberSignupDto;
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
