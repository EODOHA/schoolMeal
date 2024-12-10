package com.example.schoolMeal.controller.ingredientInfo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.schoolMeal.domain.entity.ingredientInfo.HaccpInfo;
import com.example.schoolMeal.domain.repository.ingredientInfo.HaccpInfoRepository;

@RestController
@RequestMapping("/haccp-info")
public class HaccpInfoController {

	@Autowired
	private HaccpInfoRepository haccpInfoRepository;
	
	@GetMapping
	public Iterable<HaccpInfo> getHACCPInfo() {
		// HACCP 인증 정보를 검색하고 반환
		return haccpInfoRepository.findAll();
	}

	 @PostMapping("/bulk-upload")
	    public ResponseEntity<List<HaccpInfo>> uploadHaccpData(@RequestBody List<HaccpInfo> haccpList) {
	        try {
	            // 받은 데이터 처리 (DB에 저장)
	            haccpInfoRepository.saveAll(haccpList);
	            return ResponseEntity.ok(haccpList);
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
	        }
	    }
	}
