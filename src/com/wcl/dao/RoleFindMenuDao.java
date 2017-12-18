package com.wcl.dao;

import java.util.List;

import com.wcl.entity.Menu;

public interface RoleFindMenuDao {
	
	public List<Menu> findFirstMenu(String roleid, String username);
	
	public List<Menu> findSecondMenu(String roleid, String username,String menuParentCode);

}
