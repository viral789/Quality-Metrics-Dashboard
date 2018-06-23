package com.cnerge.dashboard.controller;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Date;
import java.util.Calendar;
import java.util.List;
import java.util.Properties;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Controller;

import com.cnerge.dashboard.pojo.EmailUser;
import com.cnerge.dashboard.pojo.Sprint;
import com.cnerge.dashboard.service.DashboardServiceSprint;
import com.cnerge.dashboard.service.SendMailService;

@Controller
public class SendMailController extends QuartzJobBean{
	
	static int count = 0;
	
	@Override
	protected void executeInternal(JobExecutionContext context)
			throws JobExecutionException {
		
		Date da;
		Calendar c = Calendar.getInstance();
		Calendar ca = Calendar.getInstance();
		DashboardServiceSprint d = new DashboardServiceSprint();
		List<Sprint> sprints = d.getAllSprint();
		
		da = sprints.get(0).getMeeting_date();
		ca.setTime(da);
		
		int weekNo = ca.get(Calendar.WEEK_OF_MONTH);
		
		if(c.get(Calendar.WEEK_OF_MONTH) == weekNo){
			if(count == 0){
				count++;
				Properties prop = new Properties();
				InputStream input = null;
				try {
					input = SendMailController.class.getResourceAsStream("/mail.properties");
					BufferedReader textFromtxtFile = new BufferedReader( new InputStreamReader( getClass().getResourceAsStream("/mailText.txt")));
					prop.load(input);
					
					String recipient = prop.getProperty("to");
					String subject = prop.getProperty("subject");
					String cc = prop.getProperty("cc");
					@SuppressWarnings("resource")
					ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/dashboard-sendMail.xml");
					
					String[] multipleRecipient = new String[0];
					String[] multipleCc = new String[0];
					StringBuilder textForMail = new StringBuilder();
					String line;
					multipleRecipient = recipient.split(",");
					multipleCc = cc.split(",");
					while((line = textFromtxtFile.readLine()) != null){
						System.out.println(line);
						textForMail.append(line);
						textForMail.append("\n");
					}
					
					String textForMail1 = textForMail.toString();
					EmailUser emailUser = new EmailUser();
					
					emailUser.setRecipient(multipleRecipient);
					emailUser.setSubject(subject);
					emailUser.setText(textForMail1);
					emailUser.setCc(multipleCc);
					
					SendMailService mailService = (SendMailService) ctx.getBean("sendMailService");
					mailService.SendMail(emailUser);
					Thread.sleep(120000);
					count--;
				} catch (FileNotFoundException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
		}
	}
}
