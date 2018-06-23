package com.cnerge.dashboard.dao;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import javax.naming.NamingException;
import javax.naming.directory.Attributes;

import org.apache.commons.lang.StringUtils;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.filter.AndFilter;
import org.springframework.ldap.filter.EqualsFilter;

import com.cnerge.dashboard.pojo.LdapUser;

public class UserManagementDaoImpl{
	
	
	private static final String BASE_DN = "OU=MumbaiHO_Users,DC=mumbai1,DC=corp,DC=citiustech,DC=com";
	
	
	public LdapUser validateUserCredentials(LdapTemplate ldapTemplate, String userName, String password){
		
		LdapUser user = new LdapUser();
		AndFilter filter = new AndFilter();
		ldapTemplate.setIgnorePartialResultException(true); // Active Directory doesn’t transparently handle referrals. This fixes that.
		filter.and(new EqualsFilter("objectClass", "person"));
		filter.and(new EqualsFilter("sAMAccountName", userName.toLowerCase()));
		boolean success = ldapTemplate.authenticate(BASE_DN, filter.toString(), password);
		if(success){
			try{
				user = getUserDetailsFromLdap(ldapTemplate, userName, filter);
				
			}catch(Exception e){
				e.printStackTrace();
			}
		}
		return user;
	}

	private LdapUser getUserDetailsFromLdap(LdapTemplate ldapTemplate,
			String userName, AndFilter filter) {
		LdapUser user = new LdapUser();
		List<LdapUser> ldapuser = new ArrayList<LdapUser>();
		ldapuser = getUsers(ldapTemplate, filter);
		
		for(LdapUser users: ldapuser){
			if(StringUtils.isNotEmpty(users.getsAMAccountName()) && users.getsAMAccountName().equalsIgnoreCase(userName)){
				user = users;
			}
		}
		return user;
	}

	@SuppressWarnings("unchecked")
	private List<LdapUser> getUsers(LdapTemplate ldapTemplate, AndFilter filter) {
		List<LdapUser> user = new ArrayList<LdapUser>();
		user = ldapTemplate.search(BASE_DN, filter.encode(), new UserAttributesMapper());
		return user;
	}
	
	@SuppressWarnings("rawtypes")
	private class UserAttributesMapper implements AttributesMapper {
		public Object mapFromAttributes(Attributes attributes) throws NamingException {
			LdapUser user = new LdapUser();
			user.setCn((String)attributes.get("cn").get());
			List<String> memberOf = new ArrayList<String>();
			
			for(Enumeration vals = attributes.get("memberOf").getAll(); vals.hasMoreElements();){
				memberOf.add((String)vals.nextElement());
			}
			user.setMemberOf(memberOf);
			user.setsAMAccountName((String)attributes.get("sAMAccountName").get());
			user.setMail((String)attributes.get("mail").get());
			return user;
		}
    }
}
