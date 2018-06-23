package com.cnerge.dashboard.pojo;


public class EmailUser {

	private String [] recipient;
	private String [] cc;
	private String subject;
	private String text;

	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	/*public String getRecipient() {
		return recipient;
	}
	public void setRecipient(String recipient) {
		this.recipient = recipient;
	}*/
	
	
	public String[] getCc() {
		return cc;
	}
	public void setCc(String[] cc) {
		this.cc = cc;
	}
	public String[] getRecipient() {
		return recipient;
	}
	public void setRecipient(String[] recipient) {
		this.recipient = recipient;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	
	public String toString(){
		return "EmailUser [ recipient " + recipient  + "cc" + cc + "subject" + subject + "text" + text +"]";
	}
	
}
