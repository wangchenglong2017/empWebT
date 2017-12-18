package com.wcl.service;

import javax.annotation.Resource;
import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.wcl.entity.Util;
import com.wcl.ser.RoleFndMenuService;

@Service
public class RoleFndMenuImp implements RoleFndMenuService {
	
	@Resource
	private RoleFindMenuDao  RoleFindMenuDao;
	
	@Transactional
	@Override
	public Util findFistMenu(String roleid, String username) {
		// TODO Auto-generated method stub
		return null;
	}
	@Transactional
	@Override
	public Util findSecondMenu(String roleid, String username,
			String menuParentCode) {
		// TODO Auto-generated method stub
		return null;
	}

}
