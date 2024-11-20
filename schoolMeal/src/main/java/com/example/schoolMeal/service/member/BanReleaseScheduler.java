package com.example.schoolMeal.service.member;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.schoolMeal.domain.entity.member.Member;
import com.example.schoolMeal.domain.repository.member.MemberRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class BanReleaseScheduler {
	// 사용하려면 SchoolMealApplication.java에
	// @EnableScheduling 추가해야 함!

	private final MemberRepository memberRepository;

	// @AllArgsConstructor 로 자동화
//	public BanReleaseScheduler(MemberRepository memberRepository) {
//        this.memberRepository = memberRepository;
//    }
	
	// 차단 해제 작업을 1분마다 실행
	@Scheduled(fixedRate = 30000) // 30,000ms = 30초
	@Transactional
	public void releaseBans() {
		List<Member> bannedMembers = memberRepository.
				findByBanUntilBefore(LocalDateTime.now());
		
		for (Member member : bannedMembers) {
			// 차단 해제
			member.setBanUntil(null);
			member.setLocked(false);
			member.setStatus("active");
			memberRepository.save(member);
		}
	}
}
