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

import com.cnerge.dashboard.pojo.Project;
import com.cnerge.dashboard.service.DashboardServiceProject;


@Controller
public class DashboardControllerProject {
	DashboardServiceProject dashboardServiceProject = new DashboardServiceProject();
	
	
	@RequestMapping(value="/project", method= RequestMethod.GET, headers="Accept=application/json")
	public @ResponseBody List<Project> getAllProject(){
		List<Project> projects = dashboardServiceProject.getAllProject();
		return projects;
	}
	
	@RequestMapping(value="/projects/insert", method = RequestMethod.POST)
	@Consumes(MediaType.APPLICATION_JSON)
	@ResponseBody
	public List<Project> addProject(@RequestBody Project project){
		dashboardServiceProject.addProject(project);
		return dashboardServiceProject.getAllProject();
	}
	
	@RequestMapping(value="/projects/update/{p_id}", method = RequestMethod.PUT)
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public @ResponseBody List<Project> updateProject(@PathVariable int p_id, @RequestBody Project project){
		dashboardServiceProject.updateProject(p_id, project);
		return dashboardServiceProject.getAllProject();
	}
	
	@RequestMapping(value="/projects/delete/{p_id}", method = RequestMethod.DELETE)
	public @ResponseBody void deleteProject (@PathVariable int p_id){
		dashboardServiceProject.deleteProject(p_id);
	}
}
