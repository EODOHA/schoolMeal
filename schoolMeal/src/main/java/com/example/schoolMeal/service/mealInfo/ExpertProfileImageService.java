package com.example.schoolMeal.service.mealInfo;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.domain.entity.mealInfo.ExpertProfileImage;
import com.example.schoolMeal.domain.entity.mealInfo.MealExpert;
import com.example.schoolMeal.domain.repository.mealInfo.ExpertProfileImageRepository;
import com.example.schoolMeal.domain.repository.mealInfo.MealExpertRepository;
import com.example.schoolMeal.dto.mealInfo.ExpertProfileImageDto;

@Service
public class ExpertProfileImageService {
	
	@Autowired
	private ExpertProfileImageRepository profileImageRepository;
	
	@Autowired
	private MealExpertRepository expertRepository;
	
	// 이미지 업로드
	 public ExpertProfileImage uploadImage(MultipartFile file, MealExpert mealExpert) throws IOException {
	        ExpertProfileImage image = new ExpertProfileImage();
	        image.setName(file.getOriginalFilename());
	        image.setMimeType(file.getContentType());
	        image.setData(file.getBytes());
	        image.setMealExpert(mealExpert);
	        return image;
	    }
	
	// 이미지 조회 (Base64 반환)
	public List<ExpertProfileImageDto> getImagesById(Long id, Long exp_id) {
		//전문가 정보 조회
				MealExpert mealExpert = expertRepository.findById(exp_id).orElseThrow(()-> new RuntimeException("전문인력을 찾을 수 없습니다."));
		return profileImageRepository.findAll().stream()
				.filter(profileImage-> profileImage.getId().equals(id) && profileImage.getMealExpert().getExp_id().equals(exp_id))
				.map(profileImage -> {
					String base64Data = 
							java.util.Base64.getEncoder()
								.encodeToString(profileImage.getData());
					
					// MIME 타입에 따라 Base64 URL 접두어 설정.
					String dataUrl = 
							"data:" + profileImage.getMimeType() + ";base64," + base64Data;
					
					return new ExpertProfileImageDto(
							profileImage.getId(),
							// Base64로 인코딩된 데이터 반환.
							dataUrl,
							profileImage.getName(),
							profileImage.getMimeType(),
							profileImage.getMealExpert().getExp_id()
						);
				})
				.collect(Collectors.toList());
	}
	
	// 이미지 수정
	public void updateImage(ExpertProfileImage image, MultipartFile file) throws IOException {
        image.setName(file.getOriginalFilename());
        image.setMimeType(file.getContentType());
        image.setData(file.getBytes());
    }
	
	// 이미지 삭제
	public void deleteExpertProfileImage(Long id, Long exp_id) {
		 MealExpert mealExpert = expertRepository.findById(exp_id)
	                .orElseThrow(() -> new RuntimeException("전문인력을 찾을 수 없습니다."));
		// 해당 전문가의 프로필 이미지 삭제
	        ExpertProfileImage image = profileImageRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("이미지를 찾을 수 없습니다."));
	        if (image.getMealExpert().equals(mealExpert)) {
	            // 이미지 삭제 (파일 시스템에서 파일도 삭제 가능)
	            profileImageRepository.delete(image);
	        } else {
	            throw new RuntimeException("해당 전문가의 이미지가 아닙니다.");
	        }
	    }
	}