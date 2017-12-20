package com.wcl.ser;

import com.wcl.entity.Util;

public interface RoleFndMenuService {
	public Util findFistMenu(String roleid);
	
	public Util findSecondMenu(String roleid,String username,String menuParentCode);
	

}
