package com.example.schoolMeal.service.mealCounsel;

//영양상담 자료실 Service
import com.example.schoolMeal.domain.entity.mealCounsel.MealCounsel;
import com.example.schoolMeal.domain.entity.mealCounsel.MealCounselFile;
import com.example.schoolMeal.domain.entity.mealCounsel.MealCounselSpecifications;
import com.example.schoolMeal.domain.repository.mealCounsel.MealCounselFileRepository;
import com.example.schoolMeal.domain.repository.mealCounsel.MealCounselRepository;
import com.example.schoolMeal.dto.mealCounsel.MealCounselRequestDTO;
import com.example.schoolMeal.dto.mealCounsel.MealCounselResponseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

import java.util.stream.Collectors;
import java.nio.file.Paths;

@Service
public class MealCounselService {

    private final MealCounselRepository mealCounselRepository;
    private final FileStorageService fileStorageService;
    private final MealCounselFileRepository mealCounselFileRepository;

    @Autowired
    public MealCounselService(MealCounselRepository mealCounselRepository,
                              FileStorageService fileStorageService,
                              MealCounselFileRepository mealCounselFileRepository) {
        this.mealCounselRepository = mealCounselRepository;
        this.fileStorageService = fileStorageService;
        this.mealCounselFileRepository = mealCounselFileRepository;
    }

    // 모든 게시글 조회
    public List<MealCounselResponseDTO> getAllCounselPosts() {
        return mealCounselRepository.findAll().stream()
                .map(MealCounselResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 게시글 ID로 조회
    @Transactional
    public MealCounselResponseDTO getCounselPostById(Long id) {
        MealCounsel mealCounsel = mealCounselRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. 게시글번호: " + id));
        mealCounsel.incrementViewCount();
        return MealCounselResponseDTO.fromEntity(mealCounsel);
    }

    // 게시글 저장 (ADMIN 권한만 가능)
    public MealCounselResponseDTO saveCounselPost(MealCounselRequestDTO requestDTO, String currentUsername) {
        MealCounsel mealCounsel = convertToEntity(requestDTO, currentUsername);
        handleFileUploads(requestDTO.getFiles(), mealCounsel);
        mealCounsel = mealCounselRepository.save(mealCounsel);
        return MealCounselResponseDTO.fromEntity(mealCounsel);
    }

    // 게시글 수정 (ADMIN 권한만 가능)
    @Transactional
    public MealCounselResponseDTO updateCounselPost(Long id, MealCounselRequestDTO requestDTO, String currentUsername) {
        MealCounsel mealCounsel = mealCounselRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. 게시글 번호 : " + id));

        if (!mealCounsel.getAuthor().equals(currentUsername)) {
            throw new AccessDeniedException("게시글 수정 권한이 없습니다.");
        }
        mealCounsel.update(requestDTO.getTitle(), requestDTO.getContent(), requestDTO.getYoutubeHtml());
        handleFileUploads(requestDTO.getFiles(), mealCounsel);
        return MealCounselResponseDTO.fromEntity(mealCounsel);
    }

    // 게시글 삭제 (ADMIN 권한만 가능)
    @Transactional
    public void deleteCounselPost(Long id, String currentUsername) {
        MealCounsel mealCounsel = mealCounselRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. ID: " + id));
        if (!mealCounsel.getAuthor().equals(currentUsername)) {
            throw new AccessDeniedException("게시글 삭제 권한이 없습니다.");
        }
        mealCounselRepository.delete(mealCounsel);
    }

    // 파일 로드
    public Resource loadFileAsResource(String fileUrl) {
        return fileStorageService.loadFileAsResource(fileUrl);
    }

    // 파일 ID로 조회
    public MealCounselFile getFileById(Long fileId) {
        return mealCounselFileRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("해당 파일을 찾을 수 없습니다. ID: " + fileId));
    }

    // 엔티티 변환 메서드
    private MealCounsel convertToEntity(MealCounselRequestDTO requestDTO, String author) {
        return MealCounsel.builder()
                .title(requestDTO.getTitle())
                .content(requestDTO.getContent())
                .author(author)
                .youtubeHtml(requestDTO.getYoutubeHtml())
                .build();
    }

    // 파일 업로드 처리 메서드
    private void handleFileUploads(List<MultipartFile> files, MealCounsel mealCounsel) {
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (file.getSize() > 10 * 1024 * 1024) {
                    throw new RuntimeException("유효하지 않은 파일입니다: " + file.getOriginalFilename());
                }
                String fileUrl = fileStorageService.storeFile(file);
                MealCounselFile mealCounselFile = MealCounselFile.builder()
                        .originalFileName(file.getOriginalFilename())
                        .storedFileName(Paths.get(fileUrl).getFileName().toString())
                        .fileType(file.getContentType())
                        .fileUrl(fileUrl)
                        .build();
                mealCounsel.addFile(mealCounselFile);
            }
        }
    }

    //Spring Data JPA의 Specification를 활용하여 동적 검색 조건 처리하기 위한 메소드
    public List<MealCounselResponseDTO> searchMealCounsels(String title, String content, String author, LocalDate createdAt) {

        //초기화
        Specification<MealCounsel> spec = Specification.where(null);

        //제목 검색 조건
        if (title != null && !title.isEmpty()) {
            spec = spec.and(MealCounselSpecifications.titleContains(title));
        }

        //내용 검색 조건
        if (content != null && !content.isEmpty()) {
            spec = spec.and(MealCounselSpecifications.contentContains(content));
        }

        //작성자 검색 조건
        if (author != null && !author.isEmpty()) {
            spec = spec.and(MealCounselSpecifications.authorContains(author));
        }

        //생성일 검색 조건
        if (createdAt != null) {
            spec = spec.and(MealCounselSpecifications.createdAtEquals(createdAt));
        }

        List<MealCounsel> results = mealCounselRepository.findAll(spec);

        //DTO로 변환 후 반환
        return results.stream()
                .map(MealCounselResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
