package com.wcl.imp;

import java.util.List;

import javax.annotation.Resource;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.orm.hibernate4.HibernateTemplate;

import com.wcl.dao.RoleDao;
import com.wcl.entity.Application;
import com.wcl.entity.Role;

public class RoleDaoImp implements RoleDao{
	@Resource
	private HibernateTemplate hibernateTamplate;

	@Override
	public void addRole() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteRole() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void updateRole() {
		// TODO Auto-generated method stub
		
	}
	
    /*
     * (non-Javadoc)
     * @see com.wcl.dao.RoleDao#findRole(java.lang.String, java.lang.String, java.lang.String)
     * 角色管理中通过角色编码、角色名称和应用编号查询，当三个条件均为空时是默认加载列表
     */
	@Override
	public void findRole(String rolecode, String roleName, String appCodeSelect) {
		// TODO Auto-generated method stub
		List roles= this.hibernateTamplate.getSessionFactory().getCurrentSession()
			.createCriteria(Role.class).add(Restrictions.like("", rolecode)).add(Restrictions.like("", roleName))
			.add(Restrictions.like("", appCodeSelect)).list();
	}

}
