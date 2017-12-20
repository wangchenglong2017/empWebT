package com.wcl.service;

import java.util.List;

import javax.annotation.Resource;
import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.wcl.dao.RoleFindMenuDao;
import com.wcl.entity.Menu;
import com.wcl.entity.Util;
import com.wcl.ser.RoleFndMenuService;

@Service
public class RoleFndMenuServiceImp implements RoleFndMenuService {
	/*
	 *选择一级二级菜单
	 */
	
	@Resource
	private RoleFindMenuDao  roleFindMenuDao;
	
	@Transactional
	@Override
	public Util findFistMenu(String roleid) {
		List<Menu> menuList=this.roleFindMenuDao.findFirstMenu(roleid);
		Util util=new Util();
		util.setCode(0);
		util.setData(menuList);
		util.setMsg("获取数据");
		return util;
	}
	@Transactional
	@Override
	public Util findSecondMenu(String roleid, String username,
			String menuParentCode) {
		// TODO Auto-generated method stub
		return null;
	}

}
