package com.wcl.service;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.transaction.Transactional;

import net.sf.json.JSONArray;

import org.springframework.stereotype.Component;

import com.wcl.dao.MenuDao;
import com.wcl.entity.Menu;
import com.wcl.entity.Util;
import com.wcl.entity.ZTree;
import com.wcl.ser.MenuService;

@Component
public class MenuServiceImpl implements MenuService{
	
	@Resource
	private MenuDao menuDao;
	
    @Transactional
	@Override
	public Util SelectMune(String userLogin, String appcode,String menuParentCode) {
		Util  util=this.menuDao.select(userLogin, appcode, menuParentCode);
		return util;
	}
    
    @Transactional
	@Override
	public Util showMenu(String appcode) {
//    	List<ZTree> ztrees=new ArrayList<ZTree>();
    	List<Menu>  menus=this.menuDao.showMenu(appcode);
    	Util util=new Util();
    	util.setCode(1);
    	util.setData(menus);
		return util;
	}

	@Override
	public Util addMune(String parentCode, String menuCode, String menuName,
			String order, String url, String remark, String state) {
		this.menuDao.addMenu(parentCode,menuCode,menuName,order,
				url, remark,state);
		Util util=new Util();
    	util.setCode(1);
    	util.setMsg("保存成功");
		return util;
		
	}

}
