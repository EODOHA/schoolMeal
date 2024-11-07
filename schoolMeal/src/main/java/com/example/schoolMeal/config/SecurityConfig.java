package com.example.schoolMeal.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.schoolMeal.security.AuthEntryPoint;
import com.example.schoolMeal.security.filters.AuthenticationFilter;
import com.example.schoolMeal.service.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private UserDetailsServiceImpl userDetailsService;
	
	@Autowired
	private AuthenticationFilter authenticationFilter;
	
	@Autowired
	private AuthEntryPoint exceptionHandler;
	
	@Bean	// HTTP 요청 들오일 시, 이를 처리할 여러 필터들의 체인을 빌더 패턴으로 정의.
	public SecurityFilterChain sercurityFilterChain(HttpSecurity http) 
		throws Exception {
		
//		http.csrf().disable().cors().and()
//		.authorizeHttpRequests().anyRequest().permitAll();
//			// 테스트를 위해 모든 권한 사용자가 엔드 포인트 접속 가능
		
		http.csrf().disable()
		.cors().configurationSource(corsConfigurationSource()).and()
		.sessionManagement()
		.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
			// JWT 사용 시, 상태 없는 세션 정책
		.and()
		.authorizeHttpRequests()
		.requestMatchers(HttpMethod.POST, "/login").permitAll()
		.requestMatchers(HttpMethod.POST, "/signup").permitAll()
			// 해당 엔드포인트는 인증 필요 없음.
		.anyRequest().authenticated()
			// 그 외 모든 요청은 인증 필요
		.and()
		.exceptionHandling()
		.authenticationEntryPoint(exceptionHandler)
			// 인증 실패 시, 예외 처리
		.and()
		.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);
			// JWT 필터 추가
	
	return http.build();
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
			// 비밀번호 암호화를 위함.
	}
	
	@Bean	// 사용자 인증 책임지는 핵심 구성 요소.
			// 보통 userDetailsService, passwordEncoder를 설정해 사용.
	public AuthenticationManager authenticationManager(HttpSecurity http)
		throws Exception {
		
		AuthenticationManagerBuilder authenticationManagerBuilder =
				http.getSharedObject(AuthenticationManagerBuilder.class);
		authenticationManagerBuilder
			.userDetailsService(userDetailsService)
				// 사용자 인증 정보 로드
			.passwordEncoder(passwordEncoder());
				// 비밀번호 인코더 설정
		return authenticationManagerBuilder.build();
	}
	
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(Arrays.asList("*"));
			// 모든 출처 허용
		config.setAllowedMethods(Arrays.asList("*"));
			// 모든 HTTP 메서드 허용
		config.setAllowedHeaders(Arrays.asList("*"));
			// 모든 헤더 허용
		config.setAllowCredentials(false);
			// 자격 증명 허용 여부
		config.applyPermitDefaultValues();
		
		source.registerCorsConfiguration("/**", config);
		return source;
	}
}
