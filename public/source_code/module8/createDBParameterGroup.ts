// Create DB Parameter Group
// This is a code snippet from Module 8
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

// Parameter Group customizes database engine settings
const dbParameterGroup = new aws.rds.ParameterGroup("db-params", {
    family: "mysql8.0",
    name: "main-db-params",
    parameters: [
        {
            name: "max_connections",
            value: "100",
        },
        {
            name: "character_set_server",
            value: "utf8mb4",
        },
    ],
    tags: {
        Name: "main-db-params",
    },
});