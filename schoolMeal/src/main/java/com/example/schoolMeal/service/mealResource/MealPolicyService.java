package com.example.schoolMeal.service.mealResource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
	
	// 파일을 서버에 저장
	public String saveImage(MultipartFile file) throws IOException {
		// 파일 이름 중복 방지
		String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
	    Path path = Paths.get("src/main/resources/static/images/mealPolicy"
	    								+ fileName);
	    try {
	    	Files.createDirectories(path.getParent());  // 디렉토리가 없으면 생성
	    	Files.write(path, file.getBytes());
		} catch (IOException e) {
			e.printStackTrace();
		}
		return "/images/mealPliocy/" + fileName;  // URL 경로 반환
	}
	
	// 게시글 리스트 처리
	public List<MealPolicy> mealPolicyList() {
		return mealPolicyRepository.findAll();
	}
	
	// 특정 게시글 불러오기
	public MealPolicy mealPolicyView(Integer id) {
		return mealPolicyRepository.findById(id).get();
	}
	

	// 특정 게시글 삭제
	public void mealPolicyDelete(Integer id) {
		mealPolicyRepository.deleteById(id);
		
	}
	
	// 게시글 수정
	public void mealPolicyUpdate(MealPolicy mealPolicy) {
		mealPolicyRepository.save(mealPolicy);
	}
	
}
