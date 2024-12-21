import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentazione delle API disponibili",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Server di sviluppo",
      },
    ],
  },
  apis: ["./src/infrastructure/controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const swaggerDocs = (app: any) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/api-docs.json", (_: any, res: any) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};
