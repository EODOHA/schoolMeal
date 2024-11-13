package com.example.schoolMeal.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.schoolMeal.domain.entity.User;

//@RepositoryRestResource(exported = false)
//	// 다른 경로의 엔드포인트로 바꾸거나(path="sample")
//	// 숨겨야할 때(exported=false)
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	
	Optional<User> findByUsername(String username);
}
