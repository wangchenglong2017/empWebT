package com.wcl.ser;

import com.wcl.entity.Util;

public interface RoleFndMenuService {
	public Util findFistMenu(String roleid,String username);
	
	public Util findSecondMenu(String roleid,String username,String menuParentCode);
	

}
