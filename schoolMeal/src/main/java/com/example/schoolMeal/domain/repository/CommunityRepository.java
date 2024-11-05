package com.example.schoolMeal.domain.repository;

//import com.example.schoolMeal.domain.entity.Category;
import com.example.schoolMeal.domain.entity.Community;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {

    // 조회수 증가 메서드
    @Transactional
    @Modifying
    @Query("UPDATE Community SET viewCount = viewCount + 1 WHERE id = :id")
    void incrementViewCount(@Param("id") Long id);

//    // 선택 게시물 삭제 메서드   (전기수 참고해서 작성했는데 오류가 날 수도 있다해서 보류)
//    @Transactional
//    @Modifying
//    @Query("DELETE FROM Community WHERE id IN (:deleteList)")
//    void deleteCommunityByIds(@Param("deleteList") Long[] deleteList);

    // 공지사항 게시판에서 제목, 내용, 작성자 키워드 검색 ( 일단 종류 관계없이 그냥 검색기능부터 추가 )
   // Page<Community> findAllByCategory(Pageable pageable, Category category);
//    Page<Community> findByTitleContainingAndCategory(Pageable pageable, String titleKeyword, Category category);
//    Page<Community> findByContentContainingAndCategory(Pageable pageable, String contentKeyword, Category category);
//    Page<Community> findByAuthorContainingAndCategory(Pageable pageable, String authorKeyword, Category category);

    // 제목 키워드 검색
    Page<Community> findByTitleContaining(Pageable pageable, String titleKeyword);

    // 내용 키워드 검색
    Page<Community> findByContentContaining(Pageable pageable, String contentKeyword);

    // 작성자 이름 키워드 검색
    Page<Community> findByAuthorContaining(Pageable pageable, String authorKeyword);

}
