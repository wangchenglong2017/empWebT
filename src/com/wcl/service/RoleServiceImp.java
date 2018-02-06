package com.wcl.service;

import java.util.List;

import javax.annotation.Resource;

import com.wcl.dao.RoleDao;
import com.wcl.ser.RoleServices;

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

	public void findRole(String rolecode, String roleName, String appCodeSelect) {
		if(rolecode==null) 
			rolecode="";
		if(roleName==null){
			roleName="";
		}
		if(appCodeSelect==null){
			appCodeSelect="";
		}
		List(Role) roles=List(Role)this.roleDao.findRole(rolecode, roleName, appCodeSelect);
		
	}

}
