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

import com.cnerge.dashboard.pojo.GraphProject;
import com.cnerge.dashboard.service.DashboardServiceGraphProject;


@Controller
public class DashboardControllerGraphProject {
	
	DashboardServiceGraphProject dashboardServiceGraphProject = new DashboardServiceGraphProject();

	@RequestMapping(value="/graphProject", method = RequestMethod.GET, headers="Accept=application/json")
	public @ResponseBody List<GraphProject> getAllGraphInProject (){
		List<GraphProject> graphProject = dashboardServiceGraphProject.getAllGraphInProject();
		return graphProject;
	}
	
	@RequestMapping(value="/graphProject/insert", method = RequestMethod.POST)
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public @ResponseBody List<GraphProject> addGraphInProject(@RequestBody List<GraphProject> graphProject){
		for(GraphProject graphProject2 : graphProject){
			dashboardServiceGraphProject.addGraphInProject(graphProject2);
		}
		return dashboardServiceGraphProject.getAllGraphInProject();
	}
	
	@RequestMapping(value="/graphProjects/update/{p_id}", method = RequestMethod.PUT)
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public @ResponseBody List<GraphProject> updateGraphInProject(@PathVariable int p_id, @RequestBody List<GraphProject> graphProject){
		int graph_id = 0;
		for(GraphProject graphProject2 : graphProject){
			if(graphProject2.getP_id() == p_id){
				graph_id = graphProject2.getGraph_id();
				dashboardServiceGraphProject.updateGraphInProject(p_id, graph_id, graphProject2);
			}	
		}
		return dashboardServiceGraphProject.getAllGraphInProject();
	}
	
	@RequestMapping(value="graphProjects/delete/{p_id}/{graph_id}", method = RequestMethod.DELETE)
	public @ResponseBody void deleteSprint (@PathVariable int p_id, @PathVariable int graph_id){
		dashboardServiceGraphProject.deleteGraphProject(p_id, graph_id);
	}
}
