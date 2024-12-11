package com.example.schoolMeal.controller.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.schoolMeal.domain.entity.member.Member;
import com.example.schoolMeal.domain.repository.member.MemberRepository;
import com.example.schoolMeal.dto.member.AccountCredentialsDto;

@RestController
@RequestMapping("/members")
public class ProfileContoller { // 회원 본인 정보.
	@Autowired
	private MemberRepository memberRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	// 정보 조회 전, 비밀번호 확인.
	@PostMapping("/validatePassword")
	public ResponseEntity<?> validatePassword(@RequestBody AccountCredentialsDto credentials) {
		// 입력 받은 memeberId로 사용자 찾기.
		Member member = memberRepository.findByMemberId(credentials.getMemberId())
				.orElseThrow(() -> new UsernameNotFoundException("Member not found"));
		
		// 입력된 비밀번호와 저정돤 비밀번호 비교.
		if (passwordEncoder.matches(credentials.getPassword(), member.getPassword())) {
			return ResponseEntity.ok().build(); // 비밀번호 일치. 
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body("비밀번호가 일치하지 않습니다.");
		}
	}
	
	// 본인 정보 조회.
	@GetMapping("/me")
	public Member getMyProfile(Authentication authentication) {
		String currentMemberId = authentication.getName();
		return memberRepository.findByMemberId(currentMemberId)
				.orElseThrow(() -> new RuntimeException("Member not found"));
	}
	
	// 본인 정보 수정.
	@PutMapping("/me")
	public Member updateMyProfile(Authentication authentication,
								@RequestBody Member updatedInfo) {
		String currentMemberId = authentication.getName();
		return memberRepository.findByMemberId(currentMemberId)
				.map(member -> {
					member.setMemberName(updatedInfo.getMemberName());
					// 비밀번호는 인코딩해서 저장.
					if (updatedInfo.getPassword() != null && !updatedInfo.getPassword().isEmpty()) {						
						member.setPassword(passwordEncoder.encode(updatedInfo.getPassword()));
					}
					member.setEmail(updatedInfo.getEmail());
					member.setPhone(updatedInfo.getPhone());
					return memberRepository.save(member);
				})
				.orElseThrow(() -> new RuntimeException("Member not found"));
	}
	
	// 본인 정보 삭제(탈퇴)
	@DeleteMapping("/me")
	public String deleteMyProfile(Authentication authentication) {
		String currentMemberId = authentication.getName();
		return memberRepository.findByMemberId(currentMemberId)
				.map(member -> {
					memberRepository.delete(member);
					return "회원 탈퇴가 완료되었습니다.";
				})
				.orElseThrow(() -> new RuntimeException("Member nout found"));
	}
	
}
