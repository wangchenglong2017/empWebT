package com.wcl.service;



import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.wcl.dao.ApplicationDao;
import com.wcl.entity.Application;
import com.wcl.imp.ApplicationDaoImp;
import com.wcl.ser.ApplicationServ;

@Component("u")
public class ApplicationService implements ApplicationServ {
//    @Autowired
//    @Qualifier("applicationdao")
	private ApplicationDao applicationDao;

	public ApplicationDao getApplicationDao() {
		return applicationDao;
	}
	 @Resource(name="applicationdao")
	public void setApplicationDao(ApplicationDao applicationDao) {
		this.applicationDao = applicationDao;
	}
	
	 @Transactional
	public void save(Application application){
		this.applicationDao.save(application);
	}
	

}
