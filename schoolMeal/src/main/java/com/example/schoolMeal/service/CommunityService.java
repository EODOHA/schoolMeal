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

    @Autowired  // CommunityRepository를 의존성 주입하여 연결
    private CommunityRepository communityRepository;


    // 게시물 생성 ( 1. 클라이언트로부터 DTO를 받아 )
    public CommunityDto createCommunity(CommunityDto communityDto) {
//        Community community = new Community();      // (2. Community 엔티티로 변환하고
//        community.setTitle(communityDto.getTitle());
//        community.setContent(communityDto.getContent());
//        community.setAuthor(communityDto.getAuthor());
            Community community = communityDto.toEntity();   // toEntity 메서드 사용

        Community savedCommunity = communityRepository.save(community);    // (3.DB에 저장후)
        return new CommunityDto(savedCommunity); // (4.저장된 엔티티를 DTO로 변환하여 반환)
    }


    // 조회수 증가
    @Transactional
    public void incrementViewCount(Long communityId) {
        communityRepository.incrementViewCount(communityId);
    }

    // 특정 ID로 게시물 조회
    public CommunityDto getCommunityById(Long communityId) {
        Community community = communityRepository.findById(communityId)     // 해당 ID의 게시글의 존재하지않을때 나오는 메시지
                .orElseThrow(() -> new IllegalArgumentException("게시물이 존재하지 않습니다."));
        return new CommunityDto(community); // 조회된 엔티티를 DTO로 변환하여 반환
    }

    // 게시물 업데이트
    public CommunityDto updateCommunity(Long communityId, CommunityDto communityDto) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new IllegalArgumentException("게시물이 존재하지 않습니다."));

        community.setTitle(communityDto.getTitle());
        community.setContent(communityDto.getContent());
        community.setAuthor(communityDto.getAuthor());

        Community updatedCommunity = communityRepository.save(community);
        return new CommunityDto(updatedCommunity); // 업데이트된 엔티티를 DTO로 변환하여 반환
    }

    // 게시물 삭제
    public void deleteCommunity(Long communityId) {
        communityRepository.deleteById(communityId);
    }

    // 제목으로 검색
    public Page<CommunityDto> searchByTitle(Pageable pageable, String titleKeyword) {
        Page<Community> communities = communityRepository.findByTitleContaining(pageable, titleKeyword);
        return communities.map(CommunityDto::new); // Page<Community>를 Page<CommunityDto>로 변환
    }

    // 내용으로 검색
    public Page<CommunityDto> searchByContent(Pageable pageable, String contentKeyword) {
        Page<Community> communities = communityRepository.findByContentContaining(pageable, contentKeyword);
        return communities.map(CommunityDto::new);
    }

    // 작성자로 검색
    public Page<CommunityDto> searchByAuthor(Pageable pageable, String authorKeyword) {
        Page<Community> communities = communityRepository.findByAuthorContaining(pageable, authorKeyword);
        return communities.map(CommunityDto::new);
    }
}
