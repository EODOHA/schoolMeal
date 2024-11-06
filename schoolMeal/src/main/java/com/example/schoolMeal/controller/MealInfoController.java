package com.example.schoolMeal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.schoolMeal.domain.entity.mealInfo.MealExpert;
import com.example.schoolMeal.dto.mealInfo.MealExpertDto;
import com.example.schoolMeal.service.mealInfo.MealExpertService;

import jakarta.validation.Valid;

@RequestMapping("/mealInfo")  //상위 메뉴 -> 급식정보
@RestController
public class MealInfoController {
	
	/* @@@@@@@@@@@@@@@@@@@@@@@	급식 전문 인력 관리 게시판	 @@@@@@@@@@@@@@@@@@@@@@@ */
	@Autowired
	private MealExpertService mealExpertService;
	
	// 급식 전문인력 생성
	@PostMapping("/experts/create")
	public MealExpert createExpert(@RequestBody @Valid MealExpertDto mealExpertDto) {
		return mealExpertService.createExpert(mealExpertDto);
	}
	
	// 전문인력 목록 조회
	@GetMapping("/experts/select")
	public List<MealExpert> getAllExperts(){
		return mealExpertService.getAllExperts();
	}
	
	// 전문인력 상세조회
	@GetMapping("/experts/{exp_id}")
	public MealExpert getExpert(@PathVariable Long exp_id) {
		return mealExpertService.getExpert(exp_id);
	}
	
	// 전문인력 정보 수정
	@PutMapping("/experts/{exp_id}")
	public MealExpert updateExpert(@PathVariable Long exp_id,  @RequestBody @Valid MealExpertDto mealExpertDto){ 
		return mealExpertService.updateExpert(exp_id, mealExpertDto);
	}
	
	
	// 전문인력 삭제
	@DeleteMapping("/experts/{exp_id}")
	public void deleteExpert(@PathVariable Long exp_id) {
		mealExpertService.deleteExpert(exp_id);
	}

}
