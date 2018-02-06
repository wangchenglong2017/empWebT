package com.wcl.dao;

import java.util.List;

public interface RoleDao {
	public void addRole();
	public void deleteRole();
	public void updateRole();
	public List findRole(String rolecode, String roleName, String appCodeSelect);

}
