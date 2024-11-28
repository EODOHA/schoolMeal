package com.example.schoolMeal.service.eduData;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.schoolMeal.domain.entity.eduData.NutritionDietEducation;
import com.example.schoolMeal.domain.repository.eduData.NutritionDietEducationRepository;

@Service
public class NutritionDietEducationService {

	@Autowired
	private NutritionDietEducationRepository ntritionDietEducationRepository;
	
	// 글 작성
	public void write(NutritionDietEducation ntritionDietEducation) {
		ntritionDietEducationRepository.save(ntritionDietEducation);
	}
	
	// 게시글 리스트 처리
	public List<NutritionDietEducation> ntritionDietEducationList() {
		return ntritionDietEducationRepository.findAll();
	}
	
	// 특정 게시글 불러오기
	public NutritionDietEducation ntritionDietEducationView(Long id) {
		return ntritionDietEducationRepository.findById(id).get();
	}
	
	// 특정 게시글 삭제
	public void ntritionDietEducationDelete(Long id) {
		ntritionDietEducationRepository.deleteById(id);
	}
	
	// 게시글 수정
	public void ntritionDietEducationUpdate(NutritionDietEducation ntritionDietEducation) {
		ntritionDietEducationRepository.save(ntritionDietEducation);
	}
	 
}
