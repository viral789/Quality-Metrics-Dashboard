package com.cnerge.dashboard.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cnerge.dashboard.pojo.GraphProjectData;
import com.cnerge.dashboard.pojo.Project;
import com.cnerge.dashboard.service.DashboardServiceGraph;
import com.cnerge.dashboard.service.DashboardServiceGraphProject;
import com.cnerge.dashboard.service.DashboardServiceGraphSprint;
import com.cnerge.dashboard.service.DashboardServiceProject;


@Controller
public class DashboardControllerAssignNullValue {

	DashboardServiceGraphSprint dashboardServiceGraphSprint = new DashboardServiceGraphSprint();
	DashboardServiceProject dashboardServiceProject = new DashboardServiceProject();
	DashboardServiceGraph dashboardServiceGraph = new DashboardServiceGraph();
	DashboardServiceGraphProject dashboardServiceGraphProject = new DashboardServiceGraphProject();
	
	@RequestMapping(value="/graph/assignNullValue/{s_id}", method=RequestMethod.POST)
	public @ResponseBody void assignNullValue(@PathVariable int s_id){
		List<Project> project = new ArrayList<Project>();
		List<GraphProjectData> graphProjectData = new ArrayList<GraphProjectData>();
		project = dashboardServiceProject.getAllProject();
		
		Project  projects = new Project();
		int p_id;
		String name = "";
		String validrange = "";
		for(int i = 0; i <=project.size()-1; i++){
			projects = project.get(i);
			p_id = projects.getP_id();
			graphProjectData = dashboardServiceGraph.getAllGraphForEachProject(p_id);
			for(GraphProjectData graphProjectData2 : graphProjectData){
				name = graphProjectData2.getGraph_name();
				validrange = graphProjectData2.getValidRange();
				dashboardServiceGraphSprint.assignNullValue(s_id, p_id, name, validrange);
			}
		}
	}
}
