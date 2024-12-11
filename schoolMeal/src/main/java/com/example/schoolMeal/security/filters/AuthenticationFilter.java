package com.example.schoolMeal.security.filters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.schoolMeal.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthenticationFilter extends OncePerRequestFilter {
		// JWT 인증 필터

	@Autowired
	private JwtService jwtService;
	
	@Override
	protected void doFilterInternal(HttpServletRequest request,
								HttpServletResponse response,
								FilterChain filterChain)
	throws ServletException, java.io.IOException {
		// FilterChain
		// HTTP 요청을 여러 필터를 통해 순차적으로 처리.
		// Spring Security는 보안 관련 작업 처리 위해,
		// 여러 필터를 처리하기 위해 체인 형태로 연결하는데,
		// 이때 요청이 각각의 필터를 거치도록 하는 것이 FilterChain의 역할.
		
		// "/login" 경로는, 필터를 통과시켜야 하므로.
		if (request.getRequestURI().equals("/login")) {
			filterChain.doFilter(request, response);
			return;
		}
//		Logger logger = LoggerFactory.getLogger(getClass());
//		logger.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"+request.getRequestURI());
		// "/verify-token" 경로는 인증 필터를 건너뛰도록 추가
	    if (request.getRequestURI().equals("/verify-token")) {
	        filterChain.doFilter(request, response);
	        return;
	    }
		
		// 메인 페이지 "GET" 요청만 인증없도록 필터.
		if (request.getRequestURI().startsWith("/imageManage") && 
				request.getMethod().equals("GET")) {
			filterChain.doFilter(request, response);
			return;
		}
		
		// 메인 페이지 "GET" 요청만 인증없도록 필터.
		if (request.getRequestURI().startsWith("/adminNotice") && 
				request.getMethod().equals("GET")) {
			filterChain.doFilter(request, response);
			return;
		}
		
        //"/mealInfo" "GET" 요청만 인증 없도록 필터
        if (request.getRequestURI().startsWith("/mealInfo") && 
				request.getMethod().equals("GET")) {
			filterChain.doFilter(request, response);
			return;
		}
		
		String jws = request.getHeader(HttpHeaders.AUTHORIZATION);
			// Authorization 헤더에서 토큰을 가져옴.
		
		if (jws != null) {
				// 토큰을 확인하고 사용자를 얻어 옴.
			String member = jwtService.getAuthMember(request);
			
			// 인증
			Authentication authentication =
					new UsernamePasswordAuthenticationToken(member, null,
							java.util.Collections.emptyList());
			SecurityContextHolder.getContext()
				.setAuthentication(authentication);
		}
		
		filterChain.doFilter(request, response);
	}
	
}
