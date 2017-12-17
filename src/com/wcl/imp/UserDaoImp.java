package com.wcl.imp;

import java.util.List;

import javax.annotation.Resource;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Component;

import com.wcl.dao.UserDao;
import com.wcl.entity.RoleUser;
import com.wcl.entity.User;
@Component
public class UserDaoImp implements UserDao {
	private HibernateTemplate hibernateTamplate;
	

	public HibernateTemplate getHibernateTamplate() {
		return hibernateTamplate;
	}

    @Resource
	public void setHibernateTamplate(HibernateTemplate hibernateTamplate) {
		this.hibernateTamplate = hibernateTamplate;
	}


	@Override
	public void save(User user) {
		this.hibernateTamplate.save(user);
	}

	@Override
	public User LoginCheck(String username) {
//		User user=new User();
//		user.setUserLogin(username);
//		
		List<User> users= (List<User>) this.hibernateTamplate.find("from User u where u.userLogin='"+username+"'");  
//		System.out.print(users.isEmpty());
        return users.get(0);
		
	}
	
	
	//检查用户的部门和角色
	@Override
	public RoleUser CheckLogin(String username) {
		//sql select c.* from tn_sys_user  a  join tn_sys_orguser b on a.CN_S_LOGIN=b.CN_S_LOGIN join 
		//tn_sys_roleuser c on  a.CN_S_LOGIN=c.CN_S_LOGIN  where  a.CN_S_LOGIN='lisi';
		
		//from User  a  join OrgUser b on a.CN_S_LOGIN=b.CN_S_LOGIN join RoleUser c on  a.CN_S_LOGIN=c.CN_S_LOGIN  where  a.CN_S_LOGIN='lisi';
		//List<User> users= (List<User>) this.hibernateTamplate.find("from User  a  join OrgUser b on a.CN_S_LOGIN=b.CN_S_LOGIN join RoleUser c on  a.CN_S_LOGIN=c.CN_S_LOGIN  where  a.CN_S_LOGIN='"+username+"'");
//		String sql = "select c.roleguid "
//				+ "from User a  join OrgUser b on a.userLogin=b.username join RoleUser c on  a.userLogin=c.username  where  a.userLogin="
//				+ username;
		String sql = "select c.roleguid "
				+ "from User a, OrgUser b,RoleUser c where a.userLogin=b.username and a.userLogin=c.username   and a.userLogin='"
				+ username+"'";

		Session session = getHibernateTamplate().getSessionFactory().getCurrentSession();
		Query q = session.createQuery(sql);
		 List<Object[]> list = q.list();
		 System.out.println(list.toString());
//		 Object object = (Object)list.get(0);
		 String roleId =  (String)list.toString();
		 RoleUser u=new RoleUser();
		 u.setRoleguid(roleId);
		return u;
	}

}
