package com.wcl.control;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.wcl.entity.Util;
import com.wcl.ser.RoleFndMenuService;

@Controller
@RequestMapping("/rolelogin")
public class RoleFindMenu {
	@Resource
	private RoleFndMenuService roleFindMenuService;
	@RequestMapping("/firstMenu.do")
	@ResponseBody
	public Util findFirstMenu(String roleid){
		Util util=roleFindMenuService.findFistMenu(roleid);
		return util;
	}

	
	@RequestMapping("/secondMenu")
	@ResponseBody
	public Util findSecondMenu(String roleid,String username,String menuParentCode){
		Util util=roleFindMenuService.findSecondMenu(roleid, username, menuParentCode);
		return util;
	}
	
	
}
