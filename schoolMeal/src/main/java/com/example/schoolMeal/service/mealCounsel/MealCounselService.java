package com.example.schoolMeal.service.mealCounsel;

import com.example.schoolMeal.domain.entity.FileUrl;
import com.example.schoolMeal.domain.entity.mealCounsel.MealCounsel;
import com.example.schoolMeal.domain.entity.mealCounsel.MealCounselSpecifications;
import com.example.schoolMeal.domain.repository.FileUrlRepository;
import com.example.schoolMeal.domain.repository.mealCounsel.MealCounselRepository;
import com.example.schoolMeal.dto.mealCounsel.MealCounselRequestDTO;
import com.example.schoolMeal.dto.mealCounsel.MealCounselResponseDTO;
import com.example.schoolMeal.exception.FileUploadException;
import com.example.schoolMeal.exception.FileDownloadException;
import com.example.schoolMeal.service.FileUrlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MealCounselService {

    private final MealCounselRepository mealCounselRepository;
    private final FileUrlService fileUrlService;
    private final FileUrlRepository fileUrlRepository;

    @Autowired
    public MealCounselService(MealCounselRepository mealCounselRepository,
                              FileUrlService fileUrlService,
                              FileUrlRepository fileUrlRepository) {
        this.mealCounselRepository = mealCounselRepository;
        this.fileUrlService = fileUrlService;
        this.fileUrlRepository = fileUrlRepository;
    }

    // 모든 게시글 조회
    public List<MealCounselResponseDTO> getAllCounselPosts() {
        return mealCounselRepository.findAll().stream()
                .map(MealCounselResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 게시글 ID로 조회 및 조회수 증가
    @Transactional
    public MealCounselResponseDTO getCounselPostById(Long id) {
        MealCounsel mealCounsel = mealCounselRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. 게시글 번호: " + id));
        mealCounsel.incrementViewCount(); // 조회수 증가
        mealCounselRepository.save(mealCounsel); // 변경 사항 저장
        return MealCounselResponseDTO.fromEntity(mealCounsel);
    }

    // 게시글 저장
    @Transactional
    public MealCounselResponseDTO saveMealCounsel(MealCounsel mealCounsel, List<MultipartFile> files) throws IOException {
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                FileUrl fileUrl = fileUrlService.saveFile(file, null, "mealCounsel"); // "mealCounsel"은 새로 추가된 서비스 유형
                if (fileUrl != null) {
                    mealCounsel.addFileId(fileUrl.getId());
                }
            }
        }
        mealCounselRepository.save(mealCounsel);
        return MealCounselResponseDTO.fromEntity(mealCounsel);
    }

    // 게시글 수정
    @Transactional
    public MealCounselResponseDTO updateCounselPost(Long id, MealCounselRequestDTO requestDTO, String currentUsername) {
        MealCounsel mealCounsel = mealCounselRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. 게시글 번호: " + id));

        if (!mealCounsel.getAuthor().equals(currentUsername)) {
            throw new AccessDeniedException("게시글 수정 권한이 없습니다.");
        }

        mealCounsel.update(requestDTO.getTitle(), requestDTO.getContent(), requestDTO.getYoutubeHtml());

        // 기존 파일 삭제
        if (mealCounsel.getFileIds() != null && !mealCounsel.getFileIds().isEmpty()) {
            for (Long fileId : mealCounsel.getFileIds()) {
                try {
                    fileUrlService.deleteFile(fileId);
                } catch (FileDownloadException | IOException ex) {
                    throw new FileUploadException("파일 삭제 중 오류 발생: " + ex.getMessage(), ex);
                }
            }
            mealCounsel.getFileIds().clear();
        }

        // 새로운 파일 업로드
        List<MultipartFile> newFiles = requestDTO.getFiles();
        if (newFiles != null && !newFiles.isEmpty()) {
            for (MultipartFile file : newFiles) {
                try {
                    FileUrl newFileUrl = fileUrlService.saveFile(file, null, "mealCounsel"); // "mealCounsel" 서비스 유형 사용
                    if (newFileUrl != null) {
                        mealCounsel.addFileId(newFileUrl.getId());
                    }
                } catch (IOException e) {
                    throw new FileUploadException("파일 업로드 실패: " + e.getMessage(), e);
                }
            }
        }

        return MealCounselResponseDTO.fromEntity(mealCounsel);
    }

    // 게시글 삭제
    @Transactional
    public void deleteCounselPost(Long id, String currentUsername) {
        MealCounsel mealCounsel = mealCounselRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. ID: " + id));

        if (!mealCounsel.getAuthor().equals(currentUsername)) {
            throw new AccessDeniedException("게시글 삭제 권한이 없습니다.");
        }

        // 연관된 파일들도 모두 삭제
        if (mealCounsel.getFileIds() != null && !mealCounsel.getFileIds().isEmpty()) {
            for (Long fileId : mealCounsel.getFileIds()) {
                try {
                    fileUrlService.deleteFile(fileId);
                } catch (FileDownloadException | IOException ex) {
                    throw new FileUploadException("파일 삭제 중 오류 발생: " + ex.getMessage(), ex);
                }
            }
            mealCounsel.getFileIds().clear();
        }

        mealCounselRepository.delete(mealCounsel);
    }

    // 파일 다운로드
    public ResponseEntity<InputStreamResource> downloadMealCounselFile(Long fileId) throws IOException {
        // 파일 정보 가져오기
        FileUrl fileUrl = fileUrlRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("해당 파일이 존재하지 않습니다. ID: " + fileId));

        Path filePath = Paths.get(fileUrl.getFilePath()).normalize();

        // 파일 존재 여부 확인
        if (!Files.exists(filePath)) {
            throw new IllegalArgumentException("파일이 존재하지 않습니다. ID: " + fileId);
        }

        // 파일 스트림 생성
        InputStreamResource resource = new InputStreamResource(new FileInputStream(filePath.toFile()));

        // 파일의 MIME 타입 설정
        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        // 파일 다운로드를 위한 응답 구성
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileUrl.getOrigFileName() + "\"")
                .body(resource);
    }

    // 동적 검색을 위한 Specification 사용
    @Transactional(readOnly = true)
    public List<MealCounselResponseDTO> searchMealCounsels(String title, String content, String author, LocalDate createdAt) {
        Specification<MealCounsel> spec = Specification.where(null);

        if (title != null && !title.isEmpty()) {
            spec = spec.and(MealCounselSpecifications.titleContains(title));
        }

        if (content != null && !content.isEmpty()) {
            spec = spec.and(MealCounselSpecifications.contentContains(content));
        }

        if (author != null && !author.isEmpty()) {
            spec = spec.and(MealCounselSpecifications.authorContains(author));
        }

        if (createdAt != null) {
            spec = spec.and(MealCounselSpecifications.createdAtEquals(createdAt));
        }

        List<MealCounsel> results = mealCounselRepository.findAll(spec);

        return results.stream()
                .map(MealCounselResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
