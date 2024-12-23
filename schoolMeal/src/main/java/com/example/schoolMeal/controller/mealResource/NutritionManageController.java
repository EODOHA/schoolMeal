package com.example.schoolMeal.controller.mealResource;

import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.schoolMeal.domain.entity.FileUrl;
import com.example.schoolMeal.domain.entity.mealResource.MealPolicyOperation;
import com.example.schoolMeal.domain.entity.mealResource.NutritionManage;
import com.example.schoolMeal.domain.repository.mealResource.NutritionManageRepository;
import com.example.schoolMeal.service.mealResource.NutritionManageService;

@RestController
@RequestMapping(value = "/nutritionManage")
public class NutritionManageController {

	@Autowired
	private NutritionManageRepository nutritionManageRepository;

	@Autowired
	private NutritionManageService nutritionManageService;

	// 목록을 반환
	@GetMapping("/list")
	public ResponseEntity<List<NutritionManage>> nutritionManageList(
			@RequestParam(value = "position", required = false) String position) {

		List<NutritionManage> nutritionManages;

		if (position != null && !position.isEmpty()) {
			// 영양사∙영양교사 필터링
			nutritionManages = nutritionManageService.nutritionManageByPosition(position);
		} else {
			// 전체 필터
			nutritionManages = nutritionManageService.nutritionManageList();
		}
		return ResponseEntity.ok(nutritionManages);
	}

	// 영양사∙영양교사 조회
	@GetMapping("/byPosition")
	public ResponseEntity<Map<String, Object>> getNutritionManageByPosition(@RequestParam String position) {
		System.out.println("Received position parameter: " + position);

		// 시기별 게시글 조회
		List<NutritionManage> nutritionManages = nutritionManageService.nutritionManageByPosition(position);

		// 응답 구조 생성
		Map<String, Object> response = new HashMap<>();
		response.put("_embedded", Collections.singletonMap("nutritionManage", nutritionManages));

		return ResponseEntity.ok(response);
	}

	// 작성 처리
	@PostMapping("/writepro")
	public String nutritionManageWritePro(@RequestParam("title") String title, @RequestParam("writer") String writer,
			@RequestParam("content") String content, @RequestParam("position") String position,
			@RequestParam(value = "file", required = false) MultipartFile file, RedirectAttributes redirectAttributes)
			throws IOException {
		NutritionManage nutritionManage = new NutritionManage();
		nutritionManage.setTitle(title);
		nutritionManage.setWriter(writer);
		nutritionManage.setContent(content);
		nutritionManage.setPosition(position);

		// 파일 디버깅 출력
		if (file != null && !file.isEmpty()) {
			System.out.println("파일 이름: " + file.getOriginalFilename());
			System.out.println("파일 크기: " + file.getSize());
		} else {
			System.out.println("첨부된 파일이 없습니다.");
		}

		// 파일 처리 로직
		nutritionManageService.write(nutritionManage, file);

		redirectAttributes.addFlashAttribute("message", "게시글이 성공적으로 작성되었습니다.");
		return "redirect:/nutritionManage/list";
	}

	// 특정 id 조회
	@GetMapping("/{id}")
	public ResponseEntity<NutritionManage> getNutritionManageById(@PathVariable Long id) {
		NutritionManage nutritionManage = nutritionManageService.getPostWithFileDetails(id);
		return nutritionManage != null ? ResponseEntity.ok(nutritionManage)
				: ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	}

	// 수정 처리하는 PUT 요청
	@PutMapping("/update/{id}")
	public ResponseEntity<String> updateNutritionManage(@PathVariable Long id,
			@RequestParam(value = "title", required = false) String title,
			@RequestParam(value = "content", required = false) String content,
			@RequestParam(value = "writer", required = false) String writer,
			@RequestParam(value = "file", required = false) MultipartFile file) {
		try {
			// 기존 데이터 조회
			NutritionManage existingNutritionManage = nutritionManageService.getPostWithFileDetails(id);
			if (existingNutritionManage == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글이 존재하지 않습니다.");
			}

			// 필드 업데이트
			if (title != null)
				existingNutritionManage.setTitle(title);
			if (content != null)
				existingNutritionManage.setContent(content);
			if (writer != null)
				existingNutritionManage.setWriter(writer);

			// 파일 처리 로직
			if (file != null && !file.isEmpty()) {
				System.out.println("첨부된 파일: " + file.getOriginalFilename());
				nutritionManageService.nutritionManageUpdate(existingNutritionManage, file);
			} else {
				System.out.println("첨부된 파일이 없습니다.");
				nutritionManageService.nutritionManageUpdate(existingNutritionManage, null);
			}

			return ResponseEntity.ok("수정되었습니다.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("수정 실패: " + e.getMessage());
		}
	}

	// 게시글 삭제
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteNutritionManage(@PathVariable Long id) {
		try {
			nutritionManageService.nutritionManageDelete(id);
			return ResponseEntity.ok("게시글이 삭제되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 실패: " + e.getMessage());
		}
	}

	// 파일 다운로드
	@GetMapping("/download/{id}")
	public ResponseEntity<InputStreamResource> downloadNutritionManage(@PathVariable Long id) {
		// 해당 ID의 게시글 조회
		NutritionManage nutritionManage = nutritionManageRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("해당 ID의 게시글이 존재하지 않습니다: " + id));

		// 게시글에 첨부된 파일이 있는지 확인
		if (nutritionManage.getFileUrl() == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

		FileUrl fileUrl = nutritionManage.getFileUrl();
		Path filePath = Paths.get(fileUrl.getFilePath()).normalize(); // 파일 경로 얻기

		// 파일 존재 여부 확인
		if (!Files.exists(filePath)) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

		try {
			InputStreamResource resource = new InputStreamResource(new FileInputStream(filePath.toFile()));

			// 파일의 MIME 타입을 설정. 기본적으로 파일 확장자에 맞는 컨텐츠 타입을 설정
			String contentType = Files.probeContentType(filePath);
			if (contentType == null) {
				contentType = "application/octet-stream"; // 기본 타입 설정
			}

			// 파일 이름 인코딩 (UTF-8로 인코딩 후 URL-safe 형식으로 변환)
			String encodedFileName = URLEncoder.encode(filePath.getFileName().toString(), "UTF-8").replaceAll("\\+",
					"%20");

			// 파일 다운로드 응답
			return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
					.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=utf-8''" + encodedFileName)
					.body(resource);

		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}
