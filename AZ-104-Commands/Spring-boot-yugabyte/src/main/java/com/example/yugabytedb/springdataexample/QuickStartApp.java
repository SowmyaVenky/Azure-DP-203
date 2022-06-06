package com.example.yugabytedb.springdataexample;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class QuickStartApp {
  public static void main(String[] args) throws ClassNotFoundException, SQLException {
    String yugabyteHost = "127.0.0.1";
    if( args != null && args.length ==1 ) {
        System.out.println("Got the server argument from user : " + args[0]);
        yugabyteHost = args[0];
    }

    Class.forName("com.yugabyte.Driver");
    //jdbc:postgresql://20.253.176.186:5433/yugabyte
    String yburl = "jdbc:postgresql://" + yugabyteHost + ":5433/yugabyte?user=yugabyte&password=yugabyte&load-balance=true";
    
    System.out.println("Using the JDBC URL : " + yburl);

    Connection conn = DriverManager.getConnection(yburl);
    Statement stmt = conn.createStatement();
    try {
        System.out.println("Connected to the YugabyteDB Cluster successfully.");
        stmt.execute("DROP TABLE IF EXISTS employee");
        stmt.execute("CREATE TABLE IF NOT EXISTS employee" +
                    "  (id int primary key, name varchar, age int, language text)");
        System.out.println("Created table employee");

        stmt.execute("DROP TABLE IF EXISTS customer");
        stmt.execute("CREATE TABLE IF NOT EXISTS customer (id VARCHAR(50) PRIMARY KEY,   name VARCHAR(50),   email  VARCHAR(50),   address VARCHAR(50),   birthday VARCHAR(50));");
        System.out.println("Created table customer");

        String insertStr = "INSERT INTO employee VALUES (1, 'John', 35, 'Java')";
        stmt.execute(insertStr);
        System.out.println("EXEC: " + insertStr);

        ResultSet rs = stmt.executeQuery("select * from employee");
        while (rs.next()) {
          System.out.println(String.format("Query returned: name = %s, age = %s, language = %s",
                                          rs.getString(2), rs.getString(3), rs.getString(4)));
        }
    } catch (SQLException e) {
      System.err.println(e.getMessage());
    }
  }
}