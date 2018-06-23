package com.cnerge.dashboard.dao;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import javax.naming.NamingException;
import javax.naming.directory.Attributes;

import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.filter.AndFilter;
import org.springframework.ldap.filter.EqualsFilter;

import com.cnerge.dashboard.pojo.LdapUser;

public class GetAllMatchingUserFromLdap {

	private static final String BASE_DN = "OU=MumbaiHO_Users,DC=mumbai1,DC=corp,DC=citiustech,DC=com"; 
	
	public List<LdapUser> getAllMatchingUser(LdapTemplate ldapTemplate, String name){
		
		List<LdapUser> ldapUser = new ArrayList<LdapUser>();
		AndFilter filter = new AndFilter();
		ldapTemplate.setIgnorePartialResultException(true); // Active Directory doesn’t transparently handle referrals. This fixes that.
		filter.and(new EqualsFilter("objectClass", "person"));
		filter.and(new EqualsFilter("givenName", name.toLowerCase()));
		
		ldapUser = getUserDetails(ldapTemplate, filter, name);
		return ldapUser;
	}

	private List<LdapUser> getUserDetails(LdapTemplate ldapTemplate, AndFilter filter, String name){
		List<LdapUser> ldapUser = new ArrayList<LdapUser>();
		ldapUser = getAllUser(ldapTemplate, filter);
		return ldapUser;
	}
	
	@SuppressWarnings("unchecked")
	private List<LdapUser> getAllUser(LdapTemplate ldapTemplate, AndFilter filter){
		List<LdapUser> ldapUser = new ArrayList<LdapUser>();
		ldapUser = ldapTemplate.search(BASE_DN, filter.encode(), new UserAttributesMapper());
		return ldapUser;
	}
	
	@SuppressWarnings("rawtypes")
	private class UserAttributesMapper implements AttributesMapper{
		public Object mapFromAttributes(Attributes attributes) throws NamingException {
			
			LdapUser user = new LdapUser();
			List<String> name = new ArrayList<String>();
			String MatchingName = "";
			//String names = "";
			for(Enumeration vals = attributes.get("displayName").getAll(); vals.hasMoreElements();){
				name.add((String)vals.nextElement());
			}
			MatchingName = name.get(0);
			user.setGivenName(MatchingName);
			return user;
		}
	}
}
