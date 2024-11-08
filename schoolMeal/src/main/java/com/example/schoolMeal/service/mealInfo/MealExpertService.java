package com.example.schoolMeal.service.mealInfo;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.schoolMeal.domain.entity.mealInfo.MealExpert;
import com.example.schoolMeal.domain.repository.mealInfo.MealExpertRepository;
import com.example.schoolMeal.dto.mealInfo.MealExpertDto;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class MealExpertService {
	
//	private static final Logger logger = LoggerFactory.getLogger(MealExpertService.class);
	
	
/* @@@@@@@@@@@@@@@@@@@@@@@	급식 전문 인력관리 게시판	@@@@@@@@@@@@@@@@@@@@@@@ */
	
	@Autowired
	private MealExpertRepository mealExpertRepository;

	// 전문인력 생성
	public MealExpert createExpert(MealExpertDto dto) {
		//로거 확인
		//logger.info("createExpert 메서드 호출됨. MealExpertDto: {}", dto);
		 
		// 필수 항목 추가
		MealExpert expert = new MealExpert(); // 엔터티 객체 생성
		expert.setExp_name(dto.getExp_name());
		expert.setExp_department(dto.getExp_department());
		expert.setExp_position(dto.getExp_position());
		expert.setExp_email(dto.getExp_email());

		// 보유 자격증 및 및 이력 사항 추가(선택적 항목)
		if (dto.getQualifications() != null) {
			expert.setQualifications(dto.getQualifications());
		}

		if (dto.getHistories() != null) {
			expert.setHistories(dto.getHistories());
		}
		//로거 확인
		//logger.info("MealExpert 객체 생성됨: {}", expert);

		MealExpert savedExpert = mealExpertRepository.save(expert);
		//로거 확인
		//logger.info("MealExpert 객체 생성됨: {}", savedExpert);
		
		return savedExpert;
	}

	// 전문인력 목록 조회
	public List<MealExpert> getAllExperts() {
		return mealExpertRepository.findAll();
	}

	// 전문인력 상세조회
	public MealExpert getExpert(Long exp_id) {
		return mealExpertRepository.findById(exp_id).orElseThrow(() -> new EntityNotFoundException("해당 인력을 찾을 수 없습니다."));
	}

	// 전문인력 정보 수정
	public MealExpert updateExpert(Long exp_id, MealExpertDto dto) {
		MealExpert expert = getExpert(exp_id);
		expert.setExp_name(dto.getExp_name());
		expert.setExp_department(dto.getExp_department());
		expert.setExp_position(dto.getExp_position());
		expert.setExp_email(dto.getExp_email());
		
		if (dto.getQualifications() != null) {
			expert.setQualifications(dto.getQualifications());
		}

		if (dto.getHistories() != null) {
			expert.setHistories(dto.getHistories());
		}
		
		MealExpert updatedExpert = mealExpertRepository.save(expert);

		return updatedExpert;
	}

	// 전문인력 정보 삭제
	public void deleteExpert(Long exp_id) {
		MealExpert expert = getExpert(exp_id);
		mealExpertRepository.delete(expert);
	}
}
