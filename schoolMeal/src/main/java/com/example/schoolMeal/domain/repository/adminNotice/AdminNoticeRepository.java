package com.example.schoolMeal.domain.repository.adminNotice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.schoolMeal.domain.entity.adminNotice.AdminNotice;

public interface AdminNoticeRepository extends JpaRepository<AdminNotice, Long>{

	// 파일 이름만 반환하도록 수정
    @Query("SELECT n.fileName FROM AdminNotice n WHERE n.id = :id")
	String findFileNameById(Long id);
	
    // 파일 정보를 삭제하는 쿼리 (게시글 삭제 X)
    @Modifying
    @Query("UPDATE AdminNotice n SET n.fileName = null WHERE n.id = :id")
    void removeFileById(@Param("id") Long id);
}
