package com.example.schoolMeal.service.member;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.schoolMeal.domain.entity.member.Member;
import com.example.schoolMeal.domain.repository.member.MemberRepository;

@Service
public class MemberDetailsServiceImpl implements UserDetailsService {
		// UserDetailsService 인터페이스 사용해 사용자 정보 가져와 인증 처리
	
	@Autowired
	private MemberRepository memberRepository;
	
	@Override
	public UserDetails loadUserByUsername(String memberId)
			throws UsernameNotFoundException {
		
		Optional<Member> member = memberRepository.findByMemberId(memberId);
		UserBuilder builder = null;
		
		if (member.isPresent()) {
			Member currentMember = member.get();
			builder = org.springframework.security.core.userdetails.
						User.withUsername(memberId);
			builder.password(currentMember.getPassword());
			// Enum의 name() 메서드 사용해, String 타입으로 변환
			builder.roles(currentMember.getRole().name());
		} else {
			throw new UsernameNotFoundException("User not found.");
		}
		return builder.build();
	}
	
}
