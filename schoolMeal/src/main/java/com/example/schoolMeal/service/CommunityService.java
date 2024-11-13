package com.example.schoolMeal.service;

import com.example.schoolMeal.domain.entity.Community;
import com.example.schoolMeal.domain.entity.Community_Comment;
import com.example.schoolMeal.domain.repository.CommunityRepository;
import com.example.schoolMeal.domain.repository.CommunityCommentRepository;
import com.example.schoolMeal.dto.communityInfo.CommunityDto;
import com.example.schoolMeal.dto.communityInfo.CommunityCommentDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommunityService {

    @Autowired
    private CommunityRepository communityRepository;

    @Autowired
    private CommunityCommentRepository communityCommentRepository;

    // 파일이 저장될 기본 경로
    private final Path uploadPath = Paths.get("src/main/resources/static/uploads");

    public CommunityService() throws IOException {
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath); // 디렉토리가 없을 경우 생성
        }
    }

    // 카테고리에 따른 게시물 목록 조회
    public Page<CommunityDto> getCommunityList(String categoryName, Pageable pageable) {
        return communityRepository.findByCategoryName(categoryName, pageable)
                .map(CommunityDto::new);
    }

    // 제목으로 검색
    public Page<CommunityDto> searchByTitle(Pageable pageable, String categoryName, String keyword) {
        return communityRepository.findByCategoryNameAndTitleContaining(pageable, categoryName, keyword)
                .map(CommunityDto::new);
    }

    // 내용으로 검색
    public Page<CommunityDto> searchByContent(Pageable pageable, String categoryName, String keyword) {
        return communityRepository.findByCategoryNameAndContentContaining(pageable, categoryName, keyword)
                .map(CommunityDto::new);
    }

    // 작성자로 검색
    public Page<CommunityDto> searchByAuthor(Pageable pageable, String categoryName, String keyword) {
        return communityRepository.findByCategoryNameAndAuthorContaining(pageable, categoryName, keyword)
                .map(CommunityDto::new);
    }

    // 게시물 생성 (첨부파일 포함)
    public CommunityDto createCommunityWithFile(CommunityDto communityDto, MultipartFile file) throws IOException {
        Community community = communityDto.toEntity();

        // 파일이 있는 경우 파일을 저장하고 URL 설정
        if (file != null && !file.isEmpty()) {
            String fileUrl = saveFile(file);
            community.setFileUrl(fileUrl); // 엔티티에 파일 URL 설정
        }

        Community savedCommunity = communityRepository.save(community);
        return new CommunityDto(savedCommunity);
    }

    // 파일 저장 메서드 , UUID사용해 파일이름의 고유성보장
    public String saveFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);
        return "/uploads/" + fileName;
    }

    // 파일 로드 메서드  , 저장된 파일을 resource 객체로 로드하여 클라이언트가 접근할 수 있게
    public Resource getFile(String filename) throws MalformedURLException {
        Path filePath = uploadPath.resolve(filename);
        return new UrlResource(filePath.toUri());
    }

    // 조회수 증가
    @Transactional
    public void incrementViewCount(Long communityId) {
        communityRepository.incrementViewCount(communityId);
    }

    // 특정 ID로 게시물 조회
    public CommunityDto getCommunityById(Long communityId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new IllegalArgumentException("게시물이 존재하지 않습니다."));
        return new CommunityDto(community);
    }

    // 게시물 업데이트
    public CommunityDto updateCommunity(Long communityId, CommunityDto communityDto) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new IllegalArgumentException("게시물이 존재하지 않습니다."));
        community.setTitle(communityDto.getTitle());
        community.setContent(communityDto.getContent());
        community.setAuthor(communityDto.getAuthor());
        community.setCategoryName(communityDto.getCategoryName());

        Community updatedCommunity = communityRepository.save(community);
        return new CommunityDto(updatedCommunity);
    }

    // 게시물 삭제
    public void deleteCommunity(Long communityId) {
        communityRepository.deleteById(communityId);
    }

    //------------------댓글 기능 ----------------//

    // 댓글 조회
    // 댓글 조회
    public List<CommunityCommentDto> getCommentsByPostId(Long postId) {
        List<Community_Comment> comments = communityCommentRepository.findByCommunity_Id(postId);
        return comments.stream()
                .map(CommunityCommentDto::new)
                .collect(Collectors.toList());
    }


    // 댓글 작성
    public CommunityCommentDto createComment(Long postId, Long parentCommentId, String content) {
        Community community = communityRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시물이 존재하지 않습니다."));

        Community_Comment comment = new Community_Comment();
        comment.setCommunity(community);
        comment.setContent(content);

        // 부모 댓글이 있는 경우 설정
        if (parentCommentId != null) {
            Community_Comment parentComment = communityCommentRepository.findById(parentCommentId)
                    .orElseThrow(() -> new IllegalArgumentException("부모 댓글이 존재하지 않습니다."));
            comment.setParentComment(parentComment);
        }

        Community_Comment savedComment = communityCommentRepository.save(comment);
        return new CommunityCommentDto(savedComment);
    }

    // 댓글 좋아요 증가
    @Transactional
    public void likeComment(Long commentId) {
        Community_Comment comment = communityCommentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));
        comment.setLikes(comment.getLikes() + 1);
        communityCommentRepository.save(comment);
    }

    // 댓글 싫어요 증가
    @Transactional
    public void dislikeComment(Long commentId) {
        Community_Comment comment = communityCommentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));
        comment.setDislikes(comment.getDislikes() + 1);
        communityCommentRepository.save(comment);
    }

    // 댓글 삭제
    public void deleteComment(Long commentId) {
        communityCommentRepository.deleteById(commentId);
    }
}
