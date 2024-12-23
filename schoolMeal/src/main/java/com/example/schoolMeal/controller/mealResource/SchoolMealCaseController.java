package com.example.schoolMeal.controller.mealResource;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

import com.example.schoolMeal.domain.entity.FileUrl;
import com.example.schoolMeal.domain.entity.ImageUrl;
import com.example.schoolMeal.domain.entity.mealResource.SchoolMealCase;
import com.example.schoolMeal.domain.repository.mealResource.SchoolMealCaseRepository;
import com.example.schoolMeal.service.mealResource.SchoolMealCaseService;

@RestController
@RequestMapping(value = "/schoolMealCase")
public class SchoolMealCaseController {

	@Autowired
	private SchoolMealCaseRepository schoolMealCaseRepository;

	@Autowired
	private SchoolMealCaseService schoolMealCaseService;

	// 목록을 반환
	@GetMapping("/list")
	public ResponseEntity<List<SchoolMealCase>> schoolMealCaseList() {
		List<SchoolMealCase> schools = schoolMealCaseService.schoolMealCaseList();
		return ResponseEntity.ok(schools);
	}

	// 작성 처리
	@PostMapping("/writepro")
	public ResponseEntity<Map<String, String>> schoolMealCaseWritePro(@RequestParam("title") String title,
			@RequestParam("writer") String writer, @RequestParam("content") String content,
			@RequestParam(value = "file", required = false) MultipartFile file,
			@RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
		SchoolMealCase schoolMealCase = new SchoolMealCase();
		schoolMealCase.setTitle(title);
		schoolMealCase.setWriter(writer);
		schoolMealCase.setContent(content);

		// 파일 및 이미지 처리
		String fileUrls = schoolMealCaseService.write(schoolMealCase, file, image);

		// 파일과 이미지 URL을 분리해서 Map에 추가
		String[] urls = fileUrls.split(",");
		String fileUrl = urls.length > 0 ? urls[0] : null;
		String imageUrl = urls.length > 1 ? urls[1] : null;

		// 응답으로 URL 전달
		Map<String, String> response = new HashMap<>();
		response.put("fileUrl", fileUrl); // 파일 URL
		response.put("imageUrl", imageUrl); // 이미지 URL

		return ResponseEntity.ok(response); // JSON 응답 반환
	}

	// 특정 id 조회
	@GetMapping("/{id}")
	public ResponseEntity<SchoolMealCase> getSchoolMealCaseById(@PathVariable Long id) {
		SchoolMealCase schoolMealCase = schoolMealCaseService.getPostWithFileDetails(id);
		return schoolMealCase != null ? ResponseEntity.ok(schoolMealCase)
				: ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	}

