package com.cnerge.dashboard.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Service;

import com.cnerge.dashboard.controller.UserManagementController;
import com.cnerge.dashboard.dao.GetAllMatchingUserFromLdap;
import com.cnerge.dashboard.dao.UserManagementDaoImpl;
import com.cnerge.dashboard.pojo.LdapUser;

@Service
public class UserManagementService {

	public LdapUser validateUserCredentials( String userName, String password){
		@SuppressWarnings("resource")
		ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/dashboard-security.xml");
	    UserManagementController controller =(UserManagementController) ctx.getBean("userManagementController");
	    UserManagementDaoImpl dao = (UserManagementDaoImpl)ctx.getBean("userManagementDaoImpl");
		LdapUser user = new LdapUser();
		user = dao.validateUserCredentials(controller.getLdapTemplate(), userName, password);
		
		return user;
		
	}
	
	public List<LdapUser> getAllMatchingUser (String name){
		@SuppressWarnings("resource")
		ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/dashboard-security.xml");
	    UserManagementController controller =(UserManagementController) ctx.getBean("userManagementController");
	    GetAllMatchingUserFromLdap getAll = (GetAllMatchingUserFromLdap)ctx.getBean("getAllMatchingUserFromLdap");
	    List<LdapUser> ldapUser = new ArrayList<LdapUser>();
	    ldapUser = getAll.getAllMatchingUser(controller.getLdapTemplate(), name);
	    
	    return ldapUser;
	}
}
