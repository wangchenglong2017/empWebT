package com.wcl.imp;

import java.util.List;

import javax.annotation.Resource;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;
import org.springframework.orm.hibernate4.HibernateTemplate;
import org.springframework.stereotype.Component;

import com.wcl.dao.ApplicationDao;
import com.wcl.entity.Application;

@Component("applicationdao")
public class ApplicationDaoImp  implements ApplicationDao {
	
//	private SessionFactory sessionFactory;
//	
//
//	public SessionFactory getSessionFactory() {
//		return sessionFactory;
//	}
//   @Resource(name="sessionFactory")
//	public void setSessionFactory(SessionFactory sessionFactory) {
//		this.sessionFactory = sessionFactory;
//	}
	
	private HibernateTemplate hibernateTemplate;
	
	
	
	public HibernateTemplate getHibernateTemplate() {
		return hibernateTemplate;
	}
	@Resource
	public void setHibernateTemplate(HibernateTemplate hibernateTemplate) {
		this.hibernateTemplate = hibernateTemplate;
	}
	@Override
	public void save(Application application) {
//		Session session = sessionFactory.getCurrentSession();
//		session.beginTransaction();
		hibernateTemplate.save(application);
//		session.getTransaction().commit();
//		session.close();
//		sessionFactory.close();
//		this.save(application);
//		this.getHibernateTemplate().save(application);
		
	}
	@Override
	public List<Application> select(String s) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public void delete(Application application) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public Application update(Application application) {
		// TODO Auto-generated method stub
		return null;
	}
	

}
