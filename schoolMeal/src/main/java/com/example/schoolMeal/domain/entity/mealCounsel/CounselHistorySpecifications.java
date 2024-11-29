package com.example.schoolMeal.domain.entity.mealCounsel;

//CounselHistory 엔티티에 대한 동적 쿼리 생성
//다양한 검색 조건을 조합하여 CounselHistory 데이터를 조회할 수 있도록 지원
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class CounselHistorySpecifications {
    //작성자(author) 필드가 주어진 문자열을 포함하는지 확인
    public static Specification<CounselHistory> authorContains(String author) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("author")), "%" + author.toLowerCase() + "%");
    }
    //제목(title) 필드가 주어진 문자열을 포함하는지 확인
    public static Specification<CounselHistory> titleContains(String title) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }
    //상담 내용(counselContent) 필드가 주어진 문자열을 포함하는지 확인
    public static Specification<CounselHistory> counselContentContains(String counselContent) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("counselContent")), "%" + counselContent.toLowerCase() + "%");
    }
    //상담 날짜(counselDate) 필드가 주어진 날짜와 동일한지 확인
    public static Specification<CounselHistory> dateEquals(LocalDate date) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("counselDate"), date);
    }
}
