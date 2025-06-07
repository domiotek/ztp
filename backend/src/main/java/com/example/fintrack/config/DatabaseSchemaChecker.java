package com.example.fintrack.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "application.database.check-schema", havingValue = "true", matchIfMissing = false)
public class DatabaseSchemaChecker {

    private final DataSource dataSource;

    @PostConstruct
    public void checkDatabaseSchema() {
        try (Connection connection = dataSource.getConnection()) {
            log.info("=== DATABASE SCHEMA CHECK ===");
            
            DatabaseMetaData metaData = connection.getMetaData();
            log.info("Database Product: {} {}", 
                    metaData.getDatabaseProductName(), 
                    metaData.getDatabaseProductVersion());
            
            List<String> tables = new ArrayList<>();
            ResultSet rs = metaData.getTables(null, null, "%", new String[]{"TABLE"});
            while (rs.next()) {
                String tableName = rs.getString("TABLE_NAME");
                tables.add(tableName);
            }
            rs.close();
            
            log.info("Found {} tables in database:", tables.size());
            for (String table : tables) {
                log.info("  - {}", table);
            }
            
            if (tables.isEmpty()) {
                log.warn("NO TABLES FOUND! This indicates Hibernate DDL auto-creation failed.");
            } else {
                log.info("Database schema appears to be properly initialized.");
            }
            
            log.info("=== END DATABASE SCHEMA CHECK ===");
            
        } catch (Exception e) {
            log.error("Failed to check database schema", e);
        }
    }
}
