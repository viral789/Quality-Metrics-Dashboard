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

import com.cnerge.dashboard.pojo.GraphSprint;
import com.cnerge.dashboard.service.DashboardServiceGraphSprint;

@Controller
public class DashboardControllerGraphSprint {
	DashboardServiceGraphSprint dashboardServiceGraphSprint = new DashboardServiceGraphSprint();

	@RequestMapping(value = "/graphSprint", method = RequestMethod.GET, headers = "Accept=application/json")
	public @ResponseBody List<GraphSprint> getAllGraphInSprint() {
		List<GraphSprint> graphSprint = dashboardServiceGraphSprint
				.getAllGraphInSprint();
		return graphSprint;
	}

	@RequestMapping(value = "/graphSprint/insert", method = RequestMethod.POST)
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public @ResponseBody List<GraphSprint> addGraphInSprint(
			@RequestBody List<GraphSprint> graphSprint) {
		for (GraphSprint graphSprint2 : graphSprint) {
			dashboardServiceGraphSprint.addGraphInSprint(graphSprint2);
		}
		return dashboardServiceGraphSprint.getAllGraphInSprint();
	}

	@RequestMapping(value = "/graphSprint/update/{s_id}/{p_id}", method = RequestMethod.PUT)
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public @ResponseBody List<GraphSprint> updateGraphInSprint(
			@PathVariable int s_id, @PathVariable int p_id,
			@RequestBody List<GraphSprint> graphSprint) {
		String name = "";
		
		for (GraphSprint graphSprint2 : graphSprint) {
			if (graphSprint2.getS_id() == s_id
					&& graphSprint2.getP_id() == p_id) {
				name = graphSprint2.getG_name();
				dashboardServiceGraphSprint.updateGraphInSprint(s_id, p_id,	name, graphSprint2);
			}
		}
		return dashboardServiceGraphSprint.getAllGraphInSprint();
	}
	
	@RequestMapping(value = "/graphSprint/{p_id}", method = RequestMethod.GET, headers = "Accept=application/json")
	public @ResponseBody List<GraphSprint> getAllDataToDisplayTrendForParticularProject(@PathVariable int p_id) {
		List<GraphSprint> graphSprints = dashboardServiceGraphSprint.getAllDataToDisplayTrendForParticularProject(p_id);
		return graphSprints;
	}	
	
	
}
