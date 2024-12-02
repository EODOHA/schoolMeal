package com.example.schoolMeal.controller.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.schoolMeal.domain.entity.member.Member;
import com.example.schoolMeal.domain.repository.member.MemberRepository;

@RestController
@RequestMapping("/members")
public class ProfileContoller { // 회원 본인 정보.
	@Autowired
	private MemberRepository memberRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
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
