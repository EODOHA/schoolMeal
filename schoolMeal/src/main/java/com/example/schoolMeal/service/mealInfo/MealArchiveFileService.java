package com.example.schoolMeal.service.mealInfo;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.common.PathResolver;
import com.example.schoolMeal.domain.entity.mealInfo.MealArchive;
import com.example.schoolMeal.domain.entity.mealInfo.MealArchiveFile;
import com.example.schoolMeal.domain.repository.mealInfo.MealArchiveFileRepository;
import com.example.schoolMeal.dto.mealInfo.MealArchiveFileDto;
import com.example.schoolMeal.exception.FileDownloadException;
import com.example.schoolMeal.exception.FileUploadException;

import jakarta.annotation.PostConstruct;

@Service
public class MealArchiveFileService extends PathResolver {
	private static final Logger logger = LoggerFactory.getLogger(MealArchiveFileService.class);

	@Autowired
	private MealArchiveFileRepository fileRepository;

	private String fileStoragePath;

	@PostConstruct
	public void init() {
		// 파일 업로드 경로 설정
		fileStoragePath = buildPath("MealArchive");
		logger.info("fileStoragePath: {}", fileStoragePath);

		// 디렉토리가 존재하지 않으면 생성
		File directory = new File(fileStoragePath);
		if (!directory.exists()) {
			boolean created = directory.mkdirs(); // 폴더 생성

			if (created) {
				logger.info("파일 저장 경로가 생성되었습니다.:{}", fileStoragePath);
			} else {
				logger.error("파일 저장 경로 생성에 실패하였습니다.:{}", fileStoragePath);
			}
		}

	}

	// 파일 업로드
	public MealArchiveFileDto uploadFile(MealArchive mealArchive, MultipartFile file) {
		try {
			// 파일 저장 경로 설정
			String originalFilename = file.getOriginalFilename();
			String storedFilename = UUID.randomUUID().toString() + "_" + originalFilename;
			Path targetPath = Paths.get(fileStoragePath, storedFilename);

//			logger.info("파일 저장 시작: 원본 파일명={}, 저장 파일명={}", originalFilename, storedFilename);
			Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

			// MealArchiveFile 객체 생성
			MealArchiveFile fileEntity = MealArchiveFile.builder()
					.arc_originalFilename(originalFilename)
					.arc_storedFilename(storedFilename)
					.arc_file_url(targetPath.toString())
					.arc_file_size(file.getSize())
					.arc_file_type(file.getContentType())
					.mealArchive(mealArchive)
					.build();

			logger.info("파일 저장 완료: 저장된 주소={}", targetPath.toString());

			return new MealArchiveFileDto(
					fileEntity.getArc_file_id(),
					fileEntity.getArc_originalFilename(),
					fileEntity.getArc_storedFilename(),
					fileEntity.getArc_file_url(),
					fileEntity.getArc_file_type(),
					fileEntity.getArc_file_size()
					);
		} catch (Exception e) {
			logger.error("파일 업로드 중 오류 발생: {}", e.getMessage(), e);
			throw new FileUploadException("파일 업로드 중 오류가 발생했습니다.", e);
		}
	}

	// 파일 다운로드(미리보기 함께 지원 MIME 타입 반환)
	// Pair-> 두 개의 객체를 한 쌍으로 묶어 관리하는 테이터 구조(Spring Framework 제공 클래스 이용)
	public Pair<Resource, String> downloadFile(String arc_storedFilename) {
		try {
			Path filePath = Paths.get(fileStoragePath, arc_storedFilename);
			logger.info("파일 경로: {}", filePath.toString());
			logger.info("filename: {}", arc_storedFilename);
			Resource resource = new UrlResource(filePath.toUri());

			if (!resource.exists()) {
				throw new FileDownloadException("파일을 찾을 수 없습니다.:" + arc_storedFilename);
			}

			// MIME 타입 결정
			String contentType = Files.probeContentType(filePath); //파일의 컨텐츠 타입
			if (contentType == null) {
				contentType = "application/octet-stream"; // 기본값 설
			}

			return Pair.of(resource, contentType);

		} catch (MalformedURLException e) {
			throw new FileDownloadException("파일 다운로드 중 오류가 발생했습니다.", e);
		} catch (IOException e) {
			throw new FileDownloadException("MIME 타입을 결정할 수 없습니다.", e);
		}
	}

	// 파일 수정
	public MealArchiveFileDto updateFile(Long file_id, MultipartFile newFile) {
		try {
			// 기존 파일 조회
			MealArchiveFile existingFile = fileRepository.findById(file_id)
					.orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다"));

			// 기존 파일 삭제(파일이 존재할 경우)
			Path oldFilePath = Paths.get(existingFile.getArc_file_url());
			if(Files.exists(oldFilePath)) {
			Files.deleteIfExists(oldFilePath);
			}
			
			// 새로운 파일 저장
			String originalFilename = newFile.getOriginalFilename();
			String storedFilename = UUID.randomUUID().toString() + "_" + originalFilename;
			Path targetLocation = Paths.get(fileStoragePath, storedFilename);
			Files.copy(newFile.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

			// 파일 DTO로 업데이트
			existingFile.setArc_originalFilename(originalFilename);
			existingFile.setArc_storedFilename(storedFilename);
			existingFile.setArc_file_url(targetLocation.toString());
			existingFile.setArc_file_size(newFile.getSize());
			existingFile.setArc_file_type(newFile.getContentType());

			// 파일 업데이트
			MealArchiveFile updatedFile = fileRepository.save(existingFile);

			return new MealArchiveFileDto(
					updatedFile.getArc_file_id(),
					updatedFile.getArc_originalFilename(),
					updatedFile.getArc_storedFilename(),
					updatedFile.getArc_file_url(),
					updatedFile.getArc_file_type(),
					updatedFile.getArc_file_size()
					);

		} catch (IOException e) {
			throw new RuntimeException("파일 수정 중 오류가 발생했습니다.", e);
		}
	}

	// 파일 삭제
	public void deleteFile(Long fileId) {
		try {
			// 파일 정보 조회
			MealArchiveFile existingFile = fileRepository.findById(fileId)
					.orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다"));

			// 파일 경로 가져오기
			Path filePath = Paths.get(existingFile.getArc_file_url());

			// 파일 물리적으로 삭제
			Files.deleteIfExists(filePath);

			// DB에서 파일 삭제
			fileRepository.delete(existingFile);

		} catch (IOException e) {
			throw new RuntimeException("파일 삭제 중 오류가 발생했습니다.", e);
		}
	}
	
}
