package com.wcl.dao;

public interface RoleDao {
	public void addRole();
	public void deleteRole();
	public void updateRole();
	public void findRole(String rolecode, String roleName, String appCodeSelect);

}
