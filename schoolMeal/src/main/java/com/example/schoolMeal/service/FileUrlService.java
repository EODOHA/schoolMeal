package com.example.schoolMeal.service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.common.PathResolver;
import com.example.schoolMeal.domain.entity.FileUrl;
import com.example.schoolMeal.domain.repository.FileUrlRepository;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;

@Service
public class FileUrlService extends PathResolver {

	@Autowired
	private FileUrlRepository fileUrlRepository;

	// 급식자료실
	private String mealPolicyOperationPath;
	private String menuRecipePath;
	private String nutritionManagePath;
	private String mealHygienePath;
	private String mealFacilityEquipmentPath;
	private String schoolMealCasesPath;

	// 교육자료
	private String nutritionPath;
	private String videoEduPath;
	private String lessonDemoPath;
	private String eduMaterialSharingPath;

	// 서비스별 경로 맵핑
	private Map<String, String> servicePathMap;

	@PostConstruct
	public void init() {
		mealPolicyOperationPath = buildPath("급식 정책 자료실");
		menuRecipePath = buildPath("메뉴 및 레시피 자료실");
		nutritionManagePath = buildPath("영양관리 자료실");
		mealHygienePath = buildPath("급식위생 자료실");
		mealFacilityEquipmentPath = buildPath("급식 시설 및 설비 자료실");
		schoolMealCasesPath = buildPath("학교급식 우수사례 자료실");

		nutritionPath = buildPath("영양·식생활 자료실");
		videoEduPath = buildPath("교육영상 자료실");
		lessonDemoPath = buildPath("수업&시연 영상 자료실");
		eduMaterialSharingPath = buildPath("교육자료 나눔 자료실");

		// HashMap을 사용하여 서비스별 경로 맵핑
	    servicePathMap = new HashMap<>();
	    servicePathMap.put("service1", mealPolicyOperationPath);
	    servicePathMap.put("service2", menuRecipePath);
	    servicePathMap.put("service3", nutritionManagePath);
	    servicePathMap.put("service4", mealHygienePath);
	    servicePathMap.put("service5", mealFacilityEquipmentPath);
	    servicePathMap.put("service6", schoolMealCasesPath);
	    servicePathMap.put("service8", nutritionPath);
	    servicePathMap.put("service9", videoEduPath);
	    servicePathMap.put("service10", lessonDemoPath);
	    servicePathMap.put("service11", eduMaterialSharingPath);
	}

	@Transactional
	public FileUrl saveFile(MultipartFile file, Long existingFileId, String serviceType) throws IOException {
		if (file == null || file.isEmpty()) {
			// 파일이 없으면 null 반환 (혹은 fileUrl을 null로 설정하는 방식도 가능)
			return null;
		}

		// 기존 파일이 있으면 삭제
		if (existingFileId != null) {
			deleteFile(existingFileId); // 기존 파일 삭제
		}

		// 새 파일 저장
		String origFilename = file.getOriginalFilename();
		String filename = System.currentTimeMillis() + "_" + origFilename;

		// 서비스별 저장 경로 선택
		String savePath = selectSavePath(serviceType);

		java.io.File saveDir = new java.io.File(savePath);
		if (!saveDir.exists()) {
			boolean dirsCreated = saveDir.mkdirs();
			if (!dirsCreated) {
				throw new IOException("파일 저장 경로를 생성할 수 없습니다: " + savePath);
			}
		}

		// 파일을 저장할 경로와 이름 설정
		String filePath = savePath + File.separator + filename;
		java.io.File destFile = new java.io.File(filePath);

		// 파일 저장
		try {
			file.transferTo(destFile); // 파일을 해당 경로에 저장
		} catch (IOException e) {
			throw new IOException("파일 저장 중 오류가 발생했습니다: " + e.getMessage(), e);
		}

		// 파일 정보를 DB에 저장
		FileUrl newFileUrl = FileUrl.builder().origFileName(origFilename).fileName(filename).filePath(filePath)
				.fileSize(file.getSize()) // 추가로 파일 크기를 저장할 경우
				.build();

		return fileUrlRepository.save(newFileUrl); // DB에 파일 정보 저장 후 반환
	}

	private String selectSavePath(String serviceType) {
		// 서비스 타입에 해당하는 경로 반환, 없으면 예외 발생
		String path = servicePathMap.get(serviceType);
		if (path == null) {
			throw new IllegalArgumentException("지원하지 않는 서비스 유형: " + serviceType);
		}
		return path;
	}

	// 파일 삭제 메서드
	@Transactional
	public void deleteFile(Long fileId) throws IOException {
		// 파일 정보 가져오기
		FileUrl fileUrl = fileUrlRepository.findById(fileId)
				.orElseThrow(() -> new IllegalArgumentException("파일을 찾을 수 없습니다: " + fileId));

		// 파일 삭제 전에 경로를 확인
		String filePath = fileUrl.getFilePath();
		File fileToDelete = new File(filePath);

		// 파일이 존재하는지 확인
		if (!fileToDelete.exists()) {
			throw new IOException("파일이 존재하지 않습니다: " + filePath);
		}

		// 파일 삭제 시도
		boolean deleted = fileToDelete.delete();
		if (!deleted) {
			// 삭제 실패 시 예외 처리
			throw new IOException("파일 삭제 실패: " + filePath);
		} else {
			// 삭제 성공 시 로그 추가
			System.out.println("파일 삭제 성공: " + filePath);
		}

		// DB에서 파일 정보 삭제
		fileUrlRepository.delete(fileUrl);
	}

	// 파일 정보를 DB에서 가져오는 메서드
	@Transactional
	public FileUrl getFile(Long fileId) {
		return fileUrlRepository.findById(fileId)
				.orElseThrow(() -> new IllegalArgumentException("파일을 찾을 수 없습니다: " + fileId));
	}
}
