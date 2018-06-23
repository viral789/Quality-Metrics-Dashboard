package com.cnerge.dashboard.controller;

import java.util.Collection;
import java.util.HashSet;

import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.ldap.userdetails.LdapAuthoritiesPopulator;
import org.springframework.stereotype.Component;

@Component
public class CustomLdapAuthoritiesPopulator implements LdapAuthoritiesPopulator{
	public Collection<? extends GrantedAuthority> getGrantedAuthorities(DirContextOperations userData, String username){
			Collection<GrantedAuthority> authenticate = new HashSet<GrantedAuthority>();
			if(username.equals("deep")){
				authenticate.add(new SimpleGrantedAuthority("admin"));
			}
			authenticate.add(new SimpleGrantedAuthority("user"));
			return authenticate;
		}
}
