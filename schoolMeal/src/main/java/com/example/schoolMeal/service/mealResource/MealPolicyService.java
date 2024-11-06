package com.example.schoolMeal.service.mealResource;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.schoolMeal.domain.entity.mealResource.MealPolicy;
import com.example.schoolMeal.domain.repository.mealResource.MealPolicyRepository;

@Service
public class MealPolicyService {
	
	@Autowired
	private MealPolicyRepository mealPolicyRepository;
	
	// 글 작성
	public void write(MealPolicy mealPolicy) {
		mealPolicyRepository.save(mealPolicy);
	}
	
	// 게시글 리스트 처리
	public List<MealPolicy> mealPolicyList() {
		return mealPolicyRepository.findAll();
	}
	
	// 특정 게시글 불러오기
	public MealPolicy mealPolicyView(Integer id) {
		return mealPolicyRepository.findById(id).get();
	}
	
	/*     미구현
	// 특정 게시글 삭제
	public void mealPolicyDelete(Integer id) {
		mealPolicyRepository.deleteById(id);
	}
	
	// 게시글 수정
	public void mealPolicyUpdate(MealPolicy mealPolicy) {
		mealPolicyRepository.updateById(mealPolicy);
	}
	
	*/
}
