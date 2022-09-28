package com.gssystems.movielens.cogsearch;

public class MovieDTO {
	private String title;
	private String tagLine;
	private String isAdult;
	private String overview;
	private Double runtime;
	private String homePage;
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getTagLine() {
		return tagLine;
	}
	public void setTagLine(String tagLine) {
		this.tagLine = tagLine;
	}
	
	public String toString() {
		return "Movie: " + title + ", tagline: " + tagLine;
	}
	public String getIsAdult() {
		return isAdult;
	}
	public void setIsAdult(String isAdult) {
		this.isAdult = isAdult;
	}
	public String getOverview() {
		return overview;
	}
	public void setOverview(String overview) {
		this.overview = overview;
	}
	public Double getRuntime() {
		return runtime;
	}
	public void setRuntime(Double runtime) {
		this.runtime = runtime;
	}
	public String getHomePage() {
		return homePage;
	}
	public void setHomePage(String homePage) {
		this.homePage = homePage;
	}
}
