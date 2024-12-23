package com.example.schoolMeal.controller.mealInfo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.schoolMeal.common.PathResolver;
import com.example.schoolMeal.domain.entity.mealInfo.ExpertHistory;
import com.example.schoolMeal.domain.entity.mealInfo.ExpertQualification;
import com.example.schoolMeal.domain.entity.mealInfo.MealExpert;
import com.example.schoolMeal.domain.repository.ImageUrlRepository;
import com.example.schoolMeal.dto.mealInfo.ExpertHistoryDto;
import com.example.schoolMeal.dto.mealInfo.ExpertQualificationDto;
import com.example.schoolMeal.dto.mealInfo.MealExpertDto;
import com.example.schoolMeal.service.mealInfo.MealExpertService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/mealExpert")
public class MealExpertController extends PathResolver {

	@Autowired
	private MealExpertService mealExpertService;

	// 급식 전문인력 생성
	@PostMapping
	public ResponseEntity<MealExpert> createExpert(@RequestBody MealExpertDto mealExpertDto) {
		MealExpert mealExpert = new MealExpert();
		mealExpert.setExp_name(mealExpertDto.getExp_name());
		mealExpert.setExp_department(mealExpertDto.getExp_department());
		mealExpert.setExp_position(mealExpertDto.getExp_position());
		mealExpert.setExp_email(mealExpertDto.getExp_email());

		// HistoryDto를 History 엔티티로 변환 및 연관 관계 설정
		if (mealExpertDto.getHistories() != null) {
			for (ExpertHistoryDto historyDto : mealExpertDto.getHistories()) {
				if (historyDto.getExp_hist_description() != null
						&& !historyDto.getExp_hist_description().trim().isEmpty()) {
					ExpertHistory history = new ExpertHistory();
					history.setExp_hist_description(historyDto.getExp_hist_description());
					mealExpert.addHistory(history);
				}
			}
		}
		// QualificationDto를 Qualification 엔티티로 변환 및 연관 관계 설정
		if (mealExpertDto.getQualifications() != null) {
			for (ExpertQualificationDto qualificationDto : mealExpertDto.getQualifications()) {
				if (qualificationDto.getExp_qual_description() != null
						&& !qualificationDto.getExp_qual_description().trim().isEmpty()) {
					ExpertQualification qualification = new ExpertQualification();
					qualification.setExp_qual_description(qualificationDto.getExp_qual_description());
					mealExpert.addQualification(qualification);
				}
			}
		}

		// 저장
		MealExpert savedExpert = mealExpertService.saveExpert(mealExpert);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedExpert);
	}

	// 전문인력 목록 조회
	@GetMapping
	public ResponseEntity<List<MealExpert>> getAllExperts() {
		List<MealExpert> mealExperts = mealExpertService.findAllExperts();
		return ResponseEntity.ok(mealExperts);
	}

	// 전문인력 상세조회
	@GetMapping("/{exp_id}")
	public ResponseEntity<MealExpert> getExpert(@PathVariable Long exp_id) {
		Optional<MealExpert> mealExpert = mealExpertService.findExpertById(exp_id);
		if (mealExpert.isPresent()) {
			return ResponseEntity.ok(mealExpert.get());
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}

	// 전문인력 정보 수정
	@PutMapping("/{exp_id}")
	public ResponseEntity<MealExpert> updateExpert(@PathVariable Long exp_id,
			@Valid @RequestBody MealExpertDto mealExpertDto) {
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

		MealExpert updatedExpert = mealExpertService.saveExpert(updateExpert);
		return ResponseEntity.ok(updatedExpert);
	}

	// 전문인력 삭제
	@DeleteMapping("/{exp_id}")
	public ResponseEntity<Void> deleteExpert(@PathVariable Long exp_id) {
		Optional<MealExpert> existingExpert = mealExpertService.findExpertById(exp_id);
		if (!existingExpert.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

		mealExpertService.deleteExpert(exp_id);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}
}
