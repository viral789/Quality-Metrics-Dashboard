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

import com.cnerge.dashboard.pojo.Graph;
import com.cnerge.dashboard.pojo.GraphProjectData;
import com.cnerge.dashboard.service.DashboardServiceGraph;


@Controller
public class DashboardControllerGraph {
	DashboardServiceGraph dashboardServiceGraph = new DashboardServiceGraph();
	
	@RequestMapping(value="/")
	public String Main(){
		return "index";
	}
	
	@RequestMapping(value="/graphs", method=RequestMethod.GET, headers = "Accept=application/json")
	public @ResponseBody List<Graph> getAllGraph(){
		List<Graph> graphs = dashboardServiceGraph.getAllGraph();
		return graphs;
	}
	
	
	@RequestMapping(value="/graphs/insert", method = RequestMethod.POST)
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public @ResponseBody List<Graph> addProject(@RequestBody Graph graph){
		dashboardServiceGraph.addGraph(graph);
		return dashboardServiceGraph.getAllGraph();
	}
	
	
	@RequestMapping(value="/graphInSprint/{p_id}", method=RequestMethod.GET, headers = "Accept=application/json")
	public @ResponseBody List<GraphProjectData> getGraphForEachProject(@PathVariable int p_id){
		List<GraphProjectData> graphs = dashboardServiceGraph.getAllGraphForEachProject(p_id);
		return graphs;
	}
	
	@RequestMapping(value="graphs/update/{g_id}", method = RequestMethod.PUT)
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public @ResponseBody List<Graph> updateProject(@PathVariable int g_id, @RequestBody Graph graph){
		dashboardServiceGraph.updateGraph(g_id, graph);
		return dashboardServiceGraph.getAllGraph();
	}
	
	@RequestMapping(value="/graphInProject", method=RequestMethod.GET, headers = "Accept=application/json")
	public @ResponseBody List<GraphProjectData> getGraphForProject(){
		List<GraphProjectData> getGraphForProject = dashboardServiceGraph.getGraphForProject();
		return getGraphForProject;
	}
		
	@RequestMapping(value="/graphs/delete/{g_id}", method = RequestMethod.DELETE)
	public @ResponseBody void deleteProject (@PathVariable int g_id){
		dashboardServiceGraph.deleteGraph(g_id);
	}
}
