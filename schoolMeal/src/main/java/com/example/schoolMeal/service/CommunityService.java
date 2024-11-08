package com.example.schoolMeal.service;

import com.example.schoolMeal.domain.entity.Community;
import com.example.schoolMeal.domain.entity.Community_Comment;
import com.example.schoolMeal.domain.repository.CommunityRepository;
import com.example.schoolMeal.domain.repository.CommunityCommentRepository;
import com.example.schoolMeal.dto.communityInfo.CommunityDto;
import com.example.schoolMeal.dto.communityInfo.CommunityCommentDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommunityService {

    @Autowired
    private CommunityRepository communityRepository;

    @Autowired
    private CommunityCommentRepository communityCommentRepository;

    // 카테고리에 따른 목록 조회
    public Page<CommunityDto> getCommunityList(String categoryName, Pageable pageable) {
        return communityRepository.findByCategoryName(categoryName, pageable)
                .map(CommunityDto::new);
    }

    // 카테고리별로 게시물 생성
    public CommunityDto createCommunity(CommunityDto communityDto) {
        Community community = communityDto.toEntity();
        Community savedCommunity = communityRepository.save(community);
        return new CommunityDto(savedCommunity);
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

    //------------------검색 ----------------//

    // 카테고리와 제목으로 검색
    public Page<CommunityDto> searchByTitle(Pageable pageable, String titleKeyword, String categoryName) {
        Page<Community> communities = communityRepository.findByCategoryNameAndTitleContaining(pageable, categoryName, titleKeyword);
        return communities.map(CommunityDto::new);
    }

    // 카테고리와 내용으로 검색
    public Page<CommunityDto> searchByContent(Pageable pageable, String contentKeyword, String categoryName) {
        Page<Community> communities = communityRepository.findByCategoryNameAndContentContaining(pageable, categoryName, contentKeyword);
        return communities.map(CommunityDto::new);
    }

    // 카테고리와 작성자 이름으로 검색
    public Page<CommunityDto> searchByAuthor(Pageable pageable, String authorKeyword, String categoryName) {
        Page<Community> communities = communityRepository.findByCategoryNameAndAuthorContaining(pageable, categoryName, authorKeyword);
        return communities.map(CommunityDto::new);
    }

    //------------------댓글 기능 ----------------//

    // 특정 게시물에 대한 댓글 조회
    public List<CommunityCommentDto> getCommentsByPostId(Long postId) {
        return communityCommentRepository.findByPostId(postId).stream()
                .map(CommunityCommentDto::new)
                .collect(Collectors.toList());
    }

    // 댓글 작성
    public CommunityCommentDto createComment(Long postId, Long parentCommentId, String content) {
        Community community = communityRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시물이 존재하지 않습니다."));

        Community_Comment comment = new Community_Comment();
        comment.setPost(community);
        comment.setContent(content);

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