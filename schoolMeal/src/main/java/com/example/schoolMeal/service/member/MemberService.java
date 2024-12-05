package com.example.schoolMeal.service.member;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.schoolMeal.domain.entity.member.Member;
import com.example.schoolMeal.domain.entity.member.Role;
import com.example.schoolMeal.domain.repository.member.MemberRepository;
import com.example.schoolMeal.exception.AccountLockedException;
import com.example.schoolMeal.exception.UserNotFoundException;


import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;


@Service
public class MemberService {

	@Autowired
	private MemberRepository memberRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	// 의존성 추가한 JavaMailSender 사용해, 이메일 전송.
	private JavaMailSender mailSender;
	
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
		
		// 이메일 인증 관련 필드 설정
		String verificationToken = UUID.randomUUID().toString(); // 인증 토큰 생성
		member.setEmailVerificationToken(verificationToken);
		member.setEmailVerified(false);
		
		// 사용자 정보 DB에 저장
		memberRepository.save(member);
		
		// 이메일 발송 로직 (별도 메서드 호출)
		sendVerificationEmail(member.getEmail(), verificationToken);
	}
	
	// 회원가입용 아이디 중복 검사 메서드
	public boolean isMemberIdAvailable(String memberId) {
		return !memberRepository.findByMemberId(memberId).isPresent();
	}
	
	// 회원가입용 이메일 중복 검사 메서드
	public boolean isEmailAvailable(String email) {
		return !memberRepository.findByEmail(email).isPresent();
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
	
	public boolean isEmailVerified(String memberId) {
		Member member = memberRepository.findByMemberId(memberId)
				.orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다! 계정을 확인해 주세요!"));
		return member.isEmailVerified();
	}
	
	// 이메일로 인증 토큰 생성 및 전송.
	public void sendVerificationToken(String email) {
		Optional<Member> memberOpt = memberRepository.findByEmail(email);
		
		if (memberOpt.isPresent()) {
			throw new IllegalArgumentException("이미 가입된 이메일입니다.");
		}
		
		// 6자리로 토큰 생성.
		String verificationToken = UUID.randomUUID().toString().substring(0, 6);
		Member member = new Member();
		member.setEmail(email);
		member.setEmailVerificationToken(verificationToken);
		member.setEmailVerified(false);
		memberRepository.save(member);
		
		// 이메일로 인증 토큰 전송.
		sendVerificationEmail(email, verificationToken);
	}
	
	// 토큰 재발급용.
	public void resendVerificationToken(String email) {
		// 이메일에 해당하는 사용자가 있는지 확인.
		Optional<Member> memberOpt = memberRepository.findByEmail(email);
		
		if (!memberOpt.isPresent()) {
			throw new UserNotFoundException("이메일에 해당하는 사용자가 없습니다.");
		}
		
		// 새로운 인증 토큰 생성(기존 토큰과 같은 방식)
		String verificationToken = UUID.randomUUID().toString().substring(0, 6);
		
		// 사용자 이메일 인증 토큰을 새로 갱신
		Member member = memberOpt.get();
		member.setEmailVerificationToken(verificationToken);
		member.setEmailVerified(false); // 인증 미완료 상태로 유지.
		memberRepository.save(member);
		
		// 새로 생성된 인증 토큰을 이메일로 전송.
		sendVerificationEmail(email, verificationToken);
	}
	
	// 계정 찾기용 토큰 생성
	public void findAccountToken(String email) {
		// 이메일에 해당하는 사용자가 있는지 확인.
		Optional<Member> memberOpt = memberRepository.findByEmail(email);
			
		if (!memberOpt.isPresent()) {
			throw new UserNotFoundException("이메일에 해당하는 사용자가 없습니다.");
		}
			
		// 새로운 인증 토큰 생성(기존 토큰과 같은 방식)
		String verificationToken = UUID.randomUUID().toString().substring(0, 6);
			
		// 사용자 이메일 인증 토큰을 새로 갱신
		Member member = memberOpt.get();
		member.setEmailVerificationToken(verificationToken);
		memberRepository.save(member);
			
		// 새로 생성된 인증 토큰을 이메일로 전송.
		sendfindAccountTokenEmail(email, verificationToken);
	}
	
	// 이메일 인증 토큰 전송 메서드(생성 메서드에서 사용).
	private void sendVerificationEmail(String email, String token) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true);
			
			// 이메일 수신자와 제목 설정
	        helper.setTo(email);
	        helper.setSubject("스쿨밀 이메일 인증");

	        // HTML 이메일 본문 설정.
	        // (Gmail SMTP는 인라인 스타일만 지원. 모든 스타일을 인라인으로 적용)
	        String htmlContent = "<html>" +
	            "<body style='font-family: Arial, sans-serif; background-color: #f4f7fc; color: #333; margin: 0; padding: 0;'>" +
	            "<div style='width: 100%; max-width: 600px; margin: 20px auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);'>" +
	            "<div style='text-align: center; color: #4CAF50;'>" +
	            "<h2>이메일 인증 토큰 안내</h2>" +
	            "</div>" +
	            "<div style='text-align: center; margin-top: 20px; font-size: 16px; line-height: 1.5;'>" +
	            "<p>안녕하세요. 회원가입 요청을 진심으로 감사드립니다.</p>" +
	            "<p>아래의 인증 토큰을 입력하여 이메일 인증을 완료해 주세요.</p>" +
	            "<br></br>"+
	            "<br></br>"+
	            "<div style='background-color: #f0f0f0; border-radius: 8px; padding: 15px; margin-top: 20px;'>" +
	            "<p><strong>인증 토큰</strong></p>" +
	            "<br></br>" +
	            "<p style='font-weight: bold; font-size: 18px; color: #333;'>" + token + "</p>" +
	            "</div>" +
	            "</div>" +
	            "<div style='margin-top: 30px; font-size: 12px; text-align: center; color: #777;'>" +
	            "<p>본인이 요청하신 게 아니라면, 이 이메일을 무시하셔도 됩니다.</p>" +
	            "</div>" +
	            "</div>" +
	            "</body>" +
	            "</html>";

	        // 이메일 본문을 HTML로 설정
	        helper.setText(htmlContent, true);

	        // 이메일 발송
	        mailSender.send(message);
		} catch (Exception e) {
			throw new RuntimeException("이메일 발송 실패: " + e.getMessage());
		}
	}
	
	// 계정 찾기 인증 토큰 전송 메서드(생성 메서드에서 사용).
	private void sendfindAccountTokenEmail(String email, String token) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true);
				
			// 이메일 수신자와 제목 설정
		    helper.setTo(email);
		    helper.setSubject("스쿨밀 계정 찾기 이메일 인증");

		    // HTML 이메일 본문 설정.
		    // (Gmail SMTP는 인라인 스타일만 지원. 모든 스타일을 인라인으로 적용)
		    String htmlContent = "<html>" +
		        "<body style='font-family: Arial, sans-serif; background-color: #f4f7fc; color: #333; margin: 0; padding: 0;'>" +
		        "<div style='width: 100%; max-width: 600px; margin: 20px auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);'>" +
		        "<div style='text-align: center; color: #4CAF50;'>" +
		        "<h2>이메일 인증 토큰 안내</h2>" +
		        "</div>" +
		        "<div style='text-align: center; margin-top: 20px; font-size: 16px; line-height: 1.5;'>" +
		        "<p>안녕하세요. 계정 찾기 요청에 대한 메일입니다.</p>" +
		        "<p>아래의 인증 토큰을 입력하여 이메일 인증을 완료해 주세요.</p>" +
		        "<br></br>"+
		        "<br></br>"+
		        "<div style='background-color: #f0f0f0; border-radius: 8px; padding: 15px; margin-top: 20px;'>" +
		        "<p><strong>인증 토큰</strong></p>" +
		        "<br></br>" +
		        "<p style='font-weight: bold; font-size: 18px; color: #333;'>" + token + "</p>" +
		        "</div>" +
		        "</div>" +
		        "<div style='margin-top: 30px; font-size: 12px; text-align: center; color: #777;'>" +
		        "<p>본인이 요청하신 게 아니라면, 이 이메일을 무시하셔도 됩니다.</p>" +
		        "</div>" +
		        "</div>" +
		        "</body>" +
		        "</html>";
		    
		    // 이메일 본문을 HTML로 설정
		    helper.setText(htmlContent, true);

		    // 이메일 발송
		    mailSender.send(message);
		    
		} catch (Exception e) {
			throw new RuntimeException("이메일 발송 실패: " + e.getMessage());
		}
	}
	
	// 인증 토큰 확인 및 회원가입 처리
	public boolean verifyTokenAndSignup(String email, String token) {
		 // 이메일에 해당하는 사용자가 있는지 확인
	    Member member = memberRepository.findByEmail(email)
	        .orElseThrow(() -> new UserNotFoundException("이메일에 해당하는 사용자가 없습니다. 이메일: " + email));
		
		// 인증 토큰 확인.
		if (member.getEmailVerificationToken().equals(token)) {
			member.setEmailVerified(true);
			member.setEmailVerificationToken(null); // 토큰 삭제
			memberRepository.save(member);
			return true;
		} else {
			return false;
		}
	}
	
}
