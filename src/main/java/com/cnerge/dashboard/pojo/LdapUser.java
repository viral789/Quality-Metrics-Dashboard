package com.cnerge.dashboard.pojo;

import java.util.List;




public class LdapUser {
	private String FirstName;
	private String LastName;
	private String cn;
	private String sAMAccountName;
	private String username;
	private String password;
	private String mail;
	private String givenName;
	private List<String> memberOf;
	/*private String memberOf;
	
	public String getMemberOf() {
		return memberOf;
	}
	public void setMemberOf(String memberOf) {
		this.memberOf = memberOf;
	}*/
	
	public String getGivenName() {
		return givenName;
	}
	public void setGivenName(String givenName) {
		this.givenName = givenName;
	}

	
	
	public List<String> getMemberOf() {
		return memberOf;
	}
	public void setMemberOf(List<String> memberOf) {
		this.memberOf = memberOf;
	}
	
	public String getMail() {
		return mail;
	}
	public void setMail(String mail) {
		this.mail = mail;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getFirstName() {
		return FirstName;
	}
	public void setFirstName(String firstName) {
		FirstName = firstName;
	}
	public String getLastName() {
		return LastName;
	}
	public void setLastName(String lastName) {
		LastName = lastName;
	}
	public String getCn() {
		return cn;
	}
	public void setCn(String cn) {
		this.cn = cn;
	}
	public String getsAMAccountName() {
		return sAMAccountName;
	}
	public void setsAMAccountName(String sAMAccountName) {
		this.sAMAccountName = sAMAccountName;
	}
	
	public String toString(){
		return " LdapUser [FirstName " + FirstName + "LastName " + LastName + "cn" + cn + "sAMAccountName" +sAMAccountName+ "username" + username + 
				"password" + password + "memberOf"+ memberOf + "mail" + mail + "givenName" + givenName +"]"; 
	}
}
