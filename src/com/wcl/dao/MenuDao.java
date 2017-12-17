package com.wcl.dao;

import java.util.List;

import com.wcl.entity.Application;
import com.wcl.entity.Menu;
import com.wcl.entity.Util;

public interface MenuDao {
	public Util select (String userLogin, String appcode,String menuParentCode);

	public List<Menu> showMenu(String appcode);

	public void addMenu(String parentCode, String menuCode, String menuName,
			String order, String url, String remark, String state);

}
