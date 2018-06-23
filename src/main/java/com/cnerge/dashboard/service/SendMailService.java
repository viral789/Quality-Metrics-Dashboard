package com.cnerge.dashboard.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import com.cnerge.dashboard.pojo.EmailUser;

public class SendMailService {
	

	private JavaMailSenderImpl mailSender;

	public JavaMailSenderImpl getMailSender() {
		return mailSender;
	}

	public void setMailSender(JavaMailSenderImpl mailSender) {
		this.mailSender = mailSender;
	}

	public void SendMail (EmailUser mailUser) throws FileNotFoundException, IOException, InterruptedException{
		
		
		
		Properties prop = new Properties();
		InputStream input = null;
		
		SimpleMailMessage mail = new SimpleMailMessage();
		
		input = SendMailService.class.getResourceAsStream("/LdapConfig.properties");
		prop.load(input);
		
		//mail.setTo(mailUser.getRecipient());
		mail.setTo(mailUser.getRecipient());
		mail.setCc(mailUser.getCc());
		mail.setSubject(mailUser.getSubject());
		mail.setText(mailUser.getText());
		mail.setFrom(prop.getProperty("mail.username"));
		
		//System.out.println("------------------------------"+Thread.currentThread().getId());
		mailSender.send(mail);
		
	}
	
}
