package com.example.schoolMeal.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.schoolMeal.domain.entity.User;
import com.example.schoolMeal.domain.repository.UserRepository;
import com.example.schoolMeal.exception.AccountLockedException;
import com.example.schoolMeal.exception.UserNotFoundException;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	// 회원가입 처리
	public void registerUser(User user) {
		// 이미 존재하는 username인지 확인.
		if (userRepository.findByUsername(user.getUsername()).isPresent()) {
			throw new IllegalArgumentException("이미 사용 중인 유저명입니다.");
		}
		
		// 비밀번호 암호화
		String encodedPassword = passwordEncoder.encode(user.getPassword());
		user.setPassword(encodedPassword);
		
		// 기본 필드 설정
		user.setRole("USER");
		user.setStatus("active");
		user.setLocked(false);
		user.setFailedAttempts(0);
		
		// 사용자 정보 DB에 저장
		userRepository.save(user);
	}
	
	// 유저 체크
	public boolean checkUser(String username, String password) {
		// Optional로 감싸서 유저를 찾음.
		Optional<User> optionalUser = 
				userRepository.findByUsername(username);
		// Optional이 비어 있으면, 사용자 없음.
		User user = optionalUser
				.orElseThrow(() -> 
					new UserNotFoundException("사용자를 찾을 수 없습니다! 계정을 확인해 주세요!"));

		// 계정 잠금 상태 확인
		if (user.isAccountLocked()) {
			if (user.getBanUntil() != null && LocalDateTime.now().isAfter(user.getBanUntil())) {
				user.unlockAccount();
				userRepository.save(user);
			}
			throw new AccountLockedException("계정이 잠겼습니다! 관리자에게 문의해 주세요!");
		}
		
		// 비밀번호가 맞는지 확인.
		if (passwordEncoder.matches(password, user.getPassword())) {
				// 인코딩된 비밀번호와 비교해야 함.
			user.resetFailedAttempts(); // 맞으면 실패 횟수 리셋.
			userRepository.save(user);
			return true;
		} else {
			user.incrementFailedAttempts(); // 틀리면 실패 횟수 증가.
			if (user.getFailedAttempts() >= 5) {
				user.lockAccount(); // 5회 이상 틀리면 계정 잠금.
			}
			userRepository.save(user);
			return false; // 비밀번호 틀렸으므로 실패.
		}
	}
	
	public LocalDateTime getBanUntil(String username) {
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다! 계정을 확인해 주세요!"));
		return user.getBanUntil();
	}
	
	public int getFailedAttempts(String username) {
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다! 계정을 확인해 주세요!"));
		return user.getFailedAttempts();
	}
}
