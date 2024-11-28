package com.example.schoolMeal.service.eduData;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.schoolMeal.domain.entity.eduData.NutritionDietEducation;
import com.example.schoolMeal.domain.repository.eduData.NutritionDietEducationRepository;

@Service
public class NutritionDietEducationService {

	@Autowired
	private NutritionDietEducationRepository nutrEduRepository;
	
	// 글 작성
	public void write(NutritionDietEducation nutrEdu) {
		nutrEduRepository.save(nutrEdu);
	}
	
	// 게시글 리스트 처리
	public List<NutritionDietEducation> nutrEduList() {
		return nutrEduRepository.findAll();
	}
	
	// 특정 게시글 불러오기
	public NutritionDietEducation nutrEduView(Long id) {
		return nutrEduRepository.findById(id).get();
	}
	
	// 특정 게시글 삭제
	public void nutrEduDelete(Long id) {
		nutrEduRepository.deleteById(id);
	}
	
	// 게시글 수정
	public void nutrEduUpdate(NutritionDietEducation nutrEdu) {
		nutrEduRepository.save(nutrEdu);
	}
	 
}
