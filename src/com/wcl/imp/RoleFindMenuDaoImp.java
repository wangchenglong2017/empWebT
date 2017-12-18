package com.wcl.imp;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Component;

import com.wcl.dao.RoleFindMenuDao;
import com.wcl.entity.Menu;

@Component
public class RoleFindMenuDaoImp implements RoleFindMenuDao {
	
	@Resource
	private HibernateTemplate hibernateTamplate;

	@Override
	public List<Menu> findFirstMenu(String roleid, String username) {
//		this.hibernateTamplate.find(queryString, values)
		return null;
	}

	@Override
	public List<Menu> findSecondMenu(String roleid, String username,
			String menuParentCode) {
		// TODO Auto-generated method stub
		return null;
	}

}
