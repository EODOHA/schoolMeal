package com.example.schoolMeal.service.member;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.schoolMeal.domain.entity.member.Member;
import com.example.schoolMeal.domain.entity.member.Role;
import com.example.schoolMeal.domain.repository.member.MemberRepository;
import com.example.schoolMeal.exception.AccountLockedException;
import com.example.schoolMeal.exception.UserNotFoundException;

@Service
public class MemberService {

	@Autowired
	private MemberRepository memberRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	// 회원가입 처리
	public void registerMember(Member member) {
		// 이미 존재하는 memberId인지 확인.
		if (memberRepository.findByMemberId(member.getMemberId()).isPresent()) {
			throw new IllegalArgumentException("이미 사용 중인 유저명입니다.");
		}
		
		// 비밀번호 암호화
		String encodedPassword = passwordEncoder.encode(member.getPassword());
		member.setPassword(encodedPassword);
		
		// 기본 필드 설정
		member.setRole(Role.MEMBER);
		member.setStatus("active");
		member.setLocked(false);
		member.setFailedAttempts(0);
		
		// 사용자 정보 DB에 저장
		memberRepository.save(member);
	}
	
	// 회원가입용 중복 검사 메서드
	public boolean isMemberIdAvailable(String memberId) {
		return !memberRepository.findByMemberId(memberId).isPresent();
	}
	
	
	// 회원 체크
	public boolean checkMember(String memberId, String password) {
		// Optional로 감싸서 유저를 찾음.
		Optional<Member> optionalMember = 
				memberRepository.findByMemberId(memberId);
		// Optional이 비어 있으면, 사용자 없음.
		Member member = optionalMember
				.orElseThrow(() -> 
					new UserNotFoundException("사용자를 찾을 수 없습니다! 계정을 확인해 주세요!"));

		// 계정 잠금 상태 확인
		if (member.isAccountLocked()) {
			if (member.getBanUntil() != null && LocalDateTime.now().isAfter(member.getBanUntil())) {
				member.unlockAccount();
				memberRepository.save(member);
			}
			throw new AccountLockedException("계정이 잠겼습니다! 관리자에게 문의해 주세요!");
		}
		
		// 비밀번호가 맞는지 확인.
		if (passwordEncoder.matches(password, member.getPassword())) {
				// 인코딩된 비밀번호와 비교해야 함.
			member.resetFailedAttempts(); // 맞으면 실패 횟수 리셋.
			memberRepository.save(member);
			return true;
		} else {
			member.incrementFailedAttempts(); // 틀리면 실패 횟수 증가.
			if (member.getFailedAttempts() >= 5) {
				member.lockAccount(); // 5회 이상 틀리면 계정 잠금.
			}
			memberRepository.save(member);
			return false; // 비밀번호 틀렸으므로 실패.
		}
	}
	
	public LocalDateTime getBanUntil(String memberId) {
		Member member = memberRepository.findByMemberId(memberId)
				.orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다! 계정을 확인해 주세요!"));
		return member.getBanUntil();
	}
	
	public int getFailedAttempts(String memberId) {
		Member member = memberRepository.findByMemberId(memberId)
				.orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다! 계정을 확인해 주세요!"));
		return member.getFailedAttempts();
	}
	
	public Role getMemberRole(String memberId) {
		Member member = memberRepository.findByMemberId(memberId)
				.orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다! 계정을 확인해 주세요!"));
		return member.getRole();
	}
}
