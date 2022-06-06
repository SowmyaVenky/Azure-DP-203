package com.example.yugabytedb.springdataexample.config;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.transaction.TransactionManager;

import com.example.yugabytedb.springdataexample.repo.CustomerYsqlRepository;
import com.yugabyte.data.jdbc.datasource.YugabyteTransactionManager;
import com.yugabyte.data.jdbc.repository.config.AbstractYugabyteJdbcConfiguration;
import com.yugabyte.data.jdbc.repository.config.EnableYsqlRepositories;

@Configuration
@EnableYsqlRepositories(basePackageClasses = CustomerYsqlRepository.class)
public class YsqlConfig extends AbstractYugabyteJdbcConfiguration {
	@Bean
    NamedParameterJdbcOperations namedParameterJdbcOperations(DataSource dataSource) { 
        return new NamedParameterJdbcTemplate(dataSource);
    }
    
    @Bean
    TransactionManager transactionManager(DataSource dataSource) {                     
        return new YugabyteTransactionManager(dataSource);
    }
}