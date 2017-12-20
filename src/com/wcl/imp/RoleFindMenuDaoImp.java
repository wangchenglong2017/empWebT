package com.wcl.imp;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Component;

import com.wcl.dao.RoleFindMenuDao;
import com.wcl.entity.Menu;

@Component
public class RoleFindMenuDaoImp implements RoleFindMenuDao {
	
	@Resource
	private HibernateTemplate hibernateTamplate;

	@Override
	public List<Menu> findFirstMenu(String roleid) {
		String sql = "select b.guid, b.menuCode, b.menuName, b.parentCode, b.url "
				+ "from RoleMenuButton a, Menu b where a.menuId=b.guid  and b.parentCode=-1  and a.roleId='"
				+ roleid+"'";
		Session session = this.hibernateTamplate.getSessionFactory().getCurrentSession();
		Query q = session.createQuery(sql);
		 List<Object[]> list = q.list();
		 List<Menu> menuList=new ArrayList<Menu>();
		 Menu m;
		 for(int i=0;i<list.size();i++){
			 m=new Menu();
			 Object[] object = (Object[])list.get(i);
			 m.setGuid(object[0].toString());
			 m.setMenuCode(object[1].toString());
			 m.setMenuName(object[2].toString());
			 m.setParentCode(object[3].toString());
			 m.setUrl(object[4].toString());
			 menuList.add(m);
		 }
		
		return menuList;
	}

	@Override
	public List<Menu> findSecondMenu(String roleid, String username,
			String menuParentCode) {
		// TODO Auto-generated method stub
		return null;
	}

}
