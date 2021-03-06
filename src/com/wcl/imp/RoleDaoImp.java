package com.wcl.imp;

import java.util.List;

import javax.annotation.Resource;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Component;

import com.wcl.dao.RoleDao;
import com.wcl.entity.Application;
import com.wcl.entity.Role;
@Component
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
	public List findRole(String rolecode, String roleName, String appCodeSelect) {
		System.out.print("aaa");
		// TODO Auto-generated method stub
		List roles= this.hibernateTamplate.getSessionFactory().getCurrentSession()
			.createCriteria(Role.class).add(Restrictions.like("roleCode", "%"+rolecode+"%")).add(Restrictions.like("roleName", "%"+roleName+"%"))
			.add(Restrictions.like("appcode", "%"+appCodeSelect+"%")).list();
		for(int i=0;i<roles.size();i++){
			Role role=(Role)roles.get(i);
			System.out.println(role.getAppcode()+"---------------"+role.getGuid());
		}
		return roles;
	}

}
