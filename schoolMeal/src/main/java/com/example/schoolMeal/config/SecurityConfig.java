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
import com.example.schoolMeal.service.member.MemberDetailsServiceImpl;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private MemberDetailsServiceImpl userDetailsService;

	@Autowired
	private AuthenticationFilter authenticationFilter;

	@Autowired
	private AuthEntryPoint exceptionHandler;

	@Bean // HTTP 요청 들어올 시, 이를 처리할 여러 필터들의 체인을 빌더 패턴으로 정의.
	public SecurityFilterChain sercurityFilterChain(HttpSecurity http) throws Exception {

//		http.csrf().disable().cors().and()
//		.authorizeHttpRequests().anyRequest().permitAll();
//			// 테스트를 위해 모든 권한 사용자가 엔드 포인트 접속 가능

		http.csrf().disable().cors().configurationSource(corsConfigurationSource()).and().sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				// JWT 사용 시, 상태 없는 세션 정책
				.and().authorizeHttpRequests().requestMatchers(HttpMethod.POST, "/login").permitAll()
				.requestMatchers(HttpMethod.POST, "/signup").permitAll()
				.requestMatchers(HttpMethod.POST, "/check-duplicate-id").permitAll()
				.requestMatchers(HttpMethod.POST, "/check-duplicate-email").permitAll()
				.requestMatchers(HttpMethod.POST, "/send-verification-token").permitAll()
				.requestMatchers(HttpMethod.POST, "/validate-email").permitAll()
				.requestMatchers(HttpMethod.POST, "/find-account-token").permitAll()
				.requestMatchers(HttpMethod.POST, "/find-account-verify-token").permitAll()
				.requestMatchers(HttpMethod.POST, "/change-password").permitAll()
				.requestMatchers(HttpMethod.POST, "/verify-token").permitAll()
				.requestMatchers(HttpMethod.POST, "/verify-kakao").permitAll()
				.requestMatchers(HttpMethod.GET, "/imageManage/{category}").permitAll()
				.requestMatchers(HttpMethod.GET, "/adminNotice/**").permitAll()
				
				// 급식정보
				.requestMatchers(HttpMethod.GET, "/mealArchive/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/mealExpert/**").permitAll()
				
				// 식재료정보
				.requestMatchers(HttpMethod.GET, "/haccp-info/**", "/ingredient-price/**", "/ingredient-price/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/haccp/**", "/price/**", "/safety/**").permitAll()
				
				// 급식자료실
				.requestMatchers(HttpMethod.GET, "/mealPolicyOperations/**", "/mealPolicyOperation/**", "/mealPolicyOperation/download/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/menuRecipes/**", "/menuRecipe/**", "/menuRecipe/download/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/nutritionManages/**", "/nutritionManage/**", "/nutritionManage/download/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/mealHygienes/**", "/mealHygiene/**", "/mealHygiene/download/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/mealFacilityEquipments/**", "/mealFacilityEquipment/**", "/mealFacilityEquipment/download/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/schoolMealCases/**", "/schoolMealCase/**").permitAll()
				
				// 교육자료
				.requestMatchers(HttpMethod.GET, "/videoEducations/**", "/videoEducation/**", "/videoEducation/download/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/nutritionDietEducations/**", "/nutritionDietEducation/**", "/nutritionDietEducation/download/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/lessonDemoVideos/**", "/lessonDemoVideo/**", "/lessonDemoVideo/download/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/eduMaterialSharings/**", "/eduMaterialSharing/**", "/eduMaterialSharing/download/**").permitAll()

				// 커뮤니티 - 공지사항
				.requestMatchers(HttpMethod.GET, "/notices/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/notices/download/**").permitAll()

				// 커뮤니티 - 가공식품정보
				.requestMatchers(HttpMethod.GET, "/processed-foods/**", "/processedFood/**").permitAll()

				// 커뮤니티 - 지역별커뮤니티
				.requestMatchers(HttpMethod.GET, "/regions/**").permitAll()

				// 커뮤니티 - 급식뉴스 , 학술뉴스
				.requestMatchers(HttpMethod.GET, "/crawling/**").permitAll()
				
				// 커뮤니티 - 댓글기능
				.requestMatchers(HttpMethod.GET, "/comments/**").permitAll()

				// 채팅 관련 기능
				.requestMatchers(HttpMethod.POST, "/chat/sendMessage").permitAll()
				.requestMatchers(HttpMethod.GET, "/chat/stream/**").permitAll()

				//영양상담 자료실
				.requestMatchers(HttpMethod.GET, "/mealCounsel/**", "/mealCounsels/**", "/mealCounsel/download/**").permitAll()

				//영양상담 상담 기록 페이지
				.requestMatchers(HttpMethod.GET, "/counselHistory/**").permitAll()

				//영양상담 진단 페이지
				.requestMatchers(HttpMethod.GET, "/goToCounsel").permitAll()

				// 해당 엔드포인트는 인증 필요 없음.
				.anyRequest().authenticated()
				// 그 외 모든 요청은 인증 필요
				.and().exceptionHandling().authenticationEntryPoint(exceptionHandler)
				// 인증 실패 시, 예외 처리
				.and().addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);
		// JWT 필터 추가

		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
		// 비밀번호 암호화를 위함.
	}

	@Bean // 사용자 인증 책임지는 핵심 구성 요소.
	// 보통 userDetailsService, passwordEncoder를 설정해 사용.
	public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {

		AuthenticationManagerBuilder authenticationManagerBuilder = http
				.getSharedObject(AuthenticationManagerBuilder.class);
		authenticationManagerBuilder.userDetailsService(userDetailsService)
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