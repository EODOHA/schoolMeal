package com.example.schoolMeal.controller.adminNotice;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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

import com.example.schoolMeal.common.PathResolver;
import com.example.schoolMeal.domain.entity.adminNotice.AdminNotice;
import com.example.schoolMeal.domain.repository.adminNotice.AdminNoticeRepository;
import com.example.schoolMeal.service.adminNotice.AdminNoticeService;

@RestController
@RequestMapping("/adminNotice")
public class AdminNoticeController extends PathResolver {

	@Value("${file.upload.path}") // 파일이 저장된 디렉토리 경로
    private String uploadPath;
	
	@Autowired
	private AdminNoticeService adminNoticeService;
	
	@Autowired
	private AdminNoticeRepository adminNoticeRepository;
	
	@GetMapping
	public List<AdminNotice> getAllNotices() {
		return adminNoticeService.getAllNotices();
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<AdminNotice> getNoticeById(@PathVariable("id") Long id) {
		AdminNotice notice = adminNoticeService.getNoticeById(id);
		if (notice == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		return ResponseEntity.ok(notice);
	}
	
	@PostMapping
    public ResponseEntity<?> createNotice(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        String author = "admin"; // author를 고정값으로 설정
        String uploadDirectory = buildPath("notices"); // "notices" 하위 디렉토리에 저장

        try {
            // 디렉토리 생성
            File directory = new File(uploadDirectory);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // 파일 저장
            String fileName = null;
            if (file != null && !file.isEmpty()) {
                fileName = file.getOriginalFilename();
                Path filePath = Paths.get(uploadDirectory, fileName);
                Files.copy(file.getInputStream(), filePath);
            }

            AdminNotice notice = new AdminNotice(title, content, author, fileName);
            adminNoticeRepository.save(notice);

            return ResponseEntity.ok("공지사항이 성공적으로 추가되었습니다.");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("파일 업로드 실패: " + e.getMessage());
        }
    }
	
	@GetMapping("/download/{fileName}")
	public ResponseEntity<InputStreamResource> downloadFile(@PathVariable String fileName) {
		String fileDirectory = buildPath("notices"); // 파일이 저장된 디렉토리.
		
		try {
			// 파일 경로 생성
			File file = new File(fileDirectory + fileName);
			
			// 파일이 존재하지 않으면, 404 에러
			if (!file.exists()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			}
			
			// 파일을 InputStream으로 읽기.
			InputStream fileInputStream = new FileInputStream(file);

            // 파일의 확장자에 따른 Content-Type 설정
            String contentType = "application/octet-stream"; // 기본적으로 바이너리 스트림으로 설정

         // 파일 이름 URL 인코딩
            String encodedFileName = URLEncoder.encode(file.getName(), StandardCharsets.UTF_8.toString());
			
         // 파일을 다운로드할 때 사용할 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=" + encodedFileName); // 다운로드용 파일 이름 지정
            headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
            headers.add("Pragma", "no-cache");
            headers.add("Content-Type", contentType);  // 정확한 파일 타입 추가
            
            // 파일을 InputStreamResource로 래핑하여 반환.
            return ResponseEntity.ok()
            		.headers(headers)
            		.body(new InputStreamResource(fileInputStream));
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> updateAdminNotice(
			@PathVariable Long id,
			@RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "file", required = false) MultipartFile file) {
		
		try {
			AdminNotice existingNotice = adminNoticeService.getNoticeById(id);
			if (existingNotice == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 공지사항을 찾을 수 없습니다.");
			}
			
			// 제목, 내용 업데이트.
			existingNotice.setTitle(title);
			existingNotice.setContent(content);
			
			// 파일 처리.
			if (file != null && !file.isEmpty()) {
				String uploadDirectory = buildPath("notices");
				
				// 디렉토리 생성.
				File directory = new File(uploadDirectory);
				if (!directory.exists()) {
					directory.mkdirs();
				}
				
				// 기존 파일 삭제.
				if (existingNotice.getFileName() != null) {
					Path oldFilePath = Paths.get(uploadDirectory, existingNotice.getFileName());
					Files.deleteIfExists(oldFilePath);
				}
				
				// 새 파일 저장.
				String fileName = file.getOriginalFilename();
				Path filePath = Paths.get(uploadDirectory, fileName);
				Files.copy(file.getInputStream(), filePath);
				
				existingNotice.setFileName(fileName);
			}
			adminNoticeService.updateAdminNotice(id, existingNotice);
			return ResponseEntity.ok("공지사항이 성공적으로 수정되었습니다.");
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 처리 중 오류가 발생했습니다." + e.getMessage());
		}
	}
	
	@DeleteMapping("/{id}")
	public void deleteAdminNotice(@PathVariable Long id) {
		adminNoticeService.deleteAdminNotice(id);
	}
	
	@DeleteMapping("/deleteFile/{id}")
    public ResponseEntity<String> deleteFile(@PathVariable Long id) {
        // DB에서 해당 파일 정보 삭제
        String fileName = adminNoticeService.getFileNameById(id);
        if (fileName != null) {
            try {
                // 파일 시스템에서 파일 삭제
                Path filePath = Paths.get(getNoticesUploadPath(), fileName);
                Files.deleteIfExists(filePath); // 파일 삭제
                // DB에서 파일 정보 삭제
                adminNoticeService.removeFile(id);
                return ResponseEntity.ok("첨부파일이 삭제되었습니다.");
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body("첨부파일 삭제에 실패했습니다.");
            }
        } else {
            return ResponseEntity.status(404).body("첨부파일을 찾을 수 없습니다.");
        }
    }
	
	public String getNoticesUploadPath() {
		return uploadPath + "notices/";
	}
}
