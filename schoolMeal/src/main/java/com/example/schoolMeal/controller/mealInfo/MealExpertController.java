package com.example.schoolMeal.controller.mealInfo;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.domain.entity.mealInfo.ExpertHistory;
import com.example.schoolMeal.domain.entity.mealInfo.ExpertProfileImage;
import com.example.schoolMeal.domain.entity.mealInfo.ExpertQualification;
import com.example.schoolMeal.domain.entity.mealInfo.MealExpert;
import com.example.schoolMeal.dto.mealInfo.ExpertHistoryDto;
import com.example.schoolMeal.dto.mealInfo.ExpertProfileImageDto;
import com.example.schoolMeal.dto.mealInfo.ExpertQualificationDto;
import com.example.schoolMeal.dto.mealInfo.MealExpertDto;
import com.example.schoolMeal.service.mealInfo.ExpertProfileImageService;
import com.example.schoolMeal.service.mealInfo.MealExpertService;

@RestController
@RequestMapping("/mealInfo") // 상위 메뉴 -> 급식정보
public class MealExpertController {
	private static final Logger logger = LoggerFactory.getLogger(MealExpertController.class);

	@Autowired
	private MealExpertService mealExpertService;

	@Autowired
	private ExpertProfileImageService profileImageService;

	// 급식 전문인력 생성
	@PostMapping("/experts")
	public ResponseEntity<MealExpert> createExpert(@ModelAttribute MealExpertDto mealExpertDto,
			@RequestParam(value = "profileImage", required = false) MultipartFile profileImage) throws IOException {
		
		// MealExpert 생성
		MealExpert mealExpert = new MealExpert();
		mealExpert.setExp_name(mealExpertDto.getExp_name());
		mealExpert.setExp_department(mealExpertDto.getExp_department());
		mealExpert.setExp_position(mealExpertDto.getExp_position());
		mealExpert.setExp_email(mealExpertDto.getExp_email());

		// HistoryDto를 History 엔티티로 변환 및 연관 관계 설정
		if (mealExpertDto.getHistories() != null) {
			for (ExpertHistoryDto historyDto : mealExpertDto.getHistories()) {
				ExpertHistory history = new ExpertHistory();
				history.setExp_hist_description(historyDto.getExp_hist_description());
				mealExpert.addHistory(history);
			}
		}
		// QualificationDto를 Qualification 엔티티로 변환 및 연관 관계 설정
		if (mealExpertDto.getQualifications() != null) {
			for (ExpertQualificationDto qualificationDto : mealExpertDto.getQualifications()) {
				ExpertQualification qualification = new ExpertQualification();
				qualification.setExp_qual_description(qualificationDto.getExp_qual_description());
				mealExpert.addQualification(qualification);
			}
		}

		// 프로필 이미지 설정
		if (profileImage != null && !profileImage.isEmpty()) {
			ExpertProfileImage image = profileImageService.uploadImage(profileImage, mealExpert);
			mealExpert.setProfileImage(image);
		}

		// 저장
		MealExpert savedExpert = mealExpertService.saveExpert(mealExpert);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedExpert);
	}

	// 전문인력 목록 조회
	@GetMapping("/experts")
	public ResponseEntity<List<MealExpert>> getAllExperts() {
		List<MealExpert> mealExperts = mealExpertService.findAllExperts();
		return ResponseEntity.ok(mealExperts);
	}

	// 전문인력 상세조회
	@GetMapping("/experts/{exp_id}")
	public ResponseEntity<MealExpert> getExpert(@PathVariable Long exp_id) {
		Optional<MealExpert> mealExpert = mealExpertService.findExpertById(exp_id);
		if (mealExpert.isPresent()) {
			return ResponseEntity.ok(mealExpert.get());
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}

	// 전문인력 정보 수정
	@PutMapping("/experts/{exp_id}")
	public ResponseEntity<MealExpert> updateExpert(@PathVariable Long exp_id,
			@ModelAttribute MealExpertDto mealExpertDto,
			@RequestParam(value = "profileImage", required = false) MultipartFile profileImage) throws IOException {
		Optional<MealExpert> existingExpert = mealExpertService.findExpertById(exp_id);
		if (!existingExpert.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		MealExpert updateExpert = existingExpert.get();
		updateExpert.setExp_name(mealExpertDto.getExp_name());
		updateExpert.setExp_department(mealExpertDto.getExp_department());
		updateExpert.setExp_position(mealExpertDto.getExp_position());
		updateExpert.setExp_email(mealExpertDto.getExp_email());

		// History 업데이트
		updateExpert.getHistories().clear();
		for (ExpertHistoryDto historyDto : mealExpertDto.getHistories()) {
			ExpertHistory history = new ExpertHistory();
			history.setExp_hist_description(historyDto.getExp_hist_description());
			updateExpert.addHistory(history);
		}

		// Qualification 업데이트
		updateExpert.getQualifications().clear();
		for (ExpertQualificationDto qualificationDto : mealExpertDto.getQualifications()) {
			ExpertQualification qualification = new ExpertQualification();
			qualification.setExp_qual_description(qualificationDto.getExp_qual_description());
			updateExpert.addQualification(qualification);
		}

		// 프로필 이미지 업데이트
		if (profileImage != null && !profileImage.isEmpty()) {
			ExpertProfileImage image = updateExpert.getProfileImage();
			if (image == null) {
				image = new ExpertProfileImage();
				updateExpert.setProfileImage(image);
			}
			profileImageService.updateImage(image, profileImage);
		}

		MealExpert updatedExpert = mealExpertService.saveExpert(updateExpert);
		return ResponseEntity.ok(updatedExpert);
	}

	// 전문인력 삭제
	@DeleteMapping("/experts/{exp_id}")
	public ResponseEntity<Void> deleteExpert(@PathVariable Long exp_id) {
		Optional<MealExpert> existingExpert = mealExpertService.findExpertById(exp_id);
		if (!existingExpert.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

		MealExpert mealExpert = existingExpert.get();

		// 연관된 프로필 이미지 삭제
		if (mealExpert.getProfileImage() != null) {
			profileImageService.deleteExpertProfileImage(mealExpert.getProfileImage().getId(), exp_id);
		}

		mealExpertService.deleteExpert(exp_id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	// 프로필 이미지 보기
	@GetMapping("/experts/{exp_id}/profile/{id}")
	public ResponseEntity<String> getProfileImage(@PathVariable Long exp_id, @PathVariable Long id) {
		try {
			// Base64 URL 반환
			List<ExpertProfileImageDto> profileImages = profileImageService.getImagesById(id, exp_id);

			// 이미지가 없을 경우 기본 이미지 URL 반환
			if (profileImages.isEmpty()) {
				return ResponseEntity.ok(
						"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAAAAAAzKd65AAAgAElEQVR4nOzdfbA....");
			}

			// 이미지가 있으면 첫 번째 이미지 URL 반환
			return ResponseEntity.ok(profileImages.get(0).getUrl());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이미지 조회 실패");
		}
	}

}
