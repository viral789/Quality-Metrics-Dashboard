package com.cnerge.dashboard.controller;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cnerge.dashboard.pojo.LdapUser;
import com.cnerge.dashboard.service.UserManagementService;

@Controller
public class UserManagementController {

	private LdapTemplate ldapTemplate;
	
	
	public LdapTemplate getLdapTemplate() {
		return ldapTemplate;
	}
	public void setLdapTemplate(LdapTemplate ldapTemplate) {
		this.ldapTemplate = ldapTemplate;
	}
	
	
	@RequestMapping(value="/validate/user", method = RequestMethod.POST)
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public @ResponseBody LdapUser validateUserCredentials(@RequestBody LdapUser user){
		@SuppressWarnings("resource")
		ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/dashboard-security.xml");
		
		String userName = user.getUsername();
		String password = user.getPassword();
		UserManagementService userManagementService = (UserManagementService)ctx.getBean("userManagementService");
		user = userManagementService.validateUserCredentials(userName, password);
		
		return user;
	}
	
	
	@RequestMapping(value="/getMatching/user", method = RequestMethod.POST)
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public @ResponseBody List<LdapUser> getAllMatchingUser (@RequestBody LdapUser user){
		List<LdapUser> ldapUser = new ArrayList<LdapUser>();
		
		@SuppressWarnings("resource")
		ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/dashboard-security.xml");
		
		String name = user.getFirstName();
		UserManagementService userManagementService = (UserManagementService)ctx.getBean("userManagementService");
		ldapUser = userManagementService.getAllMatchingUser(name);
		
		return ldapUser;
	}
}
