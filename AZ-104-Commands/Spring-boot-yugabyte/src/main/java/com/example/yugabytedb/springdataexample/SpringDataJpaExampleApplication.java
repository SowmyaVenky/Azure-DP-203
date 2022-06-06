package com.example.yugabytedb.springdataexample;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = {"com.example.yugabytedb.springdataexample.domain"})  // force scan JPA entities
public class SpringDataJpaExampleApplication {

	public static void main(String[] args) {
		try {
			QuickStartApp.main(args);
		}
		catch(Exception ex) {
			ex.printStackTrace();	
		}
		SpringApplication.run(SpringDataJpaExampleApplication.class, args);
	}

}
