package com.wcl.dao;


import java.util.List;

import com.wcl.entity.Application;


public interface ApplicationDao {
	public void save(Application application);
	public List<Application> select (String s);
	public  void delete(Application application);
	public Application update(Application application);

}
