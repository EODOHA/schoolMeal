package com.example.schoolMeal.controller.imageManage;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.dto.imageManage.ImageManageDto;
import com.example.schoolMeal.service.imageManage.ImageManageService;

@RestController
@RequestMapping("/imageManage")
public class ImageManageController {
	
	@Autowired
	private ImageManageService imageManageService;
	
	// 카테고리별 이미지 가져오기
	@GetMapping("/{category}")
	public ResponseEntity<List<ImageManageDto>> getImagesByCategory(@PathVariable String category) {
		return ResponseEntity.ok(imageManageService.getImagesByCategory(category));
	}
	
	// 이미지 업로드
	@PostMapping("/{category}")
	public ResponseEntity<ImageManageDto> uploadImage(
											@RequestParam("file") MultipartFile file,
											@PathVariable String category) {
		try {
			return ResponseEntity.ok(imageManageService.uploadImage(file, category));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(null);
		}
	}
	
	// 이미지 수정
	@PutMapping("/{category}/{id}")
	public ResponseEntity<ImageManageDto> updateImage(
											@RequestParam("file") MultipartFile file,
											@PathVariable Long id,
											@PathVariable String category) {
		try {
			return ResponseEntity.ok(imageManageService.updateImage(id, file, category));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(null);
		}
	}
		
	// 이미지 삭제
	@DeleteMapping("/{category}/{id}")
	public ResponseEntity<Void> deleteImageManage(@PathVariable Long id) {
		imageManageService.deleteImageManage(id);
		return ResponseEntity.noContent().build();
	}
}
