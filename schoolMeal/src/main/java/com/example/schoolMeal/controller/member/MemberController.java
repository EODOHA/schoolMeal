package com.example.schoolMeal.controller.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.schoolMeal.domain.entity.member.Member;
import com.example.schoolMeal.domain.repository.member.MemberRepository;

@RestController
public class MemberController { // 관리자용.

	@Autowired
	MemberRepository memberRepository;
	
	@RequestMapping
	public Iterable<Member> getUsers() {
		return memberRepository.findAll();
	}
	
}
