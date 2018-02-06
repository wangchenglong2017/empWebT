package com.wcl.ser;

import java.util.List;

public interface RoleServices {
	
	public void addRole();
	public void deleteRole();
	public void updateRole();
	public List findRole(String rolecode, String roleName, String appCodeSelect);

}
