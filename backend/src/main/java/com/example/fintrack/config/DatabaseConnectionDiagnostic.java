package com.example.fintrack.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseConnectionDiagnostic {

    private final DataSource dataSource;

    @EventListener(ApplicationReadyEvent.class)
    public void performDatabaseDiagnostic() {
        log.info("=== STARTING DATABASE DIAGNOSTIC ===");
        
        try (Connection connection = dataSource.getConnection()) {
            
            log.info("Database connection established successfully");
            DatabaseMetaData metaData = connection.getMetaData();
            log.info("Database: {} {}", metaData.getDatabaseProductName(), metaData.getDatabaseProductVersion());
            log.info("Driver: {} {}", metaData.getDriverName(), metaData.getDriverVersion());
            log.info("URL: {}", metaData.getURL());
            log.info("Username: {}", metaData.getUserName());
            
            log.info("--- Checking database schema ---");
            ResultSet schemas = metaData.getSchemas();
            while (schemas.next()) {
                log.info("Schema: {}", schemas.getString("TABLE_SCHEM"));
            }
            schemas.close();
            
            log.info("--- Listing all tables ---");
            List<String> tables = new ArrayList<>();
            ResultSet rs = metaData.getTables(null, null, "%", new String[]{"TABLE"});
            while (rs.next()) {
                String tableName = rs.getString("TABLE_NAME");
                String tableSchema = rs.getString("TABLE_SCHEM");
                tables.add(tableSchema + "." + tableName);
                log.info("Table: {}.{}", tableSchema, tableName);
            }
            rs.close();
            
            if (tables.isEmpty()) {
                log.error("NO TABLES FOUND! Hibernate DDL auto-creation may have failed.");
                
                log.info("--- Checking for potential issues ---");
                log.warn("Possible causes:");
                log.warn("1. Hibernate ddl-auto setting not taking effect");
                log.warn("2. Entity classes not being scanned");
                log.warn("3. Database permissions issue");
                log.warn("4. Transaction not committed");
                
                try (Statement stmt = connection.createStatement()) {
                    log.info("--- Testing manual table creation ---");
                    stmt.execute("CREATE TABLE IF NOT EXISTS diagnostic_test (id SERIAL PRIMARY KEY, test_field VARCHAR(255))");
                    log.info("✓ Manual table creation successful - database permissions OK");
                    
                    stmt.execute("DROP TABLE IF EXISTS diagnostic_test");
                    log.info("✓ Manual table deletion successful");
                } catch (Exception e) {
                    log.error("Manual table creation failed: {}", e.getMessage());
                }
                
            } else {
                log.info("Found {} tables in database - schema appears initialized", tables.size());
            }
            
            log.info("--- Transaction info ---");
            log.info("AutoCommit: {}", connection.getAutoCommit());
            log.info("Transaction Isolation: {}", connection.getTransactionIsolation());
            
        } catch (Exception e) {
            log.error("Database diagnostic failed", e);
        }
        
        log.info("=== DATABASE DIAGNOSTIC COMPLETE ===");
    }
}