	// 수정 처리하는 PUT 요청
	@PutMapping("/update/{id}")
	public ResponseEntity<String> updateSchoolMealCase(@PathVariable Long id,
			@RequestParam(value = "title", required = false) String title,
			@RequestParam(value = "content", required = false) String content,
			@RequestParam(value = "writer", required = false) String writer,
			@RequestParam(value = "file", required = false) MultipartFile file,
			@RequestParam(value = "image", required = false) MultipartFile image) {
		try {
			// 기존 데이터 조회
			SchoolMealCase existingSchoolMealCase = schoolMealCaseService.getPostWithFileDetails(id);
			if (existingSchoolMealCase == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글이 존재하지 않습니다.");
			}

			// 필드 업데이트
			if (title != null)
				existingSchoolMealCase.setTitle(title);
			if (content != null)
				existingSchoolMealCase.setContent(content);
			if (writer != null)
				existingSchoolMealCase.setWriter(writer);

			// 파일 및 이미지 처리
			schoolMealCaseService.schoolMealCaseUpdate(existingSchoolMealCase, file, image);

			return ResponseEntity.ok("수정되었습니다.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("수정 실패: " + e.getMessage());
		}
	}

	// 이미지 조회 처리
	@GetMapping("/image/{imageUrlId}")
	public ResponseEntity<byte[]> getImage(@PathVariable Long imageUrlId) {
	    try {
	        // 이미지 URL 가져오기
	        ImageUrl imageUrl = schoolMealCaseService.getImageUrlById(imageUrlId); // 서비스 메서드 호출
	        if (imageUrl == null) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 이미지가 없으면 404 반환
	        }

	        // 이미지 경로 설정
	        String schoolImagePath = imageUrl.getImgPath(); // 이미지 경로는 데이터베이스에서 가져온 경로 사용
	        Path filePath = Paths.get(schoolImagePath).normalize(); // 경로를 정규화

	        File file = filePath.toFile();
	        if (!file.exists()) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 파일이 존재하지 않으면 404 반환
	        }

	        byte[] imageBytes = Files.readAllBytes(filePath);
	        String contentType = Files.probeContentType(filePath);
	        if (contentType == null) {
	            contentType = "application/octet-stream"; // MIME 타입이 없으면 기본 타입 설정
	        }

	        // 이미지 다운로드 응답
	        return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
	                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + imageUrl.getImgName() + "\"").body(imageBytes);

	    } catch (IOException e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 내부 서버 오류
	    }
	}

    // 이미지 반환
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            // SchoolMealCaseService에서 설정된 경로 사용
            String schoolImagePath = schoolMealCaseService.getSchoolImagePath();
            Path filePath = Paths.get(schoolImagePath).resolve(filename).normalize(); 
            File file = filePath.toFile();
            if (!file.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            byte[] imageBytes = Files.readAllBytes(filePath);
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"").body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
	// 게시글 삭제
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteSchoolMealCase(@PathVariable Long id) {
		try {
			schoolMealCaseService.schoolMealCaseDelete(id);
			return ResponseEntity.ok("게시글이 삭제되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 실패: " + e.getMessage());
		}
	}

	// 파일 다운로드
	@GetMapping("/download/file/{id}")
	public ResponseEntity<InputStreamResource> downloadFile(@PathVariable Long id) {
	    // 해당 ID의 게시글 조회
	    SchoolMealCase schoolMealCase = schoolMealCaseRepository.findById(id)
	            .orElseThrow(() -> new IllegalArgumentException("해당 ID의 게시글이 존재하지 않습니다: " + id));

	    // 게시글에 첨부된 파일이 있는지 확인
	    if (schoolMealCase.getFileUrl() == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	    }

	    FileUrl fileUrl = schoolMealCase.getFileUrl();
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
	        String encodedFileName = URLEncoder.encode(filePath.getFileName().toString(), "UTF-8")
	                .replaceAll("\\+", "%20"); // 공백을 %20으로 변환

	        // 파일 다운로드 응답
	        return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
	                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=utf-8''" + encodedFileName)
	                .body(resource);

	    } catch (IOException e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}

	// 이미지 다운로드
	@GetMapping("/download/image/{id}")
	public ResponseEntity<InputStreamResource> downloadImage(@PathVariable Long id) {
	    // 해당 ID의 게시글 조회
	    SchoolMealCase schoolMealCase = schoolMealCaseRepository.findById(id)
	            .orElseThrow(() -> new IllegalArgumentException("해당 ID의 게시글이 존재하지 않습니다: " + id));

	    // 게시글에 첨부된 이미지가 있는지 확인
	    if (schoolMealCase.getImageUrl() == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	    }

	    ImageUrl imageUrl = schoolMealCase.getImageUrl();
	    Path imagePath = Paths.get(imageUrl.getImgPath()).normalize(); // 이미지 경로 얻기

	    // 이미지 존재 여부 확인
	    if (!Files.exists(imagePath)) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	    }

	    try {
	        InputStreamResource resource = new InputStreamResource(new FileInputStream(imagePath.toFile()));

	        // 이미지의 MIME 타입을 설정. 기본적으로 이미지 확장자에 맞는 컨텐츠 타입을 설정
	        String contentType = Files.probeContentType(imagePath);
	        if (contentType == null) {
	            contentType = "application/octet-stream"; // 기본 타입 설정
	        }

	        // 파일 이름 인코딩 (UTF-8로 인코딩 후 URL-safe 형식으로 변환)
	        String encodedFileName = URLEncoder.encode(imagePath.getFileName().toString(), "UTF-8")
	                .replaceAll("\\+", "%20"); // 공백을 %20으로 변환

	        // 이미지 다운로드 응답
	        return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
	                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=utf-8''" + encodedFileName)
	                .body(resource);

	    } catch (IOException e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}
}
