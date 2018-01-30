package com.wcl.ser;

public interface RoleServices {
	
	public void addRole();
	public void deleteRole();
	public void updateRole();
	public void findRole(String rolecode, String roleName, String appCodeSelect);

}
