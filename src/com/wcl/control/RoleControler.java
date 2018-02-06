package com.wcl.control;

import java.util.List;

import org.hibernate.annotations.Source;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.wcl.entity.Util;
import com.wcl.service.RoleServiceImp;

@Controller
@RequestMapping("/Role")
public class RoleControler {
	@Source
	private RoleServiceImp roleServiceImp;
	
	@RequestMapping("/add.do")
	@ResponseBody
	public Util addRole(String parentCode,String menuCode,String menuName,String order,
			String url, String remark,String state){
		
		return null;
	}
	
	@RequestMapping("/update.do")
	@ResponseBody
	public Util updateRole(String parentCode,String menuCode,String menuName,String order,
			String url, String remark,String state){
		
		return null;
	}
	
	@RequestMapping("/delete.do")
	@ResponseBody
	public Util deleteRole(){
		
		return null;
	}
	
	@RequestMapping("/show.do")
	@ResponseBody
	public Util showRole(String rolecode,String RoleName,String AppCodeSelect){
		List roles=(List)this.roleServiceImp.findRole(rolecode,RoleName, AppCodeSelect);
		Util util=new Util();
		return util;
	}
	
	
	
	

}
