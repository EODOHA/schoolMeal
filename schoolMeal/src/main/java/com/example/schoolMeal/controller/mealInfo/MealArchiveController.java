package com.example.schoolMeal.controller.mealInfo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.dto.mealInfo.MealArchiveDto;
import com.example.schoolMeal.service.mealInfo.MealArchiveFileService;
import com.example.schoolMeal.service.mealInfo.MealArchiveService;

@RestController
@RequestMapping("/mealArchive")
public class MealArchiveController {

	@Autowired
	private MealArchiveService archiveService;
	
	@Autowired
	private MealArchiveFileService fileService;
	
	//모든 게시글 조회
	@GetMapping
	public ResponseEntity<List<MealArchiveDto>> getAllArchives(){
		return ResponseEntity.ok(archiveService.getAllArchives());
	}
	
	// 게시글 상세 조회
	@GetMapping("/{arc_id}")
	public ResponseEntity<MealArchiveDto> getArchive(@PathVariable Long arc_id){
		MealArchiveDto mealArchiveDto = archiveService.getArchiveById(arc_id);
		return ResponseEntity.ok(mealArchiveDto);
	}
	
	// 게시글 생성
	@PostMapping
	public ResponseEntity<MealArchiveDto> createArchive(@ModelAttribute MealArchiveDto mealArchiveDto,
														@RequestPart(value="file", required=false) MultipartFile file){
		MealArchiveDto createdArchive = archiveService.createArchive(mealArchiveDto, file);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdArchive);
		
	}
	
	//게시글 수정
	@PutMapping("/{arc_id}")
	public ResponseEntity<MealArchiveDto> updateArchive(@PathVariable Long arc_id,
														@ModelAttribute MealArchiveDto archiveDto,
														@RequestParam(value="file", required=false)MultipartFile newfile){
		MealArchiveDto updatedArchive = archiveService.updateArchive(arc_id, archiveDto, newfile);
		return ResponseEntity.ok(updatedArchive);
	}
	
	//게시글 삭제
	@DeleteMapping("/{arc_id}")
	public ResponseEntity<Void> deleteArchive(@PathVariable Long arc_id){
		archiveService.deleteArchive(arc_id);
		return ResponseEntity.noContent().build();
	}

	
//	//파일 업로드
//	@PostMapping("/upload")
//	public ResponseEntity<MealArchiveFileDto> uploadFile(@RequestParam("file") MultipartFile file){
//		MealArchiveFileDto uploadedFile = fileService.uploadFile(file);
//		return ResponseEntity.ok(uploadedFile);
//	}
	
	//파일 다운로드
	@GetMapping("/download/{arc_storedFilename}")
	public ResponseEntity<Resource> downloadFile(@PathVariable String arc_storedFilename){
		
		//MealArchiveFileService로부터 Resource와 contentType을 Pair로 받아옴
		Pair<Resource, String> fileData = fileService.downloadFile(arc_storedFilename);
		Resource resource = fileData.getFirst();
		String contentType = fileData.getSecond();
		
//		// contentType에 따라 미리보기 또는 다운로드를 결정
//		String dispositionType = contentType.startsWith("image/")|| contentType.equals("application/pdf")
//				? "inline"	// 이미지 또는 pdf는 미리보기
//				: "attachment";	// 다운로드
		
		//파일을 다운로드 처리
		String dispositionType = "attachment";
		
		return ResponseEntity.ok()
				.contentType(MediaType.parseMediaType(contentType))
				.header(HttpHeaders.CONTENT_DISPOSITION, dispositionType+"; filename=\"" + resource.getFilename() + "\"")
				.body(resource);
	}
}
