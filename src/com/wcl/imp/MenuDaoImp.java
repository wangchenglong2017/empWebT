package com.wcl.imp;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.annotation.Resource;

import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Component;

import com.wcl.dao.MenuDao;
import com.wcl.entity.Menu;
import com.wcl.entity.User;
import com.wcl.entity.Util;
@Component
public class MenuDaoImp  implements MenuDao{
	@Resource
	private HibernateTemplate hibernateTamplate;

	@Override
	public Util select(String userLogin, String appcode,
			String menuParentCode) {
		Util util=new Util();
		return util;
	}
   //菜单树加载所有菜单
	@Override
	public List<Menu> showMenu(String appcode) {
		List<Menu> menus= (List<Menu>) this.hibernateTamplate.find("from Menu m where m.appCode='"+appcode+"'");

		return menus;
	}
	
	//保存一條数据
	@Override
	public void addMenu(String parentCode, String menuCode, String menuName,
			String order, String url, String remark, String state) {
		Menu m=new Menu();
		m.setAppCode("AUTOBOM");
		m.setGuid(UUID.randomUUID().toString().toUpperCase());
		m.setParentCode(parentCode);
		m.setMenuCode(menuCode);
		m.setMenuName(menuName);
		m.setOrder(Integer.parseInt(order));
		m.setUrl(url);
		m.setRemark(remark);
	    m.setState(Integer.parseInt(state));
	   
	    m.setCreatorDate(new Date());
	    m.setModifyDate(new Date());
	    this.hibernateTamplate.save(m);
      

	}
	
	

}
