package com.cnerge.dashboard.controller;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cnerge.dashboard.pojo.Sprint;
import com.cnerge.dashboard.service.DashboardServiceSprint;


@Controller
public class DashboardControllerSprint {
	DashboardServiceSprint dashboardServiceSprint = new DashboardServiceSprint();
	
	@RequestMapping(value = "/sprintDetails", method = RequestMethod.GET, headers="Accept=application/json" )
	public @ResponseBody List<Sprint> getAllSprint(){
		List<Sprint> sprints = dashboardServiceSprint.getAllSprint();
		return sprints;
	}
	
	@RequestMapping(value = "/sprints/insert", method = RequestMethod.POST)
	@Consumes(MediaType.APPLICATION_JSON)
	@ResponseBody
	public List<Sprint> addSprint (@RequestBody Sprint sprint){
		dashboardServiceSprint.addSprint(sprint);
		return dashboardServiceSprint.getAllSprint();
	}
	
	@RequestMapping(value = "/sprints/update/{s_id}", method = RequestMethod.PUT) 
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public @ResponseBody List<Sprint> update ( @PathVariable int s_id, @RequestBody Sprint sprint){
		dashboardServiceSprint.updateSprint(s_id, sprint);
		return dashboardServiceSprint.getAllSprint();
	}
	
	@RequestMapping(value="sprints/delete/{s_id}", method = RequestMethod.DELETE)
	public @ResponseBody void deleteSprint (@PathVariable int s_id){
		dashboardServiceSprint.deleteSprint(s_id);
	}
}
