package com.example.schoolMeal.service;

import com.example.schoolMeal.domain.entity.Community;
import com.example.schoolMeal.domain.repository.CommunityRepository;
import com.example.schoolMeal.dto.CommunityDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommunityService {

    @Autowired
    private CommunityRepository communityRepository;

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
}
