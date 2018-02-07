package com.wcl.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.wcl.dao.RoleDao;
import com.wcl.ser.RoleServices;
@Service
public class RoleServiceImp implements RoleServices{
	
	@Resource
	private RoleDao roleDao;

	@Override
	public void addRole() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteRole() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void updateRole() {
		// TODO Auto-generated method stub
		
	}

	public List findRole(String rolecode, String roleName, String appCodeSelect) {
		List roles=this.roleDao.findRole(rolecode, roleName, appCodeSelect);
		return roles;
		
	}

}
