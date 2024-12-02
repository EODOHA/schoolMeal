package com.example.schoolMeal.controller.ingredientInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.schoolMeal.domain.entity.ingredientInfo.HaccpInfo;
import com.example.schoolMeal.domain.repository.ingredientInfo.HaccpInfoRepository;

@RestController
public class HaccpInfoController {
	
	@Autowired
	private HaccpInfoRepository haccpInfoRepository;
	
	@RequestMapping("/haccp-info")
	public Iterable<HaccpInfo> getHACCPInfo(){
		//HACCP 인증 정보를 검색하고 반환
		return haccpInfoRepository.findAll();
	}
	
	
}