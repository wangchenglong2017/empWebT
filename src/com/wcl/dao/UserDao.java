package com.wcl.dao;

import java.util.List;

import com.wcl.entity.RoleUser;
import com.wcl.entity.User;

public interface UserDao {
	public void save(User user);
	
	public User LoginCheck(String username);

	public RoleUser CheckLogin(String username);

}
