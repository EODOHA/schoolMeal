package com.example.schoolMeal.service.mealInfo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.schoolMeal.domain.entity.mealInfo.MealExpert;
import com.example.schoolMeal.domain.repository.mealInfo.MealExpertRepository;

import jakarta.transaction.Transactional;

@Service
public class MealExpertService {

	/* @@@@@@@@@@@@@@@@@@@@@@@ 급식 전문 인력관리 게시판 @@@@@@@@@@@@@@@@@@@@@@@ */

	@Autowired
	private MealExpertRepository mealExpertRepository;

	// 모든 전문인력 리스트 조회
	public List<MealExpert> findAllExperts() {
		return mealExpertRepository.findAll();
	}

	// 상세보기
	public Optional<MealExpert> findExpertById(Long exp_id) {
		return mealExpertRepository.findById(exp_id);
	}

	// 저장 및 수정
	@Transactional
	public MealExpert saveExpert(MealExpert mealExpert) {
		return mealExpertRepository.save(mealExpert);
	}

	// 전문인력 삭제
	public void deleteExpert(Long exp_id) {
		mealExpertRepository.deleteById(exp_id);
	}
}
