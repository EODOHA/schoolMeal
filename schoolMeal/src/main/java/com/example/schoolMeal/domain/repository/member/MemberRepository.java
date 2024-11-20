package com.example.schoolMeal.domain.repository.member;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.member.Member;

//@RepositoryRestResource(exported = false)
//	// 다른 경로의 엔드포인트로 바꾸거나(path="sample")
//	// 숨겨야할 때(exported=false)
@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
	
	Optional<Member> findByMemberId(String memberId);
	
	// banUntil이 현재 시간보다 이전인 회원들 찾는 메서드
	List<Member> findByBanUntilBefore(LocalDateTime now);
}