package com.wcl.ser;

import java.util.List;

import com.wcl.entity.Application;
import com.wcl.entity.Menu;
import com.wcl.entity.Util;

public interface MenuService {
	public Util   SelectMune(String userLogin,String appcode,String menuParentCode);

	public Util showMenu(String appcode);

	public Util addMune(String parentCode, String menuCode, String menuName,
			String order, String url, String remark, String state); 

}
